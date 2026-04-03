/**
 * Figma → Code Sync Script
 *
 * Pulls design variables from the Figma REST API and regenerates SCSS token files.
 *
 * Usage:
 *   node scripts/figma-sync.mjs --token=<FIGMA_PAT>
 *   node scripts/figma-sync.mjs --token=<FIGMA_PAT> --file=<FILE_KEY>
 *   node scripts/figma-sync.mjs --from-cache
 *
 * Environment variable alternative:
 *   FIGMA_TOKEN=<PAT> node scripts/figma-sync.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FIGMA_DIR = resolve(ROOT, 'figma');
const SRC_TOKENS = resolve(ROOT, 'src/tokens');
const SRC_THEMES = resolve(ROOT, 'src/themes');

const DEFAULT_FILE_KEY = '72WrhLiMKZBoAnrABjQZuh';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    return [k, v.join('=') || true];
  })
);

const fromCache = args['from-cache'] === true;
const token = args.token || process.env.FIGMA_TOKEN;
const fileKey = args.file || DEFAULT_FILE_KEY;

if (!fromCache && !token) {
  console.error('Error: Provide --token=<FIGMA_PAT> or set FIGMA_TOKEN env variable.');
  console.error('       Use --from-cache to use the cached Figma response instead.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load transform map
// ---------------------------------------------------------------------------
const transformMap = JSON.parse(readFileSync(resolve(FIGMA_DIR, 'transform-map.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Fetch or load from cache
// ---------------------------------------------------------------------------
let figmaData;

if (fromCache) {
  console.log('Loading from cache...');
  figmaData = JSON.parse(readFileSync(resolve(FIGMA_DIR, 'variables-cache.json'), 'utf8'));
} else {
  console.log(`Fetching variables from Figma file ${fileKey}...`);
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: { 'X-Figma-Token': token },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Figma API error ${res.status}: ${body}`);
    console.error('\nFalling back to cache...');
    try {
      figmaData = JSON.parse(readFileSync(resolve(FIGMA_DIR, 'variables-cache.json'), 'utf8'));
      console.log('Loaded from cache successfully.');
    } catch {
      console.error('No cache available. Exiting.');
      process.exit(1);
    }
  } else {
    figmaData = await res.json();
    mkdirSync(FIGMA_DIR, { recursive: true });
    writeFileSync(resolve(FIGMA_DIR, 'variables-cache.json'), JSON.stringify(figmaData, null, 2));
    console.log('  Cached response to figma/variables-cache.json');
  }
}

// ---------------------------------------------------------------------------
// Parse Figma variable structure
// ---------------------------------------------------------------------------
const { meta } = figmaData;
const collections = meta.variableCollections;
const variables = meta.variables;

// Build mode name lookup: modeId → modeName
const modeLookup = {};
for (const col of Object.values(collections)) {
  for (const mode of col.modes) {
    modeLookup[mode.modeId] = mode.name;
  }
}

// Group variables by collection name
const grouped = {};
for (const v of Object.values(variables)) {
  const col = collections[v.variableCollectionId];
  if (!col) continue;
  const colName = col.name;
  if (!grouped[colName]) grouped[colName] = [];
  grouped[colName].push(v);
}

console.log(`\nFound ${Object.keys(variables).length} variables in ${Object.keys(grouped).length} collections:`);
for (const [name, vars] of Object.entries(grouped)) {
  console.log(`  ${name}: ${vars.length} variables`);
}

// ---------------------------------------------------------------------------
// Color conversion helpers
// ---------------------------------------------------------------------------
function rgbaToHex({ r, g, b, a }) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a !== undefined && a < 1) {
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
  }
  return hex;
}

function resolveValue(val, allVars) {
  if (val && val.type === 'VARIABLE_ALIAS') {
    const ref = allVars[val.id];
    if (ref) {
      // Return the reference variable name for documentation
      return { alias: ref.name, resolved: null };
    }
  }
  if (val && typeof val === 'object' && 'r' in val) {
    return { alias: null, resolved: rgbaToHex(val) };
  }
  if (typeof val === 'number') {
    return { alias: null, resolved: `${val}px` };
  }
  return { alias: null, resolved: String(val) };
}

// ---------------------------------------------------------------------------
// Generate foundation colors SCSS
// ---------------------------------------------------------------------------
function generateFoundationColors() {
  const colName = Object.keys(grouped).find(n => n.toLowerCase().includes('color'));
  if (!colName) {
    console.log('  ⚠ No color collection found, skipping foundation colors.');
    return;
  }

  const vars = grouped[colName];
  const col = Object.values(collections).find(c => c.name === colName);
  const firstModeId = col.modes[0].modeId;

  // Read existing file to preserve @manual entries
  let existingContent = '';
  try {
    existingContent = readFileSync(resolve(SRC_TOKENS, '_foundation-colors.scss'), 'utf8');
  } catch { /* file doesn't exist yet */ }

  // Extract @manual lines
  const manualLines = {};
  for (const line of existingContent.split('\n')) {
    if (line.includes('@manual')) {
      const match = line.match(/^\$([\w-]+):\s*([^;]+);/);
      if (match) manualLines[match[1]] = match[2].trim().split('//')[0].trim();
    }
  }

  const map = transformMap['foundation-colors'] || {};
  const lines = [];
  const cssProps = [];

  // Organize by palette
  const palettes = {};
  for (const v of vars) {
    const figmaName = v.name;
    const scssName = map[figmaName];
    if (!scssName) continue;

    const value = resolveValue(v.valuesByMode[firstModeId], variables);
    const hex = value.resolved;
    if (!hex) continue;

    // Extract palette name (e.g., "blue" from "$color-blue-500")
    const parts = scssName.replace('$color-', '').split('-');
    const palette = parts[0];
    const step = parts.slice(1).join('-');

    if (!palettes[palette]) palettes[palette] = [];
    palettes[palette].push({ scssName, hex, step, figmaName });
  }

  // Build SCSS content
  lines.push('// ============================================================================');
  lines.push('// Foundation / Colors');
  lines.push('// Source: Figma "Foundation / Colors" collection + extended palette steps');
  lines.push('// Tokens marked @figma-sync are managed by scripts/figma-sync.mjs');
  lines.push('// Tokens marked @manual are maintained in code only');
  lines.push('// ============================================================================');
  lines.push('');

  const allPalettes = ['blue', 'green', 'orange', 'red', 'purple', 'neutral'];

  for (const palette of allPalettes) {
    lines.push(`// --- ${palette.charAt(0).toUpperCase() + palette.slice(1)} ---`);

    // Collect all entries for this palette: synced from Figma + manual
    const synced = (palettes[palette] || []).reduce((acc, e) => {
      acc[e.scssName] = e.hex;
      return acc;
    }, {});

    // Re-read manual entries for this palette
    const allEntries = [];
    for (const line of existingContent.split('\n')) {
      const match = line.match(/^\$(color-[\w-]+):\s*([^;]+);.*\/\/\s*(@figma-sync|@manual)/);
      if (match && match[1].startsWith(`color-${palette}-`)) {
        const varName = `$${match[1]}`;
        const tag = match[3];
        const value = tag === '@figma-sync' && synced[varName] ? synced[varName] : match[2].trim();
        allEntries.push({ varName, value, tag });
        delete synced[varName];
      }
    }

    // Add any new Figma vars not in existing file
    for (const [varName, hex] of Object.entries(synced)) {
      allEntries.push({ varName, value: hex, tag: '@figma-sync' });
    }

    // Sort by step number
    allEntries.sort((a, b) => {
      const stepA = parseInt(a.varName.split('-').pop()) || 0;
      const stepB = parseInt(b.varName.split('-').pop()) || 0;
      return stepA - stepB;
    });

    for (const entry of allEntries) {
      lines.push(`${entry.varName}: ${entry.value}; // ${entry.tag}`);
    }
    lines.push('');
  }

  // CSS Custom Properties
  lines.push('// ============================================================================');
  lines.push('// CSS Custom Properties — Foundation Colors');
  lines.push('// ============================================================================');
  lines.push(':root {');

  for (const palette of allPalettes) {
    lines.push(`  // ${palette.charAt(0).toUpperCase() + palette.slice(1)}`);

    // Collect all variables for this palette from the generated SCSS above
    const paletteVars = [];
    for (const line of lines) {
      const match = line.match(/^\$(color-[\w-]+):/);
      if (match && match[1].startsWith(`color-${palette}-`)) {
        paletteVars.push(match[1]);
      }
    }

    for (const v of paletteVars) {
      lines.push(`  --${v}: #{$${v}};`);
    }
    lines.push('');
  }

  lines.push('}');

  writeFileSync(resolve(SRC_TOKENS, '_foundation-colors.scss'), lines.join('\n'));
  console.log('  ✓ Updated _foundation-colors.scss');
}

