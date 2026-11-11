/**
 * GDS component contracts — check and lint
 *
 *   node scripts/components.mjs check          validate the contracts themselves
 *   node scripts/components.mjs lint <file>    check any HTML or .vue file against the contracts
 *
 * check, for every components/<id>.json:
 *   1. valid against components/component.schema.json
 *   2. every class it names exists in the compiled CSS
 *   3. complete: every compiled class it owns is documented (anatomy, modifiers or internal)
 *   4. modifiers attach to an element of the same component
 *   5. its examples pass lint (scripts/lib/lint-core.mjs)
 */

import * as sass from 'sass';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createLinter, parse, vueTemplate, IMPLEMENTED_RULES } from './lib/lint-core.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = process.env.GDS_COMPONENTS_DIR ? resolve(process.env.GDS_COMPONENTS_DIR) : resolve(ROOT, 'components');

export function compiledClasses() {
  const css = sass.compile(resolve(ROOT, 'src/index.scss'), { style: 'expanded', loadPaths: [resolve(ROOT, 'src')] }).css
    .replace(/\/\*[\s\S]*?\*\//g, '');
  return new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(m => m[1]));
}
export function loadContracts(dir = DIR) {
  return readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'component.schema.json').sort()
    .map(f => ({ file: f, data: JSON.parse(readFileSync(resolve(dir, f), 'utf8')) }));
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();

function main() {
  const cssClasses = compiledClasses();
  const contracts = loadContracts();
  const linter = createLinter({ cssClasses: [...cssClasses], contracts: contracts.map(c => c.data) });
  const cmd = process.argv[2];

  if (cmd === 'lint') {
    const file = process.argv[3];
    if (!file) { console.error('Usage: node scripts/components.mjs lint <file.html|file.vue>'); process.exit(1); }
    let src = readFileSync(resolve(file), 'utf8');
    if (file.endsWith('.vue')) src = vueTemplate(src);
    const problems = linter.lint(src, { lenient: true });
    const unc = linter.uncovered(src);
    if (unc.length) console.log(`Not covered by a contract yet (not checked): ${unc.join(', ')}`);
    if (problems.length) {
      console.error(`✗ ${problems.length} problem(s) in ${file}:`);
      problems.forEach(p => console.error(`  - [${p.rule}] ${p.message}`));
      process.exit(1);
    }
    console.log(`✓ ${file} follows the GDS contracts (${IMPLEMENTED_RULES.length} rules + structure)`);
    return;
  }
  if (cmd !== 'check') { console.error('Usage: node scripts/components.mjs <check | lint <file>>'); process.exit(1); }

  const schema = JSON.parse(readFileSync(resolve(DIR, 'component.schema.json'), 'utf8'));
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const alts = s => (s ?? '').split('|').map(x => x.trim()).filter(Boolean);

  const errors = [];
  const err = (c, msg) => errors.push(`${c}: ${msg}`);
  let autoChecks = 0, manualChecks = 0, v3 = 0;
  const allRuleIds = new Set();

  for (const { file, data } of contracts) {
    const id = file.replace(/\.json$/, '');
    if (!validate(data)) { validate.errors.forEach(e => err(file, `schema ${e.instancePath || '/'} ${e.message}`)); continue; }
    if (data.id !== id) err(file, `id "${data.id}" must match the file name`);

    const own = new Set([...data.anatomy.map(a => a.class), ...data.modifiers.map(m => m.class), ...(data.internal ?? []).map(i => i.class)]);
    const anatomy = new Set(data.anatomy.map(a => a.class));

    const named = [...own, ...data.anatomy.flatMap(a => alts(a.parent)), ...data.modifiers.flatMap(m => [m.on, ...(m.requires ?? [])])];
    for (const c of new Set(named)) if (!cssClasses.has(c)) err(id, `.${c} is not in the compiled CSS`);
    for (const c of cssClasses) {
      if (data.owns.some(p => c === p || c.startsWith(p + '-') || c.startsWith(p + '_')) && !own.has(c)) err(id, `.${c} exists in the CSS but is not documented`);
    }
    for (const m of data.modifiers) if (!anatomy.has(m.on)) err(id, `modifier .${m.class} is "on" .${m.on}, which is not in this anatomy`);
    for (const r of data.rules) { allRuleIds.add(r.id); r.autoCheck ? autoChecks++ : manualChecks++; if (r.removeInV3) v3++; }

    for (const ex of data.examples) {
      const where = `${id} › example "${ex.name}"`;
      let tree;
      try { tree = parse(ex.html); } catch (e) { err(where, e.message); continue; }
      linter.lintTree(tree).forEach(p => err(where, `[${p.rule}] ${p.message}`));
    }
  }
  for (const id of IMPLEMENTED_RULES) if (!allRuleIds.has(id)) err('scripts/lib/lint-core.mjs', `implements "${id}" but no contract defines that rule`);

  console.log(`Components: ${contracts.length} (${contracts.map(c => c.data.id).join(', ')})`);
  console.log(`Classes documented: ${linter.documented.size} · Rules: ${autoChecks + manualChecks} (${autoChecks} auto-checkable, ${IMPLEMENTED_RULES.length} implemented in lint, ${manualChecks} manual, ${v3} with a v3 fix)`);
  if (errors.length) {
    console.error(`\n✗ ${errors.length} problem(s):`);
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
  }
  console.log('✓ All contracts valid, complete and consistent with the compiled CSS; all examples pass lint');
}
