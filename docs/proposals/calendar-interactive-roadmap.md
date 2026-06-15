# Proposal — Calendar/DatePicker Interactive Layer

**Status:** Draft for sign-off · **Prereq:** CSS layer shipped (v2.6, this is built)
**Decided already:** framework-agnostic **TypeScript core + thin Vue 3 wrapper**; no Vue 2 package.

The CSS skin is done and framework-agnostic. Everything below is the *behavior* that
CSS cannot provide. It is sequenced so each phase unblocks the next — **do not start a
phase until the one before it is signed off.** Each phase is independently shippable.

---

## Phase 1 — Popover primitive  *(the gating dependency)*

A reusable floating surface. Calendar can't open, dismiss, or position without it, and
GDS has no popover today (Tooltip is hover-only, `pointer-events:none`).

**CSS (mostly done):** `.gds-calendar-popover` already proves the surface recipe
(bg/border/shadow/radius from dropdown tokens). Generalize it to `.gds-popover`.

**TS core (`@gjirafa/ds-core`, new):**
- Anchored positioning + collision flip — wrap **Floating UI** (`@floating-ui/dom`), don't hand-roll.
- Open/close controller; dismiss on outside-click + `Esc`.
- Focus management: trap within, return focus to trigger on close.
- `inert`/`aria-hidden` handling for the rest of the page when modal-style.

**Deliverable:** `createPopover(trigger, surface, opts)` — framework-agnostic, no Vue.
**Open decisions:** Floating UI as a dependency (recommended) vs. minimal custom positioner; npm package name for the core.

---

## Phase 2 — TS core (date/time engine + interaction logic)

Pure TypeScript, no framework imports. This is the single source of truth all adapters consume.

- **Date engine:** month grid generation, week-start, min/max, disabled-date/-weekday predicates, range model (the CSS range states are already in place).
- **i18n:** locale month/weekday names, `DD/MM/YYYY` vs `MM/DD/YYYY` parse + format, `15/06/2026 10:00` round-trip. Decide: `Intl` only (zero-dep, recommended) vs. a date lib.
- **Time logic:** hour/minute step, wrap-around (59→00), min/max time, disabled times.
- **Keyboard model:** roving-tabindex 2D grid nav (arrows, Home/End, PageUp/Down), Enter/Space select, Esc close — emitted as state transitions the adapter binds to.
- **a11y:** live-region message builder (the `role=grid` / `aria-*` recipe is already documented in the Calendar docs).

**Deliverable:** headless state machine + helpers; framework-agnostic; unit-tested.
**Open decisions:** `Intl`-only vs. date library; state-machine approach (hand-rolled vs. XState).

---

## Phase 3 — Vue 3 wrapper

Thin adapter: binds the Phase-2 core to reactive Vue 3 components, renders the Phase-1
CSS classes. No logic duplicated here.

- `<GdsPopover>`, then `<GdsDatePicker mode="date | datetime | time | advanced">`.
- Typed props (the full API from the original spec), `v-model`, emits.
- Composition API; SSR-safe; tree-shakeable.

**Deliverable:** `@gjirafa/ds-vue` (Vue 3). Vue 2 team consumes CSS + the Phase-2 core directly.
**Open decisions:** package layout (one `@gjirafa/ds-vue` vs. per-component entry points); peerDeps range.

---

## Phase 4 — Calendar/DatePicker interactive layer + Storybook

Assemble Phases 1–3 into the full component, then prove it.

- All 4 modes wired end-to-end; controlled + uncontrolled; clearable; presets with custom base date; Today/Clear actions.
- **Storybook** (requires standing up the JS toolchain): a story per mode + states + the 10 examples from the original spec (incl. Albanian + English locales).
- Interaction tests on the keyboard + a11y model.

**Deliverable:** shippable `<GdsDatePicker>` + docs/stories.
**Open decisions:** Storybook vs. extending the existing static docs site; visual-regression tooling.

---

## Cross-cutting

- **Tooling:** Phases 2–4 introduce the repo's first TS build + test runner + (optionally) Storybook. One-time setup in Phase 2.
- **Zero-hardcoded rule** still holds for any CSS the wrappers add.
- **Sequencing rationale:** Popover is a standalone primitive other components want (menus, comboboxes) — shipping it first delivers value beyond Calendar. The TS core is reusable by the future React path. Vue 3 wrapper is thin by design. Calendar comes last because it depends on all three.

## Recommended first step
Approve **Phase 1 (Popover)** scope + the Floating UI dependency + the core package name.
That unblocks everything without committing to the full toolchain yet.