// ---------------------------------------------------------------------------
// Generate semantic tokens SCSS
// ---------------------------------------------------------------------------
function generateSemantic() {
  const colName = Object.keys(grouped).find(n => n.toLowerCase().includes('semantic') || n.toLowerCase().includes('theme'));
  if (!colName) {
    console.log('  ⚠ No semantic collection found, skipping.');
    return;
  }

  const vars = grouped[colName];
  const col = Object.values(collections).find(c => c.name === colName);
  const modes = col.modes;
  const map = transformMap['semantic'] || {};

  // Resolve values per mode
  const modeValues = {};
  for (const mode of modes) {
    modeValues[mode.name] = {};
    for (const v of vars) {
      const cssName = map[v.name];
      if (!cssName) continue;

      const rawVal = v.valuesByMode[mode.modeId];
      const result = resolveValue(rawVal, variables);

      if (result.alias) {
        // Resolve the alias to a foundation color reference
        const aliasMap = transformMap['foundation-colors'] || {};
        const scssRef = aliasMap[result.alias];
        if (scssRef) {
          modeValues[mode.name][cssName] = `#{${scssRef}}`;
        } else {
          // Try to resolve the actual value
          const aliasVar = variables[rawVal.id];
          if (aliasVar) {
            const resolved = resolveValue(aliasVar.valuesByMode[Object.keys(aliasVar.valuesByMode)[0]], variables);
            modeValues[mode.name][cssName] = resolved.resolved || '#000000';
          }
        }
      } else {
        modeValues[mode.name][cssName] = result.resolved;
      }
    }
  }

  // Find which tokens differ between modes
  const codexMode = modes.find(m => m.name.toLowerCase().includes('codex'));
  const vpMode = modes.find(m => m.name.toLowerCase().includes('vp') || m.name.toLowerCase().includes('player'));
  const codexName = codexMode?.name || modes[0].name;
  const vpName = vpMode?.name || modes[1]?.name;

  const codexValues = modeValues[codexName] || {};
  const vpValues = modeValues[vpName] || {};

  // Group semantic tokens by category
  const categories = {
    'Action': [],
    'Text': [],
    'Surface': [],
    'Border': [],
    'Status': [],
  };

  for (const [cssName, value] of Object.entries(codexValues)) {
    const cat = cssName.startsWith('--action-') ? 'Action'
      : cssName.startsWith('--text-') ? 'Text'
      : cssName.startsWith('--surface-') ? 'Surface'
      : cssName.startsWith('--border-') ? 'Border'
      : cssName.startsWith('--status-') ? 'Status'
      : null;
    if (cat) categories[cat].push({ cssName, value });
  }

  // Generate _semantic.scss
  const lines = [];
  lines.push('// ============================================================================');
  lines.push('// Semantic / Theme Tokens');
  lines.push('// Source: Figma "Semantic / Theme" collection (22 variables)');
  lines.push('// Default mode = CODEX. VP Player overrides are in themes/_vpplayer.scss');
  lines.push('// ============================================================================');
  lines.push('');
  lines.push("@use 'foundation-colors' as *;");
  lines.push('');
  lines.push(':root,');
  lines.push('[data-theme="codex"] {');

  for (const [cat, tokens] of Object.entries(categories)) {
    lines.push(`  // --- ${cat} ---`);
    for (const { cssName, value } of tokens) {
      lines.push(`  ${cssName}: ${value};`);
    }
    lines.push('');
  }

  lines.push('}');

  writeFileSync(resolve(SRC_TOKENS, '_semantic.scss'), lines.join('\n'));
  console.log('  ✓ Updated _semantic.scss');

  // Generate _vpplayer.scss (only differing tokens)
  const vpDiffs = [];
  for (const [cssName, vpVal] of Object.entries(vpValues)) {
    const codexVal = codexValues[cssName];
    if (vpVal !== codexVal) {
      vpDiffs.push({ cssName, value: vpVal });
    }
  }

  const vpLines = [];
  vpLines.push('// ============================================================================');
  vpLines.push('// Theme: VP Player');
  vpLines.push(`// Orange brand — overrides only the ${vpDiffs.length} tokens that differ from CODEX`);
  vpLines.push('// ============================================================================');
  vpLines.push('');
  vpLines.push("@use '../tokens/foundation-colors' as *;");
  vpLines.push('');
  vpLines.push('[data-theme="vpplayer"] {');
  for (const { cssName, value } of vpDiffs) {
    vpLines.push(`  ${cssName}: ${value};`);
  }
  vpLines.push('}');

  writeFileSync(resolve(SRC_THEMES, '_vpplayer.scss'), vpLines.join('\n'));
  console.log(`  ✓ Updated _vpplayer.scss (${vpDiffs.length} overrides)`);

  // Also regenerate _codex.scss for consistency
  const codexLines = [];
  codexLines.push('// ============================================================================');
  codexLines.push('// Theme: CODEX (default)');
  codexLines.push('// Blue brand — already set in :root via _semantic.scss');
  codexLines.push('// This file exists as an explicit theme class for clarity');
  codexLines.push('// ============================================================================');
  codexLines.push('');
  codexLines.push("@use '../tokens/foundation-colors' as *;");
  codexLines.push('');
  codexLines.push('[data-theme="codex"] {');
  for (const { cssName, value } of vpDiffs) {
    // Write the CODEX values for the same tokens that differ
    codexLines.push(`  ${cssName}: ${codexValues[cssName]};`);
  }
  codexLines.push('}');

  writeFileSync(resolve(SRC_THEMES, '_codex.scss'), codexLines.join('\n'));
  console.log('  ✓ Updated _codex.scss');
}

