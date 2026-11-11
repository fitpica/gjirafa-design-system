/**
 * Generate the component sections of brand.md (the AI guide) from components/*.json.
 *
 *   node scripts/brand.mjs write   replace every <!-- gds:component:<id>:start/end --> block
 *   node scripts/brand.mjs check   fail if brand.md differs from what the contracts produce
 *
 * Hand-written prose stays outside the markers. Inside them, edit the JSON, not brand.md.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BRAND = resolve(ROOT, 'brand.md');
const DIR = resolve(ROOT, 'components');
const PRINCIPLE = { 1: 'Accessible by default', 2: 'Reuse before you create', 3: 'Obvious over documented' };

export const contracts = Object.fromEntries(readdirSync(DIR)
  .filter(f => f.endsWith('.json') && f !== 'component.schema.json')
  .map(f => { const d = JSON.parse(readFileSync(resolve(DIR, f), 'utf8')); return [d.id, d]; }));

const code = s => `\`${s}\``;
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const short = (cls, block) => (cls.startsWith(block) && cls !== block ? cls.slice(block.length) : cls);

export function render(c) {
  const block = c.owns[0];
  const out = [];
  out.push(`### ${c.name}`, '', c.summary, '');
  if (c.useWhen?.length) out.push('**Use when:**', ...c.useWhen.map(u => `- ${u}`), '');
  if (c.dontUseWhen?.length) out.push('**Don\'t use when:**', ...c.dontUseWhen.map(d => `- ${d.case} → use ${d.use}`), '');

  for (const ex of c.examples) out.push(`**Example: ${ex.name}**`, '```html', ex.html, '```', '');

  out.push('**Anatomy** (the DOM structure is the API; keep this nesting):', '',
    '| Element | Tag | Required | Inside | Notes |', '|---|---|---|---|---|');
  for (const a of c.anatomy) {
    const attrs = a.attributes ? ' Attributes: ' + Object.entries(a.attributes).map(([k, v]) => `${code(k)} (${v})`).join(', ') + '.' : '';
    const parent = a.parent ? a.parent.split('|').map(p => code(p.trim())).join(' or ') : 'top level';
    out.push(`| ${code(a.class)} | ${cell(a.tag)} | ${a.required ? 'yes' : 'no'}${a.repeat ? ', repeats' : ''} | ${cell(parent)} | ${cell(a.description + attrs)} |`);
  }
  out.push('');

  out.push('**Modifiers:**', '', '| Class | On | Group | Effect |', '|---|---|---|---|');
  for (const m of c.modifiers) {
    const req = m.requires?.length ? ` Requires ${m.requires.map(code).join(', ')}.` : '';
    out.push(`| ${code(m.class)} | ${code(short(m.on, block) || m.on)} | ${m.group}${m.default ? ' (default)' : ''} | ${cell(m.description + req)} |`);
  }
  out.push('');

  if (c.states?.length) out.push('**States:**', ...c.states.map(s => `- **${s.name}**: ${s.how}`), '');
  if (c.a11y?.length) out.push('**Accessibility:**', ...c.a11y.map(a => `- ${a}`), '');

  out.push('**Rules:**');
  for (const r of c.rules) out.push(`- ${r.rule} *Why:* ${r.why} (${PRINCIPLE[r.principle]}${r.autoCheck ? ' · auto-checkable' : ''})`);
  out.push('');

  if (c.internal?.length) out.push('**Do not use** (exist in the CSS for docs only):', ...c.internal.map(i => `- ${code(i.class)}: ${i.why}`), '');
  if (c.knownIssues?.length) out.push('**Known issues** (flag them; work around one only where it says how, using GDS tokens):', ...c.knownIssues.map(k => `- ${k.issue} *Planned fix:* ${k.fix}`), '');

  out.push(`*Generated from \`components/${c.id}.json\`. Edit that file, then run \`npm run brand\`.*`);
  return out.join('\n');
}

function build(text) {
  let result = text;
  const seen = new Set();
  result = result.replace(/<!-- gds:component:([a-z-]+):start -->[\s\S]*?<!-- gds:component:\1:end -->/g, (_, id) => {
    if (!contracts[id]) throw new Error(`brand.md has a block for "${id}" but components/${id}.json does not exist`);
    seen.add(id);
    return `<!-- gds:component:${id}:start -->\n${render(contracts[id])}\n<!-- gds:component:${id}:end -->`;
  });
  const missing = Object.keys(contracts).filter(id => !seen.has(id));
  if (missing.length) throw new Error(`No block in brand.md for: ${missing.join(', ')}. Add <!-- gds:component:<id>:start --> / end markers.`);
  return result;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();

function main() {
const cmd = process.argv[2];
const current = readFileSync(BRAND, 'utf8');
const next = build(current);
if (cmd === 'write') {
  if (next !== current) writeFileSync(BRAND, next);
  console.log(`✓ brand.md: ${Object.keys(contracts).length} component sections generated from components/*.json`);
} else if (cmd === 'check') {
  if (next !== current) { console.error('✗ brand.md is out of date with components/*.json. Run "npm run brand".'); process.exit(1); }
  console.log(`✓ brand.md component sections match components/*.json (${Object.keys(contracts).length})`);
} else { console.error('Usage: node scripts/brand.mjs <write|check>'); process.exit(1); }
}
