# Gjirafa Design System (GDS)

> Foundation tokens, components, and utilities for CODEX and VP Player.
> Class-based SCSS/CSS — no framework lock-in. Two themes, one source of truth.

**[Live docs →](https://design-system-ten-iota.vercel.app)**

---

## Install

```bash
npm install @gjirafa/design-system
```

## Use

```html
<!-- 1. Import the stylesheet -->
<link rel="stylesheet" href="node_modules/@gjirafa/design-system/dist/gjirafa-ds.css">

<!-- 2. Pick a theme -->
<html data-theme="codex">  <!-- or "vpplayer" -->

<!-- 3. Compose with classes -->
<button class="gds-btn gds-btn--primary gds-btn--md">Get started</button>

<div class="gds-input gds-input--md">
  <div class="gds-input__wrap">
    <input class="gds-input__field" placeholder="Email">
  </div>
</div>
```

Or, with a bundler:

```js
import '@gjirafa/design-system/dist/gjirafa-ds.css';
```

## Themes

Swap brand in one attribute — only semantic action/focus tokens change,
everything else stays.

```html
<html data-theme="codex">     <!-- blue, default -->
<html data-theme="vpplayer">  <!-- orange -->
```

## Architecture — 3-layer tokens

```
Foundation (raw values)  ──►  Semantic (theme-aware)  ──►  Component (scoped)
$color-blue-500               --gds-color-action-primary      --btn-primary-bg
#206ed5                       Differs per theme               References semantic
```

- **Foundation** — `src/tokens/_foundation-*.scss` — colors, spacing, typography, shadows, motion, z-index
- **Semantic** — `src/tokens/_semantic.scss` — 22 meaning-based tokens
- **Themes** — `src/themes/_codex.scss`, `_vpplayer.scss` — only 4 tokens override
- **Component tokens** — `src/tokens/_component-*.scss` — map foundation → component
- **Components** — `src/components/_*.scss` — BEM class API (`.gds-btn`, `.gds-input`, etc.)
- **Utilities** — `src/utilities/_*.scss` — atomic helpers (`gds-p-16`, `gds-text-primary`, …)

## Components

| | | |
|---|---|---|
| `.gds-alert` | `.gds-avatar` | `.gds-badge` |
| `.gds-btn` | `.gds-checkbox` | `.gds-chip` |
| `.gds-data-table` | `.gds-dropdown` | `.gds-filter-badge` |
| `.gds-input` | `.gds-menu` | `.gds-modal` |
| `.gds-pagination` | `.gds-pct-badge` | `.gds-pill` |
| `.gds-radio` | `.gds-sidepanel` | `.gds-status-dot` |
| `.gds-tabs` | `.gds-toast` | `.gds-toggle` |

Every component has sizes, states (hover, focus, disabled, current),
and passes through `data-theme` automatically.

## The non-negotiable rule

**Every CSS value references a foundation token. Every interactive
element uses a GDS component.** No raw pixels, hex, or font sizes. No
custom `<input>` or `<button>` markup. If foundation doesn't have what
you need, ask before adding — don't hardcode.

Full rule: [`brand.md`](./brand.md)

## Figma sync

Variables live in Figma as the canonical source (54 variables across 3
collections, CODEX + VP Player modes). Sync from Figma to SCSS:

```bash
npm run figma:sync
```

Requires `FIGMA_ACCESS_TOKEN` in env. Details in `scripts/figma-sync.mjs`.

## Develop

```bash
npm run build          # Compile SCSS, minify, export tokens.json
npm run dev            # Watch mode
```

- Source: `src/`
- Output: `dist/gjirafa-ds.css`, `dist/gjirafa-ds.min.css`, `dist/tokens.json`
- Docs: `docs/index.html` (standalone, uses compiled CSS)

## Versioning

Semver. Foundation changes = major. Component additions = minor.
Docs + bugfixes = patch.

## License

MIT.

---

**Consumers:** [brand.md](./brand.md) is the AI-assistant integration
guide — point Claude / Cursor / Copilot at it before generating UI.