// ---------------------------------------------------------------------------
// Generate spacing tokens SCSS
// ---------------------------------------------------------------------------
function generateSpacing() {
  const colName = Object.keys(grouped).find(n => n.toLowerCase().includes('spacing'));
  if (!colName) {
    console.log('  ⚠ No spacing collection found, skipping.');
    return;
  }

  const vars = grouped[colName];
  const col = Object.values(collections).find(c => c.name === colName);
  const firstModeId = col.modes[0].modeId;
  const map = transformMap['spacing'] || {};

  let existingContent = '';
  try {
    existingContent = readFileSync(resolve(SRC_TOKENS, '_foundation-spacing.scss'), 'utf8');
  } catch { /* */ }

  // Update only @figma-sync lines
  let updated = existingContent;
  for (const v of vars) {
    const scssName = map[v.name];
    if (!scssName) continue;

    const result = resolveValue(v.valuesByMode[firstModeId], variables);
    if (!result.resolved) continue;

    // Replace the value in existing content
    const varNameEsc = scssName.replace('$', '\\$');
    const regex = new RegExp(`(${varNameEsc}:\\s*)([^;]+)(;\\s*\\/\\/\\s*@figma-sync)`);
    if (regex.test(updated)) {
      updated = updated.replace(regex, `$1${result.resolved}$3`);
    }
  }

  if (updated !== existingContent) {
    writeFileSync(resolve(SRC_TOKENS, '_foundation-spacing.scss'), updated);
    console.log('  ✓ Updated _foundation-spacing.scss');
  } else {
    console.log('  ○ _foundation-spacing.scss unchanged');
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('\nSyncing tokens...');
generateFoundationColors();
generateSemantic();
generateSpacing();

console.log('\nSync complete. Run `npm run build` to compile the updated tokens.');
