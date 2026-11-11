/**
 * Generate the parts of the Claude Code plugin (plugins/gds) that come from the GDS source.
 *
 *   node scripts/plugin.mjs write   regenerate
 *   node scripts/plugin.mjs check   fail if the plugin is out of date
 *
 * Generated (do not edit by hand):
 *   plugins/gds/.claude-plugin/plugin.json          version = package.json version
 *   plugins/gds/scripts/lint-core.mjs               copy of scripts/lib/lint-core.mjs
 *   plugins/gds/scripts/gds-data.json               compiled gds-/is- classes + component contracts
 *   plugins/gds/skills/gds-ui/SKILL.md              from scripts/templates/gds-ui-skill.md
 *   plugins/gds/skills/gds-<id>/SKILL.md             one skill per contract, same text as brand.md
 * Hand-written: plugins/gds/hooks/hooks.json, plugins/gds/scripts/gds-lint.mjs, plugins/gds/README.md
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { compiledClasses, loadContracts } from './components.mjs';
import { render } from './brand.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PLUGIN = resolve(ROOT, 'plugins/gds');
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));

function outputs() {
  const contracts = loadContracts().map(c => c.data);
  const classes = [...compiledClasses()].filter(c => c.startsWith('gds-') || c.startsWith('is-')).sort();
  const files = {};

  files['.claude-plugin/plugin.json'] = JSON.stringify({
    name: 'gds',
    displayName: 'Gjirafa Design System',
    version: pkg.version,
    description: `Build UI with GDS v${pkg.version}: component contracts as a skill, and a lint hook that checks every Vue/HTML edit against GDS.`,
    author: { name: 'Gjirafa Design System' },
    homepage: 'https://docs-phi-black.vercel.app',
    repository: 'https://github.com/fitpica/gjirafa-design-system',
    license: 'MIT',
    keywords: ['design-system', 'gds', 'vue', 'css', 'lint'],
  }, null, 2) + '\n';

  files['scripts/lint-core.mjs'] = '// GENERATED from scripts/lib/lint-core.mjs by scripts/plugin.mjs. Do not edit.\n' +
    readFileSync(resolve(ROOT, 'scripts/lib/lint-core.mjs'), 'utf8');

  files['scripts/gds-data.json'] = JSON.stringify({ version: pkg.version, cssClasses: classes, contracts }) + '\n';

  const list = contracts.map(c => `   - \`gds-${c.id}\`: ${c.name}. ${c.summary}`).join('\n');
  files['skills/gds-ui/SKILL.md'] = readFileSync(resolve(ROOT, 'scripts/templates/gds-ui-skill.md'), 'utf8')
    .replaceAll('{{version}}', pkg.version).replace('{{components}}', list);

  for (const c of contracts) {
    const desc = `GDS ${c.name} contract: exact markup, anatomy, modifiers, accessibility and rules for ${c.owns.map(o => o + '*').join(', ')}. ${c.summary} Load before writing or editing ${c.name.toLowerCase()} markup with GDS.`;
    files[`skills/gds-${c.id}/SKILL.md`] = `---\nname: gds-${c.id}\ndescription: ${JSON.stringify(desc)}\n---\n\n` + render(c).replace(/^### /, '# ') + '\n';
  }
  return files;
}

const cmd = process.argv[2];
const files = outputs();
const stale = [];
for (const [rel, content] of Object.entries(files)) {
  const path = resolve(PLUGIN, rel);
  const current = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (current === content) continue;
  if (cmd === 'write') { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); }
  stale.push(rel);
}
// component skills that no longer have a contract
const skillDir = resolve(PLUGIN, 'skills');
const orphans = existsSync(skillDir) ? readdirSync(skillDir).filter(d => d.startsWith('gds-') && d !== 'gds-ui' && !files[`skills/${d}/SKILL.md`]) : [];

if (cmd === 'write') {
  if (orphans.length) console.warn(`! Remove orphaned component skills: ${orphans.join(', ')}`);
  console.log(`✓ plugins/gds generated (v${pkg.version}, ${Object.keys(files).length} files${stale.length ? `, ${stale.length} updated` : ''})`);
} else if (cmd === 'check') {
  if (stale.length || orphans.length) {
    console.error(`✗ plugins/gds is out of date: ${[...stale, ...orphans.map(o => 'orphan ' + o)].join(', ')}. Run "npm run plugin".`);
    process.exit(1);
  }
  console.log(`✓ plugins/gds matches the GDS source (v${pkg.version})`);
} else { console.error('Usage: node scripts/plugin.mjs <write|check>'); process.exit(1); }
