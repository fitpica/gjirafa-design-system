# @gjirafa/ds-core

Framework-agnostic behavior primitives for the [Gjirafa Design System](https://github.com/fitpica/gjirafa-design-system). Pairs with the CSS in `@gjirafa/design-system` — this package owns the JavaScript that CSS can't do.

> **Phase 1** ships the **Popover**. Later phases add the date/time engine and other headless logic. There is **no framework binding here** — Vue 3 / React wrappers are separate packages.

## Install

```sh
npm i @gjirafa/ds-core
```

The visual surface comes from the CSS package:

```js
import '@gjirafa/design-system/dist/gjirafa-ds.css';
```

## Popover

`createPopover(trigger, content, options?)` turns a trigger element and a `.gds-popover` surface into a fully-managed floating layer: Floating-UI positioning with collision flip/shift, portal-to-body (escapes `overflow:hidden`/modals), outside-click + Escape dismiss, and focus management.

```html
<button id="trigger">Open</button>
<div id="surface" class="gds-popover">
  <div class="gds-popover__content">…</div>
</div>
```

```ts
import { createPopover } from '@gjirafa/ds-core';

const popover = createPopover(
  document.querySelector('#trigger')!,
  document.querySelector('#surface')!,
  { placement: 'bottom-start', role: 'dialog' },
);

document.querySelector('#trigger')!.addEventListener('click', () => popover.toggle());
```

### Options

| Option | Type | Default | Notes |
|---|---|---|---|
| `placement` | 12 placements | `'bottom-start'` | incl. `-start` / `-end` |
| `offset` | `number` | `--popover-offset` token, else `8` | gap trigger↔surface (px) |
| `strategy` | `'absolute'\|'fixed'` | `'fixed'` | `fixed` portals to body, escapes clipping |
| `flip` / `shift` | `boolean` | `true` | collision handling |
| `role` | `dialog\|listbox\|menu\|grid\|tooltip` | `'dialog'` | drives surface role + `aria-haspopup` |
| `modal` | `boolean` | `false` | focus trap + `inert`/`aria-hidden` background |
| `arrow` | `HTMLElement\|null` | `null` | a `.gds-popover__arrow` to position |
| `dismiss` | `{ outsideClick?, escapeKey? }` | both `true` | |
| `returnFocus` | `boolean\|HTMLElement` | `true` | focus target on close |
| `autoUpdate` | `boolean` | `true` | reposition on scroll/resize/zoom |
| `initialFocus` | `HTMLElement\|'first'\|'none'` | `'first'` | |
| `onOpen` / `onClose` | `() => void` / `(reason) => void` | — | `reason`: `escape\|outside-click\|api\|trigger` |

### Instance

```ts
interface PopoverInstance {
  open(): void;
  close(reason?): void;
  toggle(): void;
  update(): void;   // force a reposition
  destroy(): void;  // remove listeners, autoUpdate, portal node, trigger ARIA
  readonly isOpen: boolean;
}
```

Also exported: `trapFocus`, `getFocusable`, `focusFirst`, `onEscape`, `onOutsideClick`.

## Scripts

```sh
npm run build      # tsup → ESM + CJS + .d.ts
npm run typecheck  # tsc --noEmit
npm test           # vitest (jsdom) — behavior, ARIA, dismiss, focus, teardown
```

Positioning/collision is verified in a real browser (jsdom has no layout engine).

## License

MIT
