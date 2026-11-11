/**
 * GDS component contracts — check
 *
 *   node scripts/components.mjs check
 *
 * For every components/<id>.json:
 *   1. valid against components/component.schema.json
 *   2. every class it names exists in the compiled CSS
 *   3. complete: every compiled class it owns is documented (anatomy, modifiers or internal)
 *   4. modifiers attach to an element of the same component
 *   5. examples follow the contract: real classes, no internal classes, correct parents,
 *      required children present, required companion modifiers present
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

// class → { component, kind } for every documented class
const documented = new Map();
for (const { data } of contracts) {
  for (const a of data.anatomy ?? []) documented.set(a.class, { component: data.id, kind: 'anatomy', item: a });
  for (const m of data.modifiers ?? []) if (!documented.has(m.class)) documented.set(m.class, { component: data.id, kind: 'modifier', item: m });
  for (const i of data.internal ?? []) documented.set(i.class, { component: data.id, kind: 'internal', item: i });
}
const ownedBy = cls => contracts.find(({ data }) => data.owns.some(p => cls === p || cls.startsWith(p + '-') || cls.startsWith(p + '_')))?.data;
const alts = s => (s ?? '').split('|').map(x => x.trim()).filter(Boolean);

// --- tiny HTML parser (examples are small and well-formed) ---------------------
const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'col']);
function parse(html) {
  const root = { tag: '#root', classes: [], attrs: {}, children: [], parent: null };
  let cur = root;
  for (const m of html.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
    const [whole, tag, rest, selfClose] = m;
    if (whole.startsWith('</')) {
      if (cur.tag !== tag.toLowerCase()) throw new Error(`Mismatched </${tag}> (open: <${cur.tag}>)`);
      cur = cur.parent; continue;
    }
    const attrs = Object.fromEntries([...rest.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(a => [a[1], a[2] ?? '']));
    const el = { tag: tag.toLowerCase(), classes: (attrs.class ?? '').split(/\s+/).filter(Boolean), attrs, children: [], parent: cur };
    cur.children.push(el);
    if (!VOID.has(el.tag) && !selfClose) cur = el;
  }
  if (cur !== root) throw new Error(`Unclosed <${cur.tag}>`);
  return root;
}
const walk = (el, fn) => { fn(el); el.children.forEach(c => walk(c, fn)); };
const ancestors = el => { const out = []; for (let p = el.parent; p; p = p.parent) out.push(p); return out; };

// --- checks -------------------------------------------------------------------
const errors = [];
const info = new Set();
const err = (c, msg) => errors.push(`${c}: ${msg}`);
let autoChecks = 0, manualChecks = 0, v3 = 0;

for (const { file, data } of contracts) {
  const id = file.replace(/\.json$/, '');
  if (!validate(data)) { validate.errors.forEach(e => err(file, `schema ${e.instancePath || '/'} ${e.message}`)); continue; }
  if (data.id !== id) err(file, `id "${data.id}" must match the file name`);

  const own = new Set([...data.anatomy.map(a => a.class), ...data.modifiers.map(m => m.class), ...(data.internal ?? []).map(i => i.class)]);
  const anatomy = new Set(data.anatomy.map(a => a.class));

  // 2. names exist in CSS
  const named = [...own, ...data.anatomy.flatMap(a => alts(a.parent)), ...data.modifiers.flatMap(m => [m.on, ...(m.requires ?? [])])];
  for (const c of new Set(named)) if (!cssClasses.has(c)) err(id, `.${c} is not in the compiled CSS`);

  // 3. completeness
  for (const c of cssClasses) {
    if (data.owns.some(p => c === p || c.startsWith(p + '-') || c.startsWith(p + '_')) && !own.has(c)) err(id, `.${c} exists in the CSS but is not documented`);
  }

  // 4. modifiers attach to this component's anatomy
  for (const m of data.modifiers) if (!anatomy.has(m.on)) err(id, `modifier .${m.class} is "on" .${m.on}, which is not in this anatomy`);

  for (const r of data.rules) { r.autoCheck ? autoChecks++ : manualChecks++; if (r.removeInV3) v3++; }

  // 5. examples follow the contract
  for (const ex of data.examples) {
    const where = `${id} › example "${ex.name}"`;
    let tree;
    try { tree = parse(ex.html); } catch (e) { err(where, e.message); continue; }
    walk(tree, el => {
      for (const c of el.classes) {
        if (!c.startsWith('gds-') && !c.startsWith('is-')) continue;
        if (!cssClasses.has(c)) { err(where, `.${c} is not in the compiled CSS`); continue; }
        const d = documented.get(c);
        if (!d) { if (!ownedBy(c)) info.add(c); continue; }
        if (d.kind === 'internal') err(where, `.${c} is internal (${d.item.why})`);
        if (d.kind === 'anatomy') {
          const a = d.item;
          if (a.parent) {
            const ok = ancestors(el).some(p => p.classes.some(pc => alts(a.parent).includes(pc)));
            if (!ok) err(where, `.${c} must be inside .${alts(a.parent).join(' or .')}`);
          }
          // required children of this element
          const comp = contracts.find(x => x.data.id === d.component).data;
          for (const child of comp.anatomy.filter(x => x.required && alts(x.parent).includes(c))) {
            let found = false;
            walk(el, e => { if (e !== el && e.classes.includes(child.class)) found = true; });
            if (!found) err(where, `.${c} is missing its required child .${child.class}`);
          }
        }
        if (d.kind === 'modifier') {
          const m = d.item;
          if (!el.classes.includes(m.on)) err(where, `.${c} must be on the same element as .${m.on}`);
          for (const r of m.requires ?? []) if (!el.classes.includes(r)) err(where, `.${c} requires .${r} on the same element`);
        }
      }
    });
  }
}

// --- report -------------------------------------------------------------------
const totalClasses = [...documented.values()].length;
console.log(`Components: ${contracts.length} (${contracts.map(c => c.data.id).join(', ')})`);
console.log(`Classes documented: ${totalClasses} · Rules: ${autoChecks + manualChecks} (${autoChecks} auto-checkable, ${manualChecks} manual, ${v3} with a v3 fix)`);
if (info.size) console.log(`Used in examples but not yet documented (other components): ${[...info].sort().join(', ')}`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):`);
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}
console.log('✓ All contracts valid, complete and consistent with the compiled CSS');
