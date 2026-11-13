/**
 * GDS design tokens ⇄ W3C DTCG 2025.10
 *
 *   node scripts/tokens.mjs extract   SCSS → tokens/*.tokens.json + tokens/gds.resolver.json
 *   node scripts/tokens.mjs check     resolve the DTCG files per theme and compare every
 *                                     --gds-* value with the CSS that SCSS compiles to
 *   node scripts/tokens.mjs bundle    write dist/tokens.json (default theme, one file)
 *
 * Phase A, step 1: SCSS is still the source of truth (figma-sync writes SCSS).
 * The DTCG files are generated from it and `check` proves they describe exactly
 * the same values. Flipping the source to DTCG is a later step.
 */

import * as sass from 'sass';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'src');
const OUT = resolve(ROOT, 'tokens');
const NS = 'com.gjirafa.gds';
const SCHEMA = 'https://www.designtokens.org/schemas/2025.10/format.json';

// ---------------------------------------------------------------------------
// 1. Read compiled CSS: every --gds-* value per selector
// ---------------------------------------------------------------------------
function compiledValues() {
  const css = sass.compile(resolve(SRC, 'index.scss'), { style: 'expanded', loadPaths: [SRC] }).css;
  const root = {}, codex = {}, vpplayer = {};
  for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const s = sel.trim().replace(/\s+/g, ' ');
    for (const [, name, value] of body.matchAll(/(--gds-[\w-]+)\s*:\s*([^;]+);/g)) {
      const v = value.trim();
      if (s === ':root' || s.startsWith(':root,')) root[name] ??= v;
      if (s.includes('[data-theme=codex]')) codex[name] = v;
      if (s === '[data-theme=vpplayer]') vpplayer[name] = v;
    }
  }
  return { root, codex, vpplayer };
}

