/**
 * GDS lint core: checks HTML / Vue template markup against the component contracts.
 *
 * Pure module, no dependencies, so it can ship inside the Claude Code plugin.
 * Used by scripts/components.mjs (repo) and plugins/gds/scripts/gds-lint.mjs (products).
 * The plugin gets a generated copy of this file: edit this one, then `npm run plugin`.
 *
 *   const linter = createLinter({ cssClasses: [...], contracts: [...] });
 *   linter.lint(html, { lenient: true }) → [{ rule, message }]
 */

const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'col', 'area', 'base', 'wbr']);
const EXCLUSIVE = ['size', 'variant'];
const KNOWN_WRONG = { 'gds-data-table': 'gds-table', 'gds-datatable': 'gds-table', 'gds-button': 'gds-btn', 'gds-select': 'gds-dropdown' };
const STATUS_BADGE = { Published: 'gds-badge--positive', Draft: 'gds-badge--neutral', Scheduled: 'gds-badge--warning', Archived: 'gds-badge--neutral', Edited: 'gds-badge--info', Unpublished: 'gds-badge--neutral', Deleted: 'gds-badge--critical' };

// --- parser -----------------------------------------------------------------------
// Handles HTML documents and Vue templates. Bound attributes (:attr, v-bind:attr) count
// as present but their value is unknown; :class is ignored (only static classes are checked).
export function parse(html, { lenient = false } = {}) {
  const src = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<!doctype[^>]*>/i, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const root = { tag: '#root', classes: [], attrs: {}, bound: new Set(), children: [], parent: null, text: '' };
  let cur = root, last = 0;
  for (const m of src.matchAll(/<\/?([a-zA-Z][\w.-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g)) {
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
    const attrs = {}, bound = new Set();
    for (const a of rest.matchAll(/([@:#\w.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
      let name = a[1].toLowerCase();
      const value = a[2] ?? a[3] ?? a[4] ?? '';
      const isBound = name.startsWith(':') || name.startsWith('v-bind:');
      name = name.replace(/^(v-bind)?:/, '');
      if (isBound) { bound.add(name); if (name === 'class' || name === 'style') continue; if (!(name in attrs)) attrs[name] = ''; continue; }
      attrs[name] = value;
    }
    const el = { tag, classes: (attrs.class ?? '').split(/\s+/).filter(Boolean), attrs, bound, children: [], parent: cur, text: '' };
    cur.children.push(el);
    if (!VOID.has(tag) && !selfClose) cur = el;
  }
  if (cur !== root && !lenient) throw new Error(`Unclosed <${cur.tag}>`);
  return root;
}

/** For .vue files: the outer <template> block only. */
export function vueTemplate(source) {
  const start = source.search(/<template\b[^>]*>/i);
  const end = source.lastIndexOf('</template>');
  if (start < 0 || end < 0) return '';
  return source.slice(source.indexOf('>', start) + 1, end);
}

const walk = (el, fn) => { fn(el); el.children.forEach(c => walk(c, fn)); };
const find = (el, pred) => { const out = []; walk(el, e => { if (e !== el && pred(e)) out.push(e); }); return out; };
const ancestors = el => { const out = []; for (let p = el.parent; p; p = p.parent) out.push(p); return out; };
const has = (el, c) => el.classes.includes(c);
const txt = el => el.text.replace(/\s+/g, ' ').trim();
const attrOk = (el, name, want) => el.bound.has(name) || (want === undefined ? !!el.attrs[name] : el.attrs[name] === want);
const named = (el) => attrOk(el, 'aria-label') || attrOk(el, 'aria-labelledby');

function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

// --- rule checks (ids match the rules in components/*.json) ----------------------
const RULE_CHECKS = {
  'table-root-class': (root, fail) => walk(root, e => { if (has(e, 'gds-data-table')) fail(e, 'use .gds-table; .gds-data-table does not exist'); }),
  'table-th-scope': (root, fail) => find(root, e => has(e, 'gds-table__table')).forEach(t => find(t, e => e.tag === 'th').forEach(th => { if (!th.bound.has('scope') && th.attrs.scope !== 'col' && th.attrs.scope !== 'row') fail(th, '<th> needs scope="col"'); })),
  'table-label': (root, fail) => find(root, e => has(e, 'gds-table__table')).forEach(t => { if (!named(t) && !find(t, e => e.tag === 'caption').length) fail(t, 'table needs aria-label or <caption>'); }),
  'table-sort-aria': (root, fail) => find(root, e => has(e, 'gds-table__cell--sorted')).forEach(c => {
    const want = has(c, 'gds-table__cell--sorted-desc') ? 'descending' : 'ascending';
    if (!attrOk(c, 'aria-sort', want)) fail(c, `sorted header needs aria-sort="${want}"`);
  }),
  'table-sort-modifiers': (root, fail) => find(root, e => has(e, 'gds-table__cell--sorted')).forEach(c => {
    if (find(c, e => e.attrs['data-lucide'] === 'arrow-down').length) fail(c, 'sorted header uses the arrow-up icon; --sorted-desc flips it (arrow-down would point up)');
  }),
  'table-checkbox-label': (root, fail) => find(root, e => has(e, 'gds-table__table')).forEach(t => find(t, e => e.tag === 'input' && (e.attrs.type ?? '') === 'checkbox').forEach(i => { if (!named(i)) fail(i, 'checkbox in a table needs aria-label'); })),
  'table-pagination': (root, fail) => { if (!find(root, e => has(e, 'gds-table')).length) return; find(root, e => has(e, 'gds-pagination-bar') && !has(e, 'gds-pagination-bar--full')).forEach(b => fail(b, 'below a table use gds-pagination-bar--full')); },
  'checkbox-accessible-name': (root, fail) => find(root, e => has(e, 'gds-checkbox')).forEach(cb => {
    const input = find(cb, e => has(e, 'gds-checkbox__input'))[0];
    if (input && !find(cb, e => has(e, 'gds-checkbox__label')).length && !named(input)) fail(cb, 'checkbox without visible label needs aria-label on the input');
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
    find(root, e => has(e, 'gds-input__field')).forEach(f => { if (!named(f) && !(f.attrs.id && labelled.has(f.attrs.id)) && !f.bound.has('id')) fail(f, 'field needs a <label for> or aria-label'); });
  },
  'input-error-message': (root, fail) => find(root, e => has(e, 'gds-input--error')).forEach(i => { const h = find(i, e => has(e, 'gds-input__helper'))[0]; if (!h || !txt(h)) fail(i, '--error needs a message in .gds-input__helper'); }),
  'dropdown-items-are-buttons': (root, fail) => find(root, e => has(e, 'gds-dropdown__item') && e.tag !== 'button').forEach(i => fail(i, `.gds-dropdown__item must be a <button>, not <${i.tag}>`)),
  'dropdown-trigger-aria': (root, fail) => find(root, e => has(e, 'gds-dropdown__trigger')).forEach(t => {
    const open = ancestors(t).some(a => has(a, 'gds-dropdown--open'));
    if (!attrOk(t, 'aria-haspopup')) fail(t, 'trigger needs aria-haspopup');
    if (!attrOk(t, 'aria-expanded', String(open))) fail(t, `trigger needs aria-expanded="${open}"`);
  }),
  'pagination-no-list': (root, fail) => find(root, e => has(e, 'gds-pagination')).forEach(p => { if (find(p, e => e.tag === 'ul' || e.tag === 'li').length) fail(p, 'page items are <button>s directly in <nav>, never <ul>/<li>'); }),
  'pagination-select-is-button': (root, fail) => find(root, e => has(e, 'gds-pagination-bar')).forEach(b => { if (find(b, e => e.tag === 'select').length) fail(b, 'page size uses .gds-pagination-bar__select (a button), not <select>'); }),
  'pagination-current': (root, fail) => find(root, e => has(e, 'gds-pagination')).forEach(p => {
    const cur = find(p, e => has(e, 'gds-pagination__item--current'));
    const dynamic = find(p, e => e.bound.has('class')).length > 0;
    if (cur.length !== 1 && !dynamic) fail(p, `exactly one --current item (found ${cur.length})`);
    cur.forEach(c => { if (!attrOk(c, 'aria-current', 'page')) fail(c, 'current page needs aria-current="page"'); });
  }),
  'table-sort-keyboard': (root, fail) => find(root, e => has(e, 'gds-table__cell--sortable')).forEach(c => { if (!find(c, e => has(e, 'gds-table__sort-btn') && e.tag === 'button').length) fail(c, 'put the header text and sort icon inside <button class="gds-table__sort-btn">'); }),
  'page-one-h1': (root, fail) => {
    const titles = find(root, e => has(e, 'gds-page-header__title'));
    if (titles.length > 1) fail(titles[1], `a page has one gds-page-header__title (found ${titles.length})`);
    titles.forEach(t => { if (t.tag !== 'h1') fail(t, 'the page title is an <h1>'); });
  },
  'page-header-one-primary': (root, fail) => find(root, e => has(e, 'gds-page-header__actions')).forEach(a => { const p = find(a, e => has(e, 'gds-btn--primary')); if (p.length > 1) fail(a, `at most one primary button in the page header (found ${p.length})`); }),
  'filter-bar-search-input': (root, fail) => find(root, e => has(e, 'gds-filter-bar__search')).forEach(s => { if (!has(s, 'gds-input') || !has(s, 'gds-input--md')) fail(s, 'gds-filter-bar__search goes on a gds-input gds-input--md wrapper'); }),
  'filter-bar-search-role': (root, fail) => find(root, e => has(e, 'gds-filter-bar')).forEach(b => { if (!attrOk(b, 'role', 'search') || !named(b)) fail(b, 'the filter bar needs role="search" and an aria-label'); }),
  'visually-hidden-not-focusable': (root, fail) => find(root, e => has(e, 'gds-visually-hidden')).forEach(v => { if (find(v, e => ['a', 'button', 'input', 'select', 'textarea'].includes(e.tag)).length) fail(v, 'no focusable elements inside gds-visually-hidden'); }),
};
export const IMPLEMENTED_RULES = Object.keys(RULE_CHECKS);

// --- linter ---------------------------------------------------------------------------
export function createLinter({ cssClasses, contracts }) {
  const css = new Set(cssClasses);
  const gdsClasses = [...css].filter(c => c.startsWith('gds-'));
  const byId = Object.fromEntries(contracts.map(c => [c.id, c]));
  const documented = new Map();
  for (const c of contracts) {
    for (const a of c.anatomy ?? []) documented.set(a.class, { component: c.id, kind: 'anatomy', item: a });
    for (const m of c.modifiers ?? []) if (!documented.has(m.class)) documented.set(m.class, { component: c.id, kind: 'modifier', item: m });
    for (const i of c.internal ?? []) documented.set(i.class, { component: c.id, kind: 'internal', item: i });
  }
  const alts = s => (s ?? '').split('|').map(x => x.trim()).filter(Boolean);
  const ownedBy = cls => contracts.find(c => c.owns.some(p => cls === p || cls.startsWith(p + '-') || cls.startsWith(p + '_')));

  function suggest(cls) {
    if (KNOWN_WRONG[cls]) return KNOWN_WRONG[cls];
    let best = null, bestD = Infinity;
    for (const c of gdsClasses) { const d = distance(cls, c); if (d < bestD) { best = c; bestD = d; } }
    return bestD <= Math.max(2, Math.floor(cls.length * 0.2)) ? best : null;
  }

  function lintTree(tree) {
    const problems = [];
    const report = (rule, message) => problems.push({ rule, message });
    const at = el => `<${el.tag}${el.classes.length ? ' class="' + el.classes.join(' ') + '"' : ''}>`;
    walk(tree, el => {
      for (const g of EXCLUSIVE) {
        const mods = el.classes.filter(c => documented.get(c)?.kind === 'modifier' && documented.get(c).item.group === g && el.classes.includes(documented.get(c).item.on));
        if (mods.length > 1) report('structure', `${at(el)}: only one ${g} modifier allowed (${mods.join(', ')})`);
      }
      for (const c of el.classes) {
        if (!c.startsWith('gds-') && !c.startsWith('is-')) continue;
        if (!css.has(c)) { const s = suggest(c); report('structure', `.${c} does not exist in GDS${s ? ` (did you mean .${s}?)` : ''}`); continue; }
        const d = documented.get(c);
        if (!d) continue;
        if (d.kind === 'internal') report('structure', `.${c} is internal: ${d.item.why}`);
        if (d.kind === 'anatomy') {
          const a = d.item;
          if (a.parent && !ancestors(el).some(p => p.classes.some(pc => alts(a.parent).includes(pc)))) report('structure', `.${c} must be inside .${alts(a.parent).join(' or .')}`);
          for (const child of byId[d.component].anatomy.filter(x => x.required && alts(x.parent).includes(c))) {
            if (!find(el, e => has(e, child.class)).length && !find(el, e => e.bound.has('class')).length) report('structure', `.${c} is missing its required child .${child.class}`);
          }
        }
        if (d.kind === 'modifier') {
          const m = d.item;
          if (!has(el, m.on)) report('structure', `.${c} must be on the same element as .${m.on}`);
          for (const r of m.requires ?? []) if (!has(el, r) && !el.bound.has('class')) report('structure', `.${c} requires .${r} on the same element`);
        }
      }
    });
    for (const [id, check] of Object.entries(RULE_CHECKS)) check(tree, (el, msg) => report(id, `${at(el)}: ${msg}`));
    return problems;
  }

  function uncovered(tree) {
    const out = new Set();
    walk(tree, e => e.classes.forEach(c => { if (c.startsWith('gds-') && css.has(c) && !documented.has(c) && !ownedBy(c)) out.add(c); }));
    return [...out].sort();
  }

  return {
    documented,
    lint: (html, opts) => lintTree(parse(html, opts)),
    lintTree,
    uncovered: html => uncovered(parse(html, { lenient: true })),
  };
}
