/**
 * GDS component contracts — check and lint
 *
 *   node scripts/components.mjs check          validate the contracts themselves
 *   node scripts/components.mjs lint <file>    check any HTML file against the contracts
 *
 * check, for every components/<id>.json:
 *   1. valid against components/component.schema.json
 *   2. every class it names exists in the compiled CSS
 *   3. complete: every compiled class it owns is documented (anatomy, modifiers or internal)
 *   4. modifiers attach to an element of the same component
 *   5. its examples pass lint
 *
 * lint (also used for the examples):
 *   - structure: real classes, no internal classes, correct parents, required children,
 *     required companion modifiers, at most one modifier per size/variant group
 *   - the rules marked autoCheck that are implemented in RULE_CHECKS below
 */

import * as sass from 'sass';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = process.env.GDS_COMPONENTS_DIR ? resolve(process.env.GDS_COMPONENTS_DIR) : resolve(ROOT, 'components');

// --- compiled CSS classes -----------------------------------------------------
const css = sass.compile(resolve(ROOT, 'src/index.scss'), { style: 'expanded', loadPaths: [resolve(ROOT, 'src')] }).css
  .replace(/\/\*[\s\S]*?\*\//g, '');
const cssClasses = new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(m => m[1]));

// --- load contracts -----------------------------------------------------------
const schema = JSON.parse(readFileSync(resolve(DIR, 'component.schema.json'), 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const files = readdirSync(DIR).filter(f => f.endsWith('.json') && f !== 'component.schema.json').sort();
const contracts = files.map(f => ({ file: f, data: JSON.parse(readFileSync(resolve(DIR, f), 'utf8')) }));
const byId = Object.fromEntries(contracts.map(c => [c.data.id, c.data]));

const documented = new Map(); // class → { component, kind, item }
for (const { data } of contracts) {
  for (const a of data.anatomy ?? []) documented.set(a.class, { component: data.id, kind: 'anatomy', item: a });
  for (const m of data.modifiers ?? []) if (!documented.has(m.class)) documented.set(m.class, { component: data.id, kind: 'modifier', item: m });
  for (const i of data.internal ?? []) documented.set(i.class, { component: data.id, kind: 'internal', item: i });
}
const ownedBy = cls => contracts.find(({ data }) => data.owns.some(p => cls === p || cls.startsWith(p + '-') || cls.startsWith(p + '_')))?.data;
const alts = s => (s ?? '').split('|').map(x => x.trim()).filter(Boolean);

// --- small HTML parser ----------------------------------------------------------
const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'col', 'area', 'base', 'wbr']);
function parse(html, { lenient = false } = {}) {
  const src = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<!doctype[^>]*>/i, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const root = { tag: '#root', classes: [], attrs: {}, children: [], parent: null, text: '' };
  let cur = root, last = 0;
  for (const m of src.matchAll(/<\/?([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g)) {
    const text = src.slice(last, m.index); last = m.index + m[0].length;
    for (let e = cur; e; e = e.parent) e.text += text;
    const [whole, rawTag, rest, selfClose] = m;
    const tag = rawTag.toLowerCase();
    if (whole.startsWith('</')) {
      if (cur.tag !== tag) {
        if (!lenient) throw new Error(`Mismatched </${tag}> (open: <${cur.tag}>)`);
        let e = cur; while (e && e.tag !== tag) e = e.parent;
        if (e) cur = e; else continue;
      }
      cur = cur.parent; continue;
    }
    const attrs = Object.fromEntries([...rest.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(a => [a[1].toLowerCase(), a[2] ?? a[3] ?? a[4] ?? '']));
    const el = { tag, classes: (attrs.class ?? '').split(/\s+/).filter(Boolean), attrs, children: [], parent: cur, text: '' };
    cur.children.push(el);
    if (!VOID.has(tag) && !selfClose) cur = el;
  }
  if (cur !== root && !lenient) throw new Error(`Unclosed <${cur.tag}>`);
  return root;
}
const walk = (el, fn) => { fn(el); el.children.forEach(c => walk(c, fn)); };
const find = (el, pred) => { const out = []; walk(el, e => { if (e !== el && pred(e)) out.push(e); }); return out; };
const ancestors = el => { const out = []; for (let p = el.parent; p; p = p.parent) out.push(p); return out; };
const has = (el, c) => el.classes.includes(c);
const txt = el => el.text.replace(/\s+/g, ' ').trim();

// --- rule checks (ids match components/*.json rules) ---------------------------
const STATUS_BADGE = { Published: 'gds-badge--positive', Draft: 'gds-badge--neutral', Scheduled: 'gds-badge--warning', Archived: 'gds-badge--neutral' };
const RULE_CHECKS = {
  'table-root-class': (root, fail) => walk(root, e => { if (has(e, 'gds-data-table')) fail(e, 'use .gds-table; .gds-data-table does not exist'); }),
  'table-th-scope': (root, fail) => find(root, e => has(e, 'gds-table__table')).forEach(t => find(t, e => e.tag === 'th').forEach(th => { if (th.attrs.scope !== 'col' && th.attrs.scope !== 'row') fail(th, '<th> needs scope="col"'); })),
  'table-label': (root, fail) => find(root, e => has(e, 'gds-table__table')).forEach(t => { if (!t.attrs['aria-label'] && !t.attrs['aria-labelledby'] && !find(t, e => e.tag === 'caption').length) fail(t, 'table needs aria-label or <caption>'); }),
  'table-sort-aria': (root, fail) => find(root, e => has(e, 'gds-table__cell--sorted')).forEach(c => {
    const want = has(c, 'gds-table__cell--sorted-desc') ? 'descending' : 'ascending';
    if (c.attrs['aria-sort'] !== want) fail(c, `sorted header needs aria-sort="${want}"`);
  }),
  'table-sort-modifiers': (root, fail) => find(root, e => has(e, 'gds-table__cell--sorted')).forEach(c => {
    if (find(c, e => e.attrs['data-lucide'] === 'arrow-down').length) fail(c, 'sorted header uses arrow-up; --sorted-desc flips it (arrow-down would point up)');
  }),
  'table-checkbox-label': (root, fail) => find(root, e => has(e, 'gds-table__table')).forEach(t => find(t, e => e.tag === 'input' && (e.attrs.type ?? '') === 'checkbox').forEach(i => { if (!i.attrs['aria-label'] && !i.attrs['aria-labelledby']) fail(i, 'checkbox in a table needs aria-label'); })),
  'table-pagination': (root, fail) => find(root, e => has(e, 'gds-pagination-bar') && !has(e, 'gds-pagination-bar--full')).forEach(b => { if (ancestors(b).some(a => has(a, 'gds-table')) || find(root, e => has(e, 'gds-table')).length) fail(b, 'below a table use gds-pagination-bar--full'); }),
  'checkbox-accessible-name': (root, fail) => find(root, e => has(e, 'gds-checkbox')).forEach(cb => {
    const input = find(cb, e => has(e, 'gds-checkbox__input'))[0];
    if (input && !find(cb, e => has(e, 'gds-checkbox__label')).length && !input.attrs['aria-label'] && !input.attrs['aria-labelledby']) fail(cb, 'checkbox without visible label needs aria-label on the input');
  }),
  'checkbox-icon': (root, fail) => find(root, e => has(e, 'gds-checkbox__control')).forEach(c => { if (find(c, e => e.tag === 'svg').length) fail(c, 'use the Lucide check/minus icon, not a hand-drawn SVG'); }),
  'badge-content-status': (root, fail) => find(root, e => has(e, 'gds-badge')).forEach(b => {
    const label = find(b, e => has(e, 'gds-badge__label'))[0]; const want = label && STATUS_BADGE[txt(label)];
    if (want && !has(b, want)) fail(b, `"${txt(label)}" uses .${want}`);
  }),
  'badge-not-interactive': (root, fail) => find(root, e => has(e, 'gds-badge') && (e.tag === 'button' || e.tag === 'a')).forEach(b => fail(b, 'a badge is never a button or link')),
  'input-size-required': (root, fail) => find(root, e => has(e, 'gds-input')).forEach(i => { if (!['gds-input--sm', 'gds-input--md', 'gds-input--lg'].some(s => has(i, s))) fail(i, 'add one of gds-input--sm / --md / --lg (the height lives there)'); }),
  'input-accessible-name': (root, fail) => {
    const labelled = new Set(find(root, e => e.tag === 'label' && e.attrs.for).map(l => l.attrs.for));
    find(root, e => has(e, 'gds-input__field')).forEach(f => { if (!f.attrs['aria-label'] && !f.attrs['aria-labelledby'] && !(f.attrs.id && labelled.has(f.attrs.id))) fail(f, 'field needs a <label for> or aria-label'); });
  },
  'input-error-message': (root, fail) => find(root, e => has(e, 'gds-input--error')).forEach(i => { const h = find(i, e => has(e, 'gds-input__helper'))[0]; if (!h || !txt(h)) fail(i, '--error needs a message in .gds-input__helper'); }),
  'dropdown-items-are-buttons': (root, fail) => find(root, e => has(e, 'gds-dropdown__item') && e.tag !== 'button').forEach(i => fail(i, `.gds-dropdown__item must be a <button>, not <${i.tag}>`)),
  'dropdown-trigger-aria': (root, fail) => find(root, e => has(e, 'gds-dropdown__trigger')).forEach(t => {
    const open = ancestors(t).some(a => has(a, 'gds-dropdown--open'));
    if (!t.attrs['aria-haspopup']) fail(t, 'trigger needs aria-haspopup');
    if (t.attrs['aria-expanded'] !== String(open)) fail(t, `trigger needs aria-expanded="${open}"`);
  }),
  'pagination-no-list': (root, fail) => find(root, e => has(e, 'gds-pagination')).forEach(p => { if (find(p, e => e.tag === 'ul' || e.tag === 'li').length) fail(p, 'page items are <button>s directly in <nav>, never <ul>/<li>'); }),
  'pagination-select-is-button': (root, fail) => find(root, e => has(e, 'gds-pagination-bar')).forEach(b => { if (find(b, e => e.tag === 'select').length) fail(b, 'page size uses .gds-pagination-bar__select (a button), not <select>'); }),
  'pagination-current': (root, fail) => find(root, e => has(e, 'gds-pagination')).forEach(p => {
    const cur = find(p, e => has(e, 'gds-pagination__item--current'));
    if (cur.length !== 1) fail(p, `exactly one --current item (found ${cur.length})`);
    cur.forEach(c => { if (c.attrs['aria-current'] !== 'page') fail(c, 'current page needs aria-current="page"'); });
  }),
};

// --- lint one parsed tree ----------------------------------------------------------
const EXCLUSIVE = ['size', 'variant'];
function lintTree(tree, report) {
  const at = el => `<${el.tag}${el.classes.length ? ' class="' + el.classes.join(' ') + '"' : ''}>`;
  walk(tree, el => {
    // one modifier per exclusive group
    for (const g of EXCLUSIVE) {
      const mods = el.classes.filter(c => documented.get(c)?.kind === 'modifier' && documented.get(c).item.group === g && el.classes.includes(documented.get(c).item.on));
      if (mods.length > 1) report('structure', `${at(el)}: only one ${g} modifier allowed (${mods.join(', ')})`);
    }
    for (const c of el.classes) {
      if (!c.startsWith('gds-') && !c.startsWith('is-')) continue;
      if (!cssClasses.has(c)) { report('structure', `.${c} does not exist in GDS`); continue; }
      const d = documented.get(c);
      if (!d) continue;
      if (d.kind === 'internal') report('structure', `.${c} is internal: ${d.item.why}`);
      if (d.kind === 'anatomy') {
        const a = d.item;
        if (a.parent && !ancestors(el).some(p => p.classes.some(pc => alts(a.parent).includes(pc)))) report('structure', `.${c} must be inside .${alts(a.parent).join(' or .')}`);
        for (const child of byId[d.component].anatomy.filter(x => x.required && alts(x.parent).includes(c))) {
          if (!find(el, e => has(e, child.class)).length) report('structure', `.${c} is missing its required child .${child.class}`);
        }
      }
      if (d.kind === 'modifier') {
        const m = d.item;
        if (!has(el, m.on)) report('structure', `.${c} must be on the same element as .${m.on}`);
        for (const r of m.requires ?? []) if (!has(el, r)) report('structure', `.${c} requires .${r} on the same element`);
      }
    }
  });
  for (const [id, check] of Object.entries(RULE_CHECKS)) check(tree, (el, msg) => report(id, `${at(el)}: ${msg}`));
}

// --- commands ---------------------------------------------------------------------
const cmd = process.argv[2];

if (cmd === 'lint') {
  const file = process.argv[3];
  if (!file) { console.error('Usage: node scripts/components.mjs lint <file.html>'); process.exit(1); }
  const tree = parse(readFileSync(resolve(file), 'utf8'), { lenient: true });
  const problems = [];
  lintTree(tree, (rule, msg) => problems.push({ rule, msg }));
  const undocumented = new Set();
  walk(tree, e => e.classes.forEach(c => { if (c.startsWith('gds-') && cssClasses.has(c) && !documented.has(c) && !ownedBy(c)) undocumented.add(c); }));
  if (undocumented.size) console.log(`Not covered by a contract yet (not checked): ${[...undocumented].sort().join(', ')}`);
  if (problems.length) {
    console.error(`✗ ${problems.length} problem(s) in ${file}:`);
    problems.forEach(p => console.error(`  - [${p.rule}] ${p.msg}`));
    process.exit(1);
  }
  console.log(`✓ ${file} follows the GDS contracts (${Object.keys(RULE_CHECKS).length} rules + structure)`);
  process.exit(0);
}

if (cmd !== 'check') { console.error('Usage: node scripts/components.mjs <check | lint <file.html>>'); process.exit(1); }

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
    lintTree(tree, (rule, msg) => err(where, `[${rule}] ${msg}`));
  }
}
for (const id of Object.keys(RULE_CHECKS)) if (!allRuleIds.has(id)) err('scripts/components.mjs', `RULE_CHECKS has "${id}" but no contract defines that rule`);

const implemented = Object.keys(RULE_CHECKS).length;
console.log(`Components: ${contracts.length} (${contracts.map(c => c.data.id).join(', ')})`);
console.log(`Classes documented: ${documented.size} · Rules: ${autoChecks + manualChecks} (${autoChecks} auto-checkable, ${implemented} implemented in lint, ${manualChecks} manual, ${v3} with a v3 fix)`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('✓ All contracts valid, complete and consistent with the compiled CSS; all examples pass lint');
