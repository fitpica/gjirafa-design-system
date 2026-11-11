/**
 * Docs for AI agents: llms.txt + Markdown pages, generated from the GDS source.
 *
 *   node scripts/llms.mjs write   regenerate docs/llms.txt and docs/md/
 *   node scripts/llms.mjs check   fail if they are out of date
 *
 * Output (served by the docs site, e.g. https://docs-phi-black.vercel.app/llms.txt):
 *   docs/llms.txt                       index in the llms.txt format (llmstxt.org)
 *   docs/llms-full.txt                  the whole AI guide (brand.md) in one file
 *   docs/md/components/<id>.md          one page per component contract
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { contracts, render } from './brand.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');
const SITE = 'https://docs-phi-black.vercel.app';
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const CDN = `https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v${pkg.version}`;

function outputs() {
  const files = {};
  const list = Object.values(contracts).sort((a, b) => a.name.localeCompare(b.name));

  for (const c of list) files[`md/components/${c.id}.md`] = render(c).replace(/^### /, '# ') + '\n';

  files['llms-full.txt'] = readFileSync(resolve(ROOT, 'brand.md'), 'utf8');

  files['llms.txt'] = [
    '# Gjirafa Design System (GDS)',
    '',
    `> CSS-only design system (gds-* classes, --gds-* tokens) for Gjirafa products. Version ${pkg.version}. Load the CSS from the CDN, write semantic HTML with GDS classes, and follow each component contract exactly: the DOM structure is the API. Never invent classes, variants or tokens.`,
    '',
    'Principles: 1) Accessible by default (every allowed combination passes WCAG AA). 2) Reuse before you create (if GDS lacks something, say so). 3) Obvious over documented.',
    '',
    '## Start here',
    '',
    `- [AI guide (full)](${SITE}/llms-full.txt): setup, principles, rules, tokens and every component in one file`,
    `- [CSS](${CDN}/docs/gjirafa-ds.css): the only file a page needs; pin the version`,
    `- [Claude Code plugin](https://github.com/fitpica/gjirafa-design-system/tree/main/plugins/gds): component skills plus a lint hook (\`/plugin install gds --marketplace fitpica/gjirafa-design-system\`)`,
    '',
    '## Components',
    '',
    ...list.map(c => `- [${c.name}](${SITE}/md/components/${c.id}.md): ${c.summary}`),
    '',
    '## Data',
    '',
    `- [Design tokens (DTCG 2025.10)](${CDN}/tokens/gds.resolver.json): resolver with foundation, semantic and theme sets`,
    `- [Component contracts (JSON)](https://github.com/fitpica/gjirafa-design-system/tree/main/components): anatomy, modifiers, a11y, rules and examples per component`,
    '',
    '## Optional',
    '',
    `- [Live docs](${SITE}): interactive examples for every component (\`?page=<component>\`)`,
    `- [Release notes](https://github.com/fitpica/gjirafa-design-system/releases)`,
    '',
  ].join('\n');
  return files;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const cmd = process.argv[2];
  const files = outputs();
  const stale = [];
  for (const [rel, content] of Object.entries(files)) {
    const path = resolve(DOCS, rel);
    if ((existsSync(path) ? readFileSync(path, 'utf8') : null) === content) continue;
    if (cmd === 'write') { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); }
    stale.push(rel);
  }
  const mdDir = resolve(DOCS, 'md/components');
  const orphans = existsSync(mdDir) ? readdirSync(mdDir).filter(f => !files[`md/components/${f}`]) : [];
  if (cmd === 'write') {
    if (orphans.length) console.warn(`! Remove orphaned pages: ${orphans.join(', ')}`);
    console.log(`✓ docs/llms.txt + ${Object.keys(files).length - 2} Markdown component pages${stale.length ? ` (${stale.length} updated)` : ''}`);
  } else if (cmd === 'check') {
    if (stale.length || orphans.length) { console.error(`✗ docs for agents are out of date: ${[...stale, ...orphans].join(', ')}. Run "npm run llms".`); process.exit(1); }
    console.log('✓ docs/llms.txt and Markdown pages match the source');
  } else { console.error('Usage: node scripts/llms.mjs <write|check>'); process.exit(1); }
}