// ---------------------------------------------------------------------------
// 2. Read SCSS sources: which $variable backs each --gds-* property
// ---------------------------------------------------------------------------
function scssSources() {
  const read = (dir, file) => {
    const map = {};
    const text = readFileSync(resolve(dir, file), 'utf8');
    for (const [, name, v] of text.matchAll(/(--gds-[\w-]+)\s*:\s*#\{\s*(\$[\w-]+)\s*\}/g)) map[name] = v;
    return map;
  };
  const tokenDir = resolve(SRC, 'tokens');
  const foundation = {};
  for (const f of readdirSync(tokenDir).filter(f => f.startsWith('_foundation-'))) Object.assign(foundation, read(tokenDir, f));
  return {
    foundation,
    semantic: read(tokenDir, '_semantic.scss'),
    vpplayer: read(resolve(SRC, 'themes'), '_vpplayer.scss'),
  };
}

// Hand-written "when to use" text for each semantic token (figma-sync never touches it).
const DESCRIPTIONS = resolve(SRC, 'tokens', 'semantic-descriptions.json');
function semanticDescriptions() {
  const { $comment, ...d } = JSON.parse(readFileSync(DESCRIPTIONS, 'utf8'));
  return d;
}

// ---------------------------------------------------------------------------
// 3. Name → DTCG path, and path → $type
// ---------------------------------------------------------------------------
const HUES = ['blue', 'neutral', 'green', 'orange', 'red', 'purple'];
const ROLES = ['brand', 'action', 'text', 'bg', 'border'];
const FEEDBACK = ['error', 'success', 'warning'];
const PREFIXES = [
  ['border-width-', ['border-width']], ['font-family-', ['font', 'family']],
  ['font-weight-', ['font', 'weight']], ['font-size-', ['font', 'size']],
  ['line-height-', ['line-height']], ['letter-spacing-', ['letter-spacing']],
  ['scroll-shadow-', ['scroll-shadow']], ['shadow-', ['shadow']],
  ['space-', ['space']], ['radius-', ['radius']], ['icon-', ['icon']],
  ['opacity-', ['opacity']], ['duration-', ['duration']], ['delay-', ['delay']],
  ['ease-', ['ease']], ['z-', ['z-index']],
];

function pathOf(cssVar) {
  const rest = cssVar.replace(/^--gds-/, '');
  if (rest === 'overlay-bg') return ['color', 'overlay', 'bg'];
  if (rest.startsWith('color-')) {
    const parts = rest.slice(6).split('-');
    if (HUES.includes(parts[0])) return ['color', parts[0], parts.slice(1).join('-')];
    if (FEEDBACK.includes(parts[0])) return ['color', 'feedback', parts.join('-')];
    if (ROLES.includes(parts[0])) return ['color', parts[0], parts.slice(1).join('-')];
  }
  for (const [p, group] of PREFIXES) if (rest.startsWith(p)) return [...group, rest.slice(p.length)];
  throw new Error(`No DTCG path rule for ${cssVar}`);
}

// Tokens DTCG 2025.10 has no type for: letter-spacing in em (dimension allows px/rem only)
// and an "r, g, b" triple. They stay as raw CSS in $extensions so nothing is lost or faked.
const RAW = p => p[0] === 'letter-spacing' || (p[0] === 'scroll-shadow' && p[1] === 'rgb');

function typeOf(p) {
  const g = p[0];
  if (g === 'color') return 'color';
  if (g === 'font') return { family: 'fontFamily', weight: 'fontWeight', size: 'dimension' }[p[1]];
  if (g === 'icon') return p[1] === 'stroke' ? 'number' : 'dimension';
  if (['space', 'radius', 'border-width'].includes(g)) return 'dimension';
  if (['opacity', 'line-height', 'z-index', 'scroll-shadow'].includes(g)) return 'number';
  if (g === 'shadow') return 'shadow';
  if (g === 'duration' || g === 'delay') return 'duration';
  if (g === 'ease') return 'cubicBezier';
  throw new Error(`No $type for ${p.join('.')}`);
}

// ---------------------------------------------------------------------------
// 4. CSS string ⇄ DTCG value
// ---------------------------------------------------------------------------
const round = n => Math.round(n * 1e6) / 1e6;

function parseColor(s) {
  let m = s.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const h = m[1];
    return { colorSpace: 'srgb', components: [0, 2, 4].map(i => round(parseInt(h.slice(i, i + 2), 16) / 255)), hex: s };
  }
  m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (m) {
    const c = { colorSpace: 'srgb', components: [m[1], m[2], m[3]].map(x => round(+x / 255)) };
    if (m[4] !== undefined) c.alpha = +m[4];
    return c;
  }
  throw new Error(`Unparsed color: ${s}`);
}
function formatColor(c) {
  if (c.hex && (c.alpha ?? 1) === 1) return c.hex;
  const [r, g, b] = c.components.map(x => Math.round(x * 255));
  return c.alpha === undefined ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${c.alpha})`;
}

function parseDim(s) {
  if (s === '0') return { value: 0, unit: 'px' };
  const m = s.match(/^(-?[\d.]+)(px|rem)$/);
  if (!m) throw new Error(`Unparsed dimension: ${s}`);
  return { value: +m[1], unit: m[2] };
}
const formatDim = (d, bareZero = false) => (bareZero && d.value === 0 ? '0' : `${d.value}${d.unit}`);

function splitTop(s) { // split on spaces outside parentheses
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ' ' && depth === 0) { if (cur) out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

function parseValue(type, s) {
  switch (type) {
    case 'color': return parseColor(s);
    case 'dimension': return parseDim(s);
    case 'number': case 'fontWeight': return +s;
    case 'fontFamily': return s.split(',').map(x => x.trim());
    case 'duration': {
      const m = s.match(/^([\d.]+)(ms|s)$/); if (!m) throw new Error(`Unparsed duration: ${s}`);
      return { value: +m[1], unit: m[2] };
    }
    case 'cubicBezier':
      if (s === 'linear') return [0, 0, 1, 1];
      return s.match(/^cubic-bezier\(([^)]+)\)$/)[1].split(',').map(x => +x.trim());
    case 'shadow': {
      const parts = splitTop(s);
      const inset = parts[0] === 'inset'; if (inset) parts.shift();
      const [offsetX, offsetY, blur, spread, color] = parts;
      const v = { color: parseColor(color), offsetX: parseDim(offsetX), offsetY: parseDim(offsetY), blur: parseDim(blur), spread: parseDim(spread) };
      if (inset) v.inset = true;
      return v;
    }
  }
  throw new Error(`No parser for ${type}`);
}

function formatValue(type, v) {
  switch (type) {
    case 'color': return formatColor(v);
    case 'dimension': return formatDim(v);
    case 'number': case 'fontWeight': return String(v);
    case 'fontFamily': return v.join(', ');
    case 'duration': return `${v.value}${v.unit}`;
    case 'cubicBezier': return v.join() === '0,0,1,1' ? 'linear' : `cubic-bezier(${v.join(', ')})`;
    case 'shadow':
      return [v.inset ? 'inset' : null, formatDim(v.offsetX, true), formatDim(v.offsetY, true), formatDim(v.blur, true), formatDim(v.spread, true), formatColor(v.color)].filter(Boolean).join(' ');
  }
  throw new Error(`No formatter for ${type}`);
}

// ---------------------------------------------------------------------------
// 5. extract: build the DTCG files
// ---------------------------------------------------------------------------
function setIn(obj, path, leaf) {
  let o = obj;
  for (const k of path.slice(0, -1)) o = o[k] ??= {};
  if (o[path.at(-1)]) throw new Error(`Duplicate token path ${path.join('.')}`);
  o[path.at(-1)] = leaf;
}

function extract() {
  const css = compiledValues();
  const scss = scssSources();
  const scssToFoundation = Object.fromEntries(Object.entries(scss.foundation).map(([name, v]) => [v, name]));

  const makeFile = (description) => ({ $schema: SCHEMA, $description: description });
  const foundation = makeFile('GDS foundation tokens: raw palette, spacing, type, shadow, motion, z-index. Generated from src/tokens/_foundation-*.scss by scripts/tokens.mjs; do not edit by hand.');
  const semantic = makeFile('GDS semantic tokens, default theme (codex). Aliases point at foundation tokens. Generated from src/tokens/_semantic.scss.');
  const vpplayer = makeFile('VP Player theme: only the tokens that differ from codex. Generated from src/themes/_vpplayer.scss.');
  const raw = {};

  const leaf = (cssVar, scssVar, cssValue, { allowAlias }) => {
    const p = pathOf(cssVar);
    const ext = { [NS]: { cssVar, scss: scssVar } };
    const target = allowAlias && scssToFoundation[scssVar];
    if (target) return [p, { $type: typeOf(pathOf(target)), $value: `{${pathOf(target).join('.')}}`, $extensions: ext }];
    const type = typeOf(p);
    return [p, { $type: type, $value: parseValue(type, cssValue), $extensions: ext }];
  };

  for (const [cssVar, scssVar] of Object.entries(scss.foundation)) {
    const p = pathOf(cssVar);
    if (RAW(p)) { raw[cssVar] = css.root[cssVar]; continue; }
    setIn(foundation, ...leaf(cssVar, scssVar, css.root[cssVar], { allowAlias: false }));
  }
  const descriptions = semanticDescriptions();
  for (const [cssVar, scssVar] of Object.entries(scss.semantic)) {
    const [p, t] = leaf(cssVar, scssVar, css.root[cssVar], { allowAlias: true });
    setIn(semantic, p, descriptions[cssVar] ? { $description: descriptions[cssVar], ...t } : t);
  }
  for (const [cssVar, scssVar] of Object.entries(scss.vpplayer)) setIn(vpplayer, ...leaf(cssVar, scssVar, css.vpplayer[cssVar], { allowAlias: true }));

  foundation.$extensions = {
    [NS]: {
      unstandardTokens: raw,
      note: 'DTCG 2025.10 has no type for these values (letter-spacing in em; an "r, g, b" triple), so they are kept as raw CSS.',
    },
  };

  const resolver = {
    $schema: 'https://www.designtokens.org/schemas/2025.10/resolver.json',
    name: 'Gjirafa Design System',
    version: '2025.10',
    description: 'Foundation + semantic tokens, with a theme modifier. codex is the default theme.',
    sets: {
      foundation: { sources: [{ $ref: 'foundation.tokens.json' }] },
      semantic: { sources: [{ $ref: 'semantic.tokens.json' }] },
    },
    modifiers: {
      theme: {
        description: 'Product theme. codex = blue (default), vpplayer = orange.',
        contexts: { codex: [], vpplayer: [{ $ref: 'themes/vpplayer.tokens.json' }] },
        default: 'codex',
      },
    },
    resolutionOrder: [{ $ref: '#/sets/foundation' }, { $ref: '#/sets/semantic' }, { $ref: '#/modifiers/theme' }],
  };

  mkdirSync(resolve(OUT, 'themes'), { recursive: true });
  const write = (f, o) => writeFileSync(resolve(OUT, f), JSON.stringify(o, null, 2) + '\n');
  write('foundation.tokens.json', foundation);
  write('semantic.tokens.json', semantic);
  write('themes/vpplayer.tokens.json', vpplayer);
  write('gds.resolver.json', resolver);
  const count = o => Object.entries(o).reduce((n, [k, v]) => n + (k.startsWith('$') ? 0 : v.$value !== undefined ? 1 : count(v)), 0);
  console.log(`✓ tokens/foundation.tokens.json   ${count(foundation)} tokens (+${Object.keys(raw).length} raw)`);
  console.log(`✓ tokens/semantic.tokens.json     ${count(semantic)} tokens`);
  console.log(`✓ tokens/themes/vpplayer.tokens.json ${count(vpplayer)} tokens`);
  console.log('✓ tokens/gds.resolver.json');
}

// ---------------------------------------------------------------------------
// 6. Resolve a theme: merge sets in resolutionOrder, follow aliases, format as CSS
// ---------------------------------------------------------------------------
const readJSON = f => JSON.parse(readFileSync(resolve(OUT, f), 'utf8'));

function flatten(obj, path = [], out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out[[...path, k].join('.')] = v;
    else if (v && typeof v === 'object') flatten(v, [...path, k], out);
  }
  return out;
}

function resolveTheme(theme) {
  const r = readJSON('gds.resolver.json');
  const tokens = {};
  let rawTokens = {};
  for (const { $ref } of r.resolutionOrder) {
    const [, kind, name] = $ref.split('/');
    const sources = kind === 'sets' ? r.sets[name].sources : r.modifiers[name].contexts[theme ?? r.modifiers[name].default];
    if (!sources) throw new Error(`Unknown context ${theme} for modifier ${name}`);
    for (const { $ref: file } of sources) {
      const doc = readJSON(file);
      Object.assign(tokens, flatten(doc));
      rawTokens = { ...rawTokens, ...(doc.$extensions?.[NS]?.unstandardTokens ?? {}) };
    }
  }
  const valueOf = (path, seen = []) => {
    const t = tokens[path];
    if (!t) throw new Error(`Broken alias {${path}}`);
    if (seen.includes(path)) throw new Error(`Alias loop: ${[...seen, path].join(' → ')}`);
    const m = typeof t.$value === 'string' && t.$value.match(/^\{(.+)\}$/);
    return m ? valueOf(m[1], [...seen, path]) : t;
  };
  const css = { ...rawTokens };
  for (const [path, t] of Object.entries(tokens)) {
    const target = valueOf(path);
    css[t.$extensions[NS].cssVar] = formatValue(target.$type, target.$value);
  }
  return css;
}

// ---------------------------------------------------------------------------
// 7. check: DTCG (resolved) must equal compiled CSS, value for value
// ---------------------------------------------------------------------------
function check() {
  const css = compiledValues();
  const expected = {
    codex: { ...css.root, ...css.codex },
    vpplayer: { ...css.root, ...css.vpplayer },
  };
  let failures = 0;
  for (const theme of ['codex', 'vpplayer']) {
    const got = resolveTheme(theme);
    const want = expected[theme];
    const names = new Set([...Object.keys(got), ...Object.keys(want)]);
    let ok = 0;
    for (const n of names) {
      if (got[n] === want[n]) { ok++; continue; }
      failures++;
      console.log(`  ✗ [${theme}] ${n}: DTCG=${got[n] ?? '(missing)'}  CSS=${want[n] ?? '(missing)'}`);
    }
    console.log(`${ok === names.size ? '✓' : '✗'} ${theme}: ${ok}/${names.size} --gds-* values identical to compiled CSS`);
  }
  // Every semantic token needs a description, and every description a token.
  const semanticVars = Object.keys(scssSources().semantic);
  const descriptions = semanticDescriptions();
  const missing = semanticVars.filter(v => !descriptions[v]?.trim());
  const unknown = Object.keys(descriptions).filter(v => !semanticVars.includes(v));
  for (const v of missing) console.log(`  ✗ ${v}: no description in src/tokens/semantic-descriptions.json`);
  for (const v of unknown) console.log(`  ✗ ${v}: described in src/tokens/semantic-descriptions.json but not a semantic token`);
  console.log(`${missing.length + unknown.length ? '✗' : '✓'} descriptions: ${semanticVars.length - missing.length}/${semanticVars.length} semantic tokens described`);
  failures += missing.length + unknown.length;
  if (failures) { console.error(`\n${failures} mismatch(es). Run "node scripts/tokens.mjs extract" after changing SCSS.`); process.exit(1); }
}

// ---------------------------------------------------------------------------
// 8. bundle: one DTCG file for consumers (dist/tokens.json), default theme
// ---------------------------------------------------------------------------
function bundle() {
  const foundation = readJSON('foundation.tokens.json');
  const semantic = readJSON('semantic.tokens.json');
  const merged = { $schema: SCHEMA, $description: 'Gjirafa Design System tokens (DTCG 2025.10), default theme codex. Other themes: tokens/gds.resolver.json.' };
  const deepMerge = (a, b) => { for (const [k, v] of Object.entries(b)) { if (k === '$schema' || k === '$description') continue; a[k] = v && typeof v === 'object' && !('$value' in v) && a[k] ? deepMerge(a[k], v) : v; } return a; };
  deepMerge(merged, foundation); deepMerge(merged, semantic);
  mkdirSync(resolve(ROOT, 'dist'), { recursive: true });
  writeFileSync(resolve(ROOT, 'dist/tokens.json'), JSON.stringify(merged, null, 2) + '\n');
  console.log('✓ dist/tokens.json (DTCG, codex)');
}

const cmd = process.argv[2];
if (cmd === 'extract') extract();
else if (cmd === 'check') check();
else if (cmd === 'bundle') bundle();
else { console.error('Usage: node scripts/tokens.mjs <extract|check|bundle>'); process.exit(1); }
