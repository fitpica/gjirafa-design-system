# Phase 1 — Popover primitive (shipped)

Status: **implemented** · First consumer of the calendar roadmap's Phase 1.
Approved decisions (see `calendar-interactive-roadmap.md`):

| Decision | Choice |
|---|---|
| First JS layer | **Yes** — new sibling package `@gjirafa/ds-core` (the CSS package stays dependency-free) |
| Positioning engine | **Floating UI** (`@floating-ui/dom`), bundled (~5 kB gz tree-shaken), not a peer dep |
| New foundation token | `$z-popover` / `--gds-z-popover` = **1025** (above sidepanel 1020, below tooltip 1040) |
| Package name | **`@gjirafa/ds-core`** |

## Why JS (not CSS-only)
Four behaviors are impossible in CSS, each confirmed in-repo: collision flip/shift
(`_tooltip.scss:24,56` defer to JS), escaping `overflow:hidden` ancestors
(`_modal.scss:51`, `_sidepanel.scss:48` → needs portal + fixed strategy), click-toggle +
outside-click + Esc, and focus management. The only focus/dismiss logic in the repo
lived in `docs/index.html` (not shipped).

## Architecture — two layers, two packages
1. **CSS shell** — `.gds-popover` in `@gjirafa/design-system` (`_popover.scss` +
   `_component-popover.scss`). Appearance + open/close transition + max-height/scroll +
   `--gds-z-popover` + reduced-motion + forced-colors. Composes the light dropdown surface
   tokens. Position is written inline by the controller — CSS authors no `top`/`left`.
   Zero hardcoded values.
2. **JS controller** — `createPopover(trigger, content, opts)` in `@gjirafa/ds-core`.
   Wraps Floating UI (`computePosition` + `offset` + `flip` + `shift` + `autoUpdate`),
   portals to `document.body` (default `strategy:'fixed'`), runs the open/close state
   machine, outside-click + layered-Escape dismiss, focus move-in / trap (modal) /
   return-to-trigger, and runtime ARIA wiring. Returns `{ open, close, toggle, update, destroy, isOpen }`.

## API
```ts
createPopover(trigger, content, {
  placement?, offset?, strategy?, flip?, shift?, role?, modal?, arrow?,
  dismiss?: { outsideClick?, escapeKey? }, returnFocus?, autoUpdate?,
  initialFocus?, onOpen?, onClose?(reason),
}): { open, close, toggle, update, destroy, readonly isOpen }
```
BEM: `.gds-popover`, `.gds-popover--open` (controller-owned hook), `.gds-popover__content`,
`.gds-popover__arrow`, `.gds-popover--align-end`.

## Accessibility contract
Trigger gets `aria-haspopup`/`aria-controls`/`aria-expanded`; surface gets `role`
(+ `aria-modal` when modal); focus moves into the surface on open and returns to the
trigger on close (keyed off `transitionend`); modal traps Tab, non-modal roves; Escape
closes the topmost layer first; modal `inert`/`aria-hidden`s background siblings;
reduced-motion snaps.

## Included / not included
**Included:** generic `.gds-popover` CSS shell, `createPopover()` controller, TS toolchain
(tsup → ESM+CJS+`.d.ts`), 20 unit/DOM tests, docs demos, bundled Floating UI.
**Not included:** date/time math (Phase 2), keyboard grid nav enforcement (Phase 3),
Vue 3 wrapper (Phase 4), Storybook (Phase 5), CSS Anchor Positioning, and **no changes to
the Calendar CSS layer** (`.gds-calendar-popover` stays as-is; refactoring it to compose
`.gds-popover` is a later change).

## Verification
CSS build clean + zero-hardcoded; `tsc --noEmit` passes; 20 tests pass; dual ESM/CJS/types
resolve; browser-verified in the docs: open/close, 12 placements + flip, outside-click +
Esc, focus move-in + return, menu content, and escaping an `overflow:hidden` container.
Positioning/collision is verified in-browser (jsdom has no layout).
