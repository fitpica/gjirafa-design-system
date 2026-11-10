# Gjirafa Design System (GDS) v2.6 — AI Integration Guide

> This document is the single source of truth for any AI tool (Claude, Cursor, Copilot, etc.)
> building UI with GDS. Read this BEFORE generating any HTML or CSS.
>
> **Version:** 2.6.0 · **Live docs:** https://docs-phi-black.vercel.app
> Every class and `--gds-*` token named here exists in the compiled CSS of v2.6.0.
> If something you need is not in this file, **do not invent it**. Say it is missing and ask.

---

## How This Document Works

GDS is a **CSS-only** design system distributed via CDN (NPM package coming later). It provides:
- Foundation tokens (colors, spacing, typography, shadows, motion, z-index)
- Semantic tokens (theme-aware: text, background, border, action, feedback)
- 26 ready-to-use components via BEM class names
- Multi-theme support via `data-theme` attribute

**Architecture: 3-layer token system**
```
Foundation (raw values)  -->  Semantic (meaning-based)  -->  Component (scoped)
$color-blue-500              --gds-color-action-primary      --btn-primary-bg
#206ed5                      Themed per product              References semantic
```

Changing a theme swaps the semantic layer. All components update automatically.

---

## Setup

```html
<!-- 1. Load GDS from the CDN, pinned to a version (fonts load automatically) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.6.0/docs/gjirafa-ds.css" />

<!-- 2. Pick a theme: "codex" (default, blue) or "vpplayer" (orange) -->
<body data-theme="codex">
```

**3. Set the base font yourself (required).** GDS has no reset and sets no font on `body`. Components use `font-family: inherit`, so without this rule everything renders in the browser's serif default:
```css
body {
  font-family: var(--gds-font-family-base);
  color: var(--gds-color-text-primary);
  background: var(--gds-color-bg-primary);
  margin: 0;
}
```

Vue / bundler (in a global stylesheet):
```css
@import url('https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.6.0/docs/gjirafa-ds.css');
```

> **Do NOT use `npm install @gjirafa/design-system`** — the NPM package is not published yet (404).
> Always pin the version (`@v2.6.0`), never `@latest` or `@main`.

Icons: GDS uses [Lucide Icons](https://lucide.dev) via `data-lucide` attributes.
```html
<script src="https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js"></script>
<script>lucide.createIcons();</script>
```

---

## Critical Rules

1. **NEVER hardcode colors.** Always use `var(--gds-color-*)` semantic tokens or `var(--gds-color-{hue}-{step})` foundation tokens.
2. **NEVER hardcode spacing.** Use `var(--gds-space-{n})` where n = 0, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 48, 64, 80, 160.
3. **NEVER create custom components** when a GDS component exists. Use the GDS class.
4. **ALWAYS use BEM naming.** Block: `gds-{component}`, Element: `__{element}`, Modifier: `--{modifier}`.
5. **ALWAYS use semantic tokens for theming.** Components that need to respond to theme changes must use `--gds-color-action-*`, `--gds-color-text-*`, etc. — never foundation colors directly.
6. **Prefix custom classes** with your product abbreviation (e.g., `hd-` for Helpdesk) to avoid collision with `gds-`.
7. **Text must pass WCAG AA (4.5:1).** For readable text use only `text-primary`, `text-secondary`, `text-label`, or the `*-text` feedback tokens. See "Text contrast rules" below.
8. **Never invent classes, variants or tokens.** If this file does not list it, it does not exist. Flag the gap instead.

---

## Themes

### CODEX (Default)

Blue brand. Active when no `data-theme` is set, or with `data-theme="codex"`.

| Token | Value | Hex |
|-------|-------|-----|
| `--gds-color-brand-primary` | blue-500 | `#206ed5` |
| `--gds-color-action-primary` | blue-500 | `#206ed5` |
| `--gds-color-action-primary-hover` | blue-600 | `#1d64c2` |
| `--gds-color-action-primary-active` | blue-700 | `#174e97` |
| `--gds-color-action-on-primary` | neutral-0 | `#ffffff` |
| `--gds-color-border-focus` | blue-500 | `#206ed5` |

### VP Player

Orange brand. Activate with `data-theme="vpplayer"`.

| Token | Value | Hex |
|-------|-------|-----|
| `--gds-color-brand-primary` | orange-500 | `#ef8c13` |
| `--gds-color-action-primary` | orange-500 | `#ef8c13` |
| `--gds-color-action-primary-hover` | orange-600 | `#D97F11` |
| `--gds-color-action-primary-active` | orange-700 | `#aa630d` |
| `--gds-color-border-focus` | orange-500 | `#ef8c13` |

### Adding a New Theme

Create a CSS file that overrides semantic tokens under `[data-theme="yourname"]`:

```css
[data-theme="yourname"] {
  /* REQUIRED: brand + action colors */
  --gds-color-brand-primary:         #YOUR_PRIMARY;
  --gds-color-action-primary:        #YOUR_PRIMARY;
  --gds-color-action-primary-hover:  #YOUR_DARKER;
  --gds-color-action-primary-active: #YOUR_DARKEST;
  --gds-color-action-on-primary:     #ffffff;
  --gds-color-border-focus:          #YOUR_PRIMARY;

  /* OPTIONAL: override any other semantic token */
  /* --gds-color-text-primary:   #...; */
  /* --gds-color-bg-primary:     #...; */
  /* --gds-color-error:          #...; */
}
```

Load this file AFTER `gjirafa-ds.css` and add `data-theme="yourname"` to `<body>`.
Every GDS component will automatically adopt your brand colors.

---

## Foundation Tokens

### Colors

**Blue:** 50 `#e9f1fb` | 75 `#DDE9F9` | 100 `#bad2f2` | 200 `#98bcec` | 300 `#6a9ee3` | 400 `#4d8bdd` | 500 `#206ed5` | 600 `#1d64c2` | 700 `#174e97` | 800 `#123d75` | 900 `#0d2e59`

**Green:** 50 `#e9f4ef` | 100 `#baddce` | 300 `#69b596` | 500 `#1f9162` | 600 `#1c8459` | 700 `#166746` | 900 `#0d3d29`

**Orange:** 50 `#FDF6EC` | 100 `#fadbb6` | 300 `#f4b261` | 500 `#ef8c13` | 600 `#D97F11` | 700 `#aa630d` | 900 `#643b08`

**Red:** 50 `#fdeeec` | 100 `#f8cbc4` | 300 `#f08e80` | 500 `#e95742` | 600 `#d44f3c` | 700 `#a53e2f` | 900 `#62251c`

**Purple:** 50 `#f4f2fc` | 100 `#dbd6f7` | 300 `#b2a7ed` | 500 `#8c7be4` | 600 `#7f70cf` | 700 `#6357a2` | 900 `#3b3460`

**Neutral:** 0 `#ffffff` | 20 `#F7F7F8` | 25 `#f1f1f3` | 30 `#ebebed` | 40 `#dedee2` | 50 `#c0c0c7` | 60 `#b1b1b9` | 80 `#9595a0` | 90 `#868693` | 100 `#767685` | 300 `#58586a` | 400 `#4b4b5f` | 700 `#1e1e36` | 900 `#02021d`

CSS usage: `var(--gds-color-{hue}-{step})` e.g. `var(--gds-color-blue-500)`

### Semantic Tokens (Theme-Aware)

These change per theme. Always use these for UI that must respond to theme switching.

| Token | Purpose |
|-------|---------|
| `--gds-color-brand-primary` | Brand identity color |
| `--gds-color-action-primary` | Buttons, links, active states |
| `--gds-color-action-primary-hover` | Hover on primary actions |
| `--gds-color-action-primary-active` | Active/pressed on primary actions |
| `--gds-color-action-on-primary` | Text on primary action background |
| `--gds-color-text-primary` | Headings, main content |
| `--gds-color-text-secondary` | Descriptions, metadata |
| `--gds-color-text-tertiary` | Decorative only — fails AA, never for information |
| `--gds-color-text-disabled` | Disabled labels |
| `--gds-color-text-placeholder` | Input placeholders |
| `--gds-color-text-label` | Form labels |
| `--gds-color-text-helper` | Large text / icons only — fails AA for body text (input helper text uses `text-secondary` in v2.6) |
| `--gds-color-text-inverse` | Text on dark backgrounds |
| `--gds-color-bg-primary` | Page/card background (white) |
| `--gds-color-bg-secondary` | Section backgrounds (light gray) |
| `--gds-color-bg-tertiary` | Hover/subtle fill |
| `--gds-color-bg-disabled` | Disabled element background |
| `--gds-color-border-default` | Standard borders |
| `--gds-color-border-strong` | Emphasized borders |
| `--gds-color-border-focus` | Focus ring color |
| `--gds-color-border-subtle` | Light dividers |
| `--gds-color-error` | Error fill, icon, border — not text |
| `--gds-color-error-text` | Error message text |
| `--gds-color-success` | Success fill, icon, border — not text |
| `--gds-color-success-text` | Success message text |
| `--gds-color-warning` | Warning fill, icon, border — not text |
| `--gds-color-warning-text` | Warning message text |

### Text contrast rules (v2.6)

Contrast ratios for the CODEX theme, measured against `bg-primary` (white) and `bg-secondary` (`#F7F7F8`).
WCAG AA needs **4.5:1** for normal text and **3:1** for large text (18px+, or 14px+ bold) and icons.

| Token | On white | On bg-secondary | Use for |
|-------|----------|-----------------|---------|
| `text-primary` | 16.23 | 15.16 | ✅ Any text |
| `text-label` | 8.50 | 7.94 | ✅ Labels, **table headers** |
| `text-secondary` | 6.96 | 6.50 | ✅ Descriptions, metadata, helper text, pagination |
| `error-text` | 6.31 | 5.89 | ✅ Error messages |
| `success-text` | 6.86 | 6.40 | ✅ Success messages |
| `warning-text` | 4.67 | 4.36 | ⚠️ On white only. On `bg-secondary` it fails AA |
| `text-helper` | 3.59 | 3.36 | ❌ Not for text. Large text or icons only |
| `text-tertiary` / `text-placeholder` | 2.96 | 2.77 | ❌ Placeholders and decorative only, never for information |
| `text-disabled` | 2.13 | 1.99 | Disabled state only (exempt from WCAG) |
| `error` / `success` / `warning` | 3.56 / 3.97 / 3.00 | — | ❌ Never as text. Fills, dots, icons, borders only |

**VP Player theme:** `action-primary` (orange-500) on white is 2.49:1. Never use it as a text color on
light backgrounds. This is a known open issue; if a VP Player design needs orange text, flag it instead of picking a value.

### Spacing

Base grid: **4px**. Use `var(--gds-space-{n})`.

| Token | Value |
|-------|-------|
| `--gds-space-0` | 0px |
| `--gds-space-2` | 2px |
| `--gds-space-4` | 4px |
| `--gds-space-6` | 6px |
| `--gds-space-8` | 8px |
| `--gds-space-10` | 10px |
| `--gds-space-12` | 12px |
| `--gds-space-14` | 14px |
| `--gds-space-16` | 16px |
| `--gds-space-20` | 20px |
| `--gds-space-24` | 24px |
| `--gds-space-32` | 32px |
| `--gds-space-40` | 40px |
| `--gds-space-48` | 48px |
| `--gds-space-64` | 64px |
| `--gds-space-80` | 80px |
| `--gds-space-160` | 160px |

### Border Radius

| Token | Value |
|-------|-------|
| `--gds-radius-none` | 0px |
| `--gds-radius-sm` | 2px |
| `--gds-radius-s` | 4px |
| `--gds-radius-md` | 6px |
| `--gds-radius-lg` | 8px |
| `--gds-radius-10` | 10px |
| `--gds-radius-xl` | 12px |
| `--gds-radius-full` | 9999px (pill) |

### Typography

Font: `Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`

| Token | Size |
|-------|------|
| `--gds-font-size-title-xl` | 24px |
| `--gds-font-size-title-lg` | 20px |
| `--gds-font-size-title-md` | 18px |
| `--gds-font-size-title-sm` | 16px |
| `--gds-font-size-body-lg` | 16px |
| `--gds-font-size-body-base` | 14px |
| `--gds-font-size-body-sm` | 12px |
| `--gds-font-size-body-xs` | 11px |
| `--gds-font-size-caption` | 11px |

| Token | Value |
|-------|-------|
| `--gds-font-weight-regular` | 400 |
| `--gds-font-weight-medium` | 500 |
| `--gds-font-weight-semibold` | 600 |
| `--gds-line-height-tight` | 1.25 |
| `--gds-line-height-normal` | 1.5 |
| `--gds-line-height-relaxed` | 1.6 |

### Shadows

| Token | Value |
|-------|-------|
| `--gds-shadow-xs` | 0 0 2px 0 rgba(235,235,237,1) |
| `--gds-shadow-sm` | 0 1px 2px 0 rgba(235,235,237,1) |
| `--gds-shadow-sm-hover` | 0 2px 3px 0 rgba(222,222,226,1) |
| `--gds-shadow-md` | 0 6px 12px 0 rgba(30,30,54,0.1) |
| `--gds-shadow-lg` | 0 6px 20px 0 rgba(30,30,54,0.2) |
| `--gds-shadow-raised` | 0 13px 24px 0 rgba(30,30,54,0.1) |
| `--gds-shadow-overlay` | 0 4px 20px 0 rgba(30,30,54,0.1) |
| `--gds-shadow-side-panel` | -4px 0 20px 0 rgba(30,30,54,0.05) |
| `--gds-overlay-bg` | rgba(30,30,54,0.5) |

### Motion

| Token | Value |
|-------|-------|
| `--gds-duration-fast` | 0.1s |
| `--gds-duration-normal` | 0.15s |
| `--gds-duration-slow` | 0.25s |
| `--gds-ease-default` | cubic-bezier(0.2, 0, 0.38, 0.9) |
| `--gds-ease-out` | cubic-bezier(0, 0, 0.38, 0.9) |

### Z-Index

| Token | Value |
|-------|-------|
| `--gds-z-dropdown` | 100 |
| `--gds-z-sticky` | 200 |
| `--gds-z-overlay` | 1000 |
| `--gds-z-modal` | 1010 |
| `--gds-z-sidepanel` | 1020 |
| `--gds-z-toast` | 1030 |
| `--gds-z-tooltip` | 1040 |

### Icons

| Token | Value |
|-------|-------|
| `--gds-icon-sm` | 16px |
| `--gds-icon-md` | 20px |
| `--gds-icon-lg` | 24px |
| `--gds-icon-stroke` | 1.5 |
| `--gds-opacity-disabled` | 0.5 |

---

## Components — Full API Reference

### Button

```html
<!-- Text button -->
<button class="gds-btn gds-btn--primary">
  <i data-lucide="plus" class="gds-btn__icon"></i>
  <span class="gds-btn__label">Create</span>
</button>

<!-- Icon-only button -->
<button class="gds-btn-icon gds-btn-icon--ghost" aria-label="Settings">
  <i data-lucide="settings" width="20" height="20"></i>
</button>

<!-- Button group -->
<div class="gds-btn-group">
  <button class="gds-btn gds-btn--secondary">Left</button>
  <button class="gds-btn gds-btn--secondary">Right</button>
</div>
```

| Modifier | Effect |
|----------|--------|
| `gds-btn--primary` | Filled brand color |
| `gds-btn--secondary` | Outlined |
| `gds-btn--ghost` | Text only, no border |
| `gds-btn--critical` | Red / destructive |
| `gds-btn--positive` | Green / success |
| `gds-btn--xs` | 24px height |
| `gds-btn--sm` | 28px height |
| (default) | 36px height (md) |
| `gds-btn--lg` | 44px height |
| `gds-btn--xl` | 52px height |
| `gds-btn--pill` | Fully rounded corners |
| `gds-btn--full` | Full width |
| `gds-btn--loading` | Shows spinner, disables click |
| `disabled` attribute | Disabled state |

Icon button uses same variants/sizes with `gds-btn-icon` prefix. Add `gds-btn-icon--circle` for round shape.

---

### Input

```html
<div class="gds-input">
  <label class="gds-input__label">Email <span class="gds-input__required">*</span></label>
  <div class="gds-input__wrap">
    <i data-lucide="mail" class="gds-input__icon"></i>
    <input type="email" class="gds-input__field" placeholder="Enter email" />
    <span class="gds-input__suffix">.com</span>
  </div>
  <span class="gds-input__helper">We'll never share your email</span>
</div>
```

| Modifier | Effect |
|----------|--------|
| `gds-input--sm` | Small size (32px) |
| `gds-input--md` | Medium (40px), the usual choice |
| `gds-input--lg` | Large size (48px) |

> **A size modifier is required.** The height lives on the size class. A bare `gds-input` has no height, so always add `--sm`, `--md` or `--lg`.
| `gds-input--error` | Red border + error styling |
| `gds-input--warning` | Orange border |
| `gds-input--success` | Green border |
| `gds-input--disabled` | Disabled state |
| `gds-input--textarea` | Multi-line textarea |
| `gds-input--shadow` | Shadow style instead of outline |
| `gds-input--full` | Full width |

---

### Checkbox

```html
<label class="gds-checkbox">
  <input type="checkbox" class="gds-checkbox__input" />
  <span class="gds-checkbox__control"><svg>...</svg></span>
  <span class="gds-checkbox__label">Accept terms</span>
</label>
```

Sizes: `gds-checkbox--sm`, `gds-checkbox--md`, `gds-checkbox--lg`
States: `:checked` (via native), `gds-checkbox--mixed` (indeterminate), `gds-checkbox--disabled`

---

### Radio

```html
<label class="gds-radio">
  <input type="radio" name="group" class="gds-radio__input" />
  <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
  <span class="gds-radio__label">Option A</span>
</label>
```

Sizes: `gds-radio--sm`, `gds-radio--md`, `gds-radio--lg`

---

### Toggle

```html
<label class="gds-toggle">
  <input type="checkbox" class="gds-toggle__input" />
  <span class="gds-toggle__track"><span class="gds-toggle__knob"></span></span>
  <span class="gds-toggle__label">Dark mode</span>
</label>
```

Sizes: `gds-toggle--sm`, `gds-toggle--md`, `gds-toggle--lg`

---

### Chip

```html
<!-- Default chip -->
<span class="gds-chip">
  <span class="gds-chip__label">Design</span>
</span>

<!-- With close -->
<span class="gds-chip">
  <span class="gds-chip__label">Tag</span>
  <button class="gds-chip__close" aria-label="Remove"><i data-lucide="x" width="12" height="12"></i></button>
</span>

<!-- Selectable -->
<button class="gds-chip gds-chip--selectable gds-chip--active">
  <span class="gds-chip__label">Selected</span>
</button>

<!-- Chip group with counter -->
<div class="gds-chip-group">
  <span class="gds-chip">A</span>
  <span class="gds-chip">B</span>
  <span class="gds-chip-group__counter">+3</span>
</div>

<!-- Chips input (tag field) -->
<div class="gds-chip-input">
  <span class="gds-chip">Tag 1 <button class="gds-chip__close">x</button></span>
  <input class="gds-chip-input__field" placeholder="Add tag..." />
</div>
```

| Modifier | Effect |
|----------|--------|
| `gds-chip--sm` | Small |
| (default) | Medium |
| `gds-chip--lg` | Large |
| `gds-chip--rounded` | Pill shape |
| `gds-chip--outline` | Outlined style |
| `gds-chip--selectable` | Clickable toggle chip |
| `gds-chip--active` | Selected state (with --selectable) |
| `gds-chip--disabled` | Disabled |
| `gds-chip--success` | Green |
| `gds-chip--warning` | Orange |
| `gds-chip--error` | Red |
| `gds-chip--neutral` | Gray |

---

### Badge

```html
<span class="gds-badge gds-badge--positive">
  <span class="gds-badge__dot"></span>
  <span class="gds-badge__label">Active</span>
</span>

<span class="gds-badge gds-badge--critical gds-badge--solid">
  <i data-lucide="alert-circle" width="12" height="12" class="gds-badge__icon"></i>
  <span class="gds-badge__label">Error</span>
</span>
```

| Modifier | Effect |
|----------|--------|
| `gds-badge--neutral` | Gray |
| `gds-badge--positive` | Green |
| `gds-badge--critical` | Red |
| `gds-badge--warning` | Orange |
| `gds-badge--info` | Blue |
| `gds-badge--purple` | Purple |
| `gds-badge--outline` | Outlined style |
| `gds-badge--solid` | Solid fill |
| `gds-badge--text` | Text only (no background) |
| `gds-badge--sm` | Small |
| `gds-badge--md` | Medium (default) |
| `gds-badge--lg` | Large |

---

### Pill

```html
<span class="gds-pill gds-pill--positive">On Track</span>
<span class="gds-pill gds-pill--critical gds-pill--dark">Urgent</span>
```

Tones: `--neutral`, `--critical`, `--positive`, `--warning`, `--purple`, `--blank`
Sizes: `--sm`, `--md`, `--lg`
Style: `--dark` (solid fill)

---

### Status Dot

```html
<span class="gds-status-dot gds-status-dot--online gds-status-dot--sm"></span>
```

States: `--online` (green), `--offline` (gray), `--busy` (red), `--away` (yellow), `--info` (blue), `--purple`
Sizes: `--sm`, `--md`, `--lg`, `--xl`
Style: `--ring` (adds outline ring)

---

### Pct Badge (Percentage Change)

```html
<span class="gds-pct-badge gds-pct-badge--positive">
  <i data-lucide="arrow-up" class="gds-pct-badge__icon"></i>
  <span class="gds-pct-badge__value">12.5%</span>
</span>
```

Tones: `--positive`, `--critical`, `--warning`, `--neutral`

---

### Filter Badge

```html
<button class="gds-filter-badge gds-filter-badge--active">
  <i data-lucide="filter" class="gds-filter-badge__icon"></i>
  Filters
  <span class="gds-filter-badge__count">3</span>
</button>
```

---

### Avatar

```html
<!-- Image avatar -->
<div class="gds-avatar gds-avatar--32">
  <img class="gds-avatar__img" src="photo.jpg" alt="Name" />
</div>

<!-- Letter avatar -->
<div class="gds-avatar gds-avatar--32">
  <span class="gds-avatar__text">FK</span>
</div>

<!-- Icon avatar -->
<div class="gds-avatar gds-avatar--32">
  <i data-lucide="user" class="gds-avatar__icon"></i>
</div>

<!-- Avatar group (overlapping) -->
<div class="gds-avatar-group">
  <span class="gds-avatar-group__counter">+3</span>
  <div class="gds-avatar gds-avatar--32"><img class="gds-avatar__img" src="1.jpg" alt="" /></div>
  <div class="gds-avatar gds-avatar--32"><img class="gds-avatar__img" src="2.jpg" alt="" /></div>
  <div class="gds-avatar gds-avatar--32"><img class="gds-avatar__img" src="3.jpg" alt="" /></div>
</div>

<!-- Avatar name (avatar + text pair) -->
<div class="gds-avatar-name">
  <div class="gds-avatar gds-avatar--32">
    <img class="gds-avatar__img" src="photo.jpg" alt="" />
  </div>
  <div class="gds-avatar-name__info">
    <span class="gds-avatar-name__label">John Doe</span>
    <span class="gds-avatar-name__subtitle">Engineer</span>
  </div>
</div>
```

Sizes: `gds-avatar--16`, `--20`, `--24`, `--32`, `--40`, `--48`, `--64`
Shapes: `gds-avatar--circle` (default), `gds-avatar--square`
Avatar-name sizes: `gds-avatar-name--sm`, `--xs`
Avatar-name style: `gds-avatar-name--soft` (muted colors)

**Avatar group HTML order**: counter FIRST, then avatars. CSS uses `flex-direction: row-reverse` so counter appears on the right visually.

---

### Dropdown

```html
<div class="gds-dropdown gds-dropdown--open">
  <button class="gds-dropdown__trigger">
    <span class="gds-dropdown__value">Selected item</span>
    <i data-lucide="chevron-down" class="gds-dropdown__arrow"></i>
  </button>
  <div class="gds-dropdown__panel">
    <div class="gds-dropdown__search">
      <i data-lucide="search" class="gds-dropdown__search-icon"></i>
      <input class="gds-dropdown__search-input" placeholder="Search..." />
    </div>
    <ul class="gds-dropdown__list">
      <li class="gds-dropdown__item gds-dropdown__item--selected">
        <span class="gds-dropdown__label">Option 1</span>
        <i data-lucide="check" class="gds-dropdown__check"></i>
      </li>
      <li class="gds-dropdown__item">
        <span class="gds-dropdown__label">Option 2</span>
      </li>
      <li class="gds-dropdown__divider"></li>
      <li class="gds-dropdown__item gds-dropdown__item--disabled">
        <span class="gds-dropdown__label">Disabled</span>
      </li>
    </ul>
  </div>
</div>
```

Trigger sizes: `gds-dropdown__trigger--sm`, `--lg`
Item states: `--selected`, `--checked`, `--disabled`, `--rich` (two-line)
Open: add `gds-dropdown--open` to container

---

### Menu

```html
<div class="gds-menu">
  <button class="gds-menu__item">
    <i data-lucide="edit" class="gds-menu__icon"></i>
    <span class="gds-menu__label">Edit</span>
    <span class="gds-menu__shortcut">Cmd+E</span>
  </button>
  <div class="gds-menu__divider"></div>
  <button class="gds-menu__item gds-menu__item--danger">
    <i data-lucide="trash" class="gds-menu__icon"></i>
    <span class="gds-menu__label">Delete</span>
  </button>
</div>
```

Item modifiers: `--danger`, `--disabled`, `--rich` (two-line with `__desc`)

---

### Tabs

```html
<!-- Horizontal (default) -->
<nav class="gds-tabs" aria-label="Navigation">
  <button class="gds-tab gds-tab--active">
    <i data-lucide="home" class="gds-tab__icon"></i>
    <span class="gds-tab__text">Home</span>
    <span class="gds-badge gds-badge--sm gds-tab__badge">12</span>
  </button>
  <button class="gds-tab">
    <span class="gds-tab__text">Settings</span>
  </button>
  <button class="gds-tab gds-tab--disabled">
    <span class="gds-tab__text">Archived</span>
  </button>
</nav>
```

| Modifier | Effect |
|----------|--------|
| `gds-tabs--sm` | Small size |
| `gds-tabs--vertical` | Vertical stack |
| `gds-tabs--filled` | Filled/pill background on active |
| `gds-tabs--card` | Card-style tabs (top border) |
| `gds-tab--active` | Active tab |
| `gds-tab--disabled` | Disabled tab |
| `gds-tab--icon-only` | Icon without text |

Tab elements: `__text`, `__icon`, `__badge`, `__status` (dot), `__close` (remove button)

---

### Data Table

```html
<div class="gds-table-scroll">
  <div class="gds-table gds-table--cards">
    <table class="gds-table__table">
      <thead class="gds-table__head">
        <tr class="gds-table__row">
          <th class="gds-table__cell gds-table__cell--checkbox">
            <label class="gds-checkbox gds-checkbox--sm">
              <input type="checkbox" class="gds-checkbox__input" aria-label="Select all" />
              <span class="gds-checkbox__control"><svg>...</svg></span>
            </label>
          </th>
          <th class="gds-table__cell gds-table__cell--sortable">
            Name <span class="gds-table__sort-icon"><i data-lucide="arrow-up-down"></i></span>
          </th>
          <th class="gds-table__cell">Status</th>
        </tr>
      </thead>
      <tbody class="gds-table__body">
        <tr class="gds-table__row">
          <td class="gds-table__cell gds-table__cell--checkbox">
            <label class="gds-checkbox gds-checkbox--sm">...</label>
          </td>
          <td class="gds-table__cell">
            <div class="gds-table__entry">
              <img class="gds-table__entry-image" src="thumb.jpg" alt="" />
              <div class="gds-table__entry-info">
                <span class="gds-table__entry-title">Article Title</span>
                <span class="gds-table__entry-subtitle">Subtitle</span>
              </div>
            </div>
          </td>
          <td class="gds-table__cell">
            <span class="gds-badge gds-badge--positive">Active</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

| Table modifier | Effect |
|----------------|--------|
| `gds-table--cards` | Card-style with rounded corners and shadows |
| `gds-table--striped` | Alternating row colors |
| `gds-table--compact` | Reduced row padding |
| `gds-table--loading` | Shows skeleton animation |
| `gds-table--borderless` | No row borders |

| Cell modifier | Effect |
|---------------|--------|
| `gds-table__cell--checkbox` | Checkbox column (narrow) |
| `gds-table__cell--action` | Action column (narrow) |
| `gds-table__cell--sortable` | Adds sort cursor + icon |
| `gds-table__cell--sorted` | Active sort column (highlights the icon). Required for both directions |
| `gds-table__cell--sorted-desc` | Add *on top of* `--sorted` for descending. It rotates the icon 180° |

**Sort icon rule:** unsorted columns use `arrow-up-down`. The sorted column always uses `arrow-up` and lets CSS flip it:
```html
<!-- ascending -->
<th scope="col" class="gds-table__cell gds-table__cell--sortable gds-table__cell--sorted" aria-sort="ascending">
  Name <span class="gds-table__sort-icon"><i data-lucide="arrow-up"></i></span>
</th>
<!-- descending: same icon, add --sorted-desc -->
<th scope="col" class="gds-table__cell gds-table__cell--sortable gds-table__cell--sorted gds-table__cell--sorted-desc" aria-sort="descending">
  Updated <span class="gds-table__sort-icon"><i data-lucide="arrow-up"></i></span>
</th>
```
Never use an `arrow-down` icon with `--sorted-desc`, because it would point up.
| `gds-table__cell--sticky-checkbox` | Sticky left checkbox |
| `gds-table__cell--sticky-entry` | Sticky left entry column |

Row states: `gds-table__row--selected`, `gds-table__row--hover`

Toolbar (bulk actions):
```html
<div class="gds-table__toolbar is-visible">
  <span class="gds-table__toolbar-count">3 selected</span>
  <div class="gds-table__toolbar-divider"></div>
  <button class="gds-table__toolbar-btn">Delete</button>
  <button class="gds-table__toolbar-btn">Export</button>
</div>
```

**Data table rules (v2.6):**
- The root class is `gds-table`. There is **no** `gds-data-table` class.
- Give the `<table>` an accessible name (`aria-label="Entries"` or a `<caption>`).
- Every header cell is `<th scope="col">`. Add `aria-sort="ascending"` / `"descending"` to the sorted header.
- Header text uses `--table-header-color` (= `text-label`, 8.50:1). Do not override it with `text-helper` or `text-tertiary`.
- Every row checkbox needs an `aria-label` (e.g. "Select row: Article Title").
- For paging below the table, use the Pagination bar, not custom markup. Copy this structure exactly:
  ```html
  <div class="gds-pagination-bar gds-pagination-bar--full">
    <span class="gds-pagination-bar__summary">Viewing 1 to 10 of 397 Items</span>
    <div class="gds-pagination-bar__cluster">
      <button type="button" class="gds-pagination-bar__select" aria-haspopup="listbox">
        <span>10 Items per page</span><i data-lucide="chevron-down"></i>
      </button>
      <nav class="gds-pagination" aria-label="Pagination">
        <button class="gds-pagination__item gds-pagination__item--icon-only" aria-label="Previous page"><i data-lucide="chevron-left"></i></button>
        <button class="gds-pagination__item gds-pagination__item--current" aria-current="page">1</button>
        <button class="gds-pagination__item">2</button>
        <span class="gds-pagination__ellipsis" aria-hidden="true">…</span>
        <button class="gds-pagination__item">40</button>
        <button class="gds-pagination__item gds-pagination__item--icon-only" aria-label="Next page"><i data-lucide="chevron-right"></i></button>
      </nav>
    </div>
  </div>
  ```
  - Page items are `<button>` elements directly inside `<nav>`. **Never use `<ul>`/`<li>`**: GDS has no reset, so bullets and list padding will show.
  - The page-size control is the `__select` button, not a native `<select>`.
  - Arrow-only buttons use `__item--icon-only` with an `aria-label`. `__nav` is only for labelled "Previous" / "Next" text buttons.
- Visual + axe tests for this component: `tests/visual/fixtures/datatable.html`.

---

### Alert

```html
<div class="gds-alert gds-alert--error">
  <i data-lucide="alert-circle" class="gds-alert__icon"></i>
  <div class="gds-alert__content">
    <div class="gds-alert__title">Error</div>
    <div class="gds-alert__desc">Something went wrong.</div>
    <div class="gds-alert__actions">
      <a class="gds-alert__link" href="#">Retry</a>
    </div>
  </div>
  <button class="gds-alert__close" aria-label="Close"><i data-lucide="x"></i></button>
</div>
```

Variants: `--info`, `--success`, `--warning`, `--error`
Styles: `--minimal` (no title), `--accent` (left border), `--banner` (full-width), `--compact` (inline), `--toast` (floating)

---

### Toast

```html
<div class="gds-toast gds-toast--success">
  <i data-lucide="check-circle" class="gds-toast__icon"></i>
  <div class="gds-toast__body">
    <span class="gds-toast__text">Saved successfully</span>
    <button class="gds-toast__action">Undo</button>
  </div>
  <div class="gds-toast__timer">
    <svg class="gds-toast__timer-ring">...</svg>
  </div>
</div>
```

Variants: `--info`, `--success`, `--warning`, `--critical`
Container: `gds-toast-container` with position modifiers `--top-right`, `--top-left`, `--bottom-right`, `--bottom-left`, `--top-center`, `--bottom-center`

---

### Modal

```html
<div class="gds-modal-overlay gds-modal-overlay--open">
  <div class="gds-modal gds-modal--md">
    <button class="gds-modal__close" aria-label="Close"><i data-lucide="x"></i></button>
    <div class="gds-modal__header">
      <h2 class="gds-modal__title">Confirm</h2>
      <p class="gds-modal__desc">Are you sure?</p>
    </div>
    <div class="gds-modal__body">Content here</div>
    <div class="gds-modal__footer">
      <button class="gds-btn gds-btn--secondary">Cancel</button>
      <button class="gds-btn gds-btn--primary">Confirm</button>
    </div>
  </div>
</div>
```

Sizes: `gds-modal--sm`, `gds-modal--md`
Variant: `gds-modal--destructive` (red styling)
Footer: `gds-modal__footer--split` (space-between layout)

---

### Side Panel

```html
<div class="gds-sidepanel-overlay gds-sidepanel-overlay--open">
  <div class="gds-sidepanel gds-sidepanel--normal">
    <div class="gds-sidepanel__topbar">
      <span class="gds-sidepanel__topbar-title">Details</span>
    </div>
    <div class="gds-sidepanel__content">
      <div class="gds-sidepanel__header">
        <h2 class="gds-sidepanel__title">Edit Item</h2>
        <p class="gds-sidepanel__desc">Update the details below</p>
      </div>
      <div class="gds-sidepanel__body">Content</div>
      <div class="gds-sidepanel__footer">
        <button class="gds-btn gds-btn--secondary">Cancel</button>
        <button class="gds-btn gds-btn--primary">Save</button>
      </div>
    </div>
  </div>
</div>
```

Sizes: `gds-sidepanel--default`, `--normal` (500px), `--lg`, `--xl`
Footer: `gds-sidepanel__footer--split`

---

### More components (class reference)

These components exist in v2.6 but have no full example in this file yet.
The class names below are complete and verified against the CSS. **For markup, copy the example from the live docs page**,
don't guess the structure.

| Component | Classes | Docs |
|-----------|---------|------|
| Pagination | `gds-pagination`, `--sm`, `--lg`, `__item`, `__item--current`, `__item--disabled`, `__item--icon-only`, `__nav`, `__ellipsis` | [page=pagination](https://docs-phi-black.vercel.app/?page=pagination) |
| Pagination bar | `gds-pagination-bar`, `--full`, `--sm`, `--lg`, `--no-border`, `--on-surface`, `__cluster`, `__divider`, `__select`, `__summary` | [page=pagination](https://docs-phi-black.vercel.app/?page=pagination) |
| Card | `gds-card`, `--elevated`, `--flat`, `--interactive`, `--selected`, `--disabled`, `--padded-sm`, `--padded-lg`, `--padded-none`, `__header`, `__title`, `__subtitle`, `__media`, `__body`, `__footer` | [page=card](https://docs-phi-black.vercel.app/?page=card) |
| Skeleton | `gds-skeleton`, `--text`, `--text-sm/md/lg/xl/2xl`, `--rect`, `--circle`, `--row`, `--avatar-sm/md/lg/xl`, `--w-25/50/75` | [page=skeleton](https://docs-phi-black.vercel.app/?page=skeleton) |
| Tooltip | `gds-tooltip`, `__bubble`, `__bubble--top/bottom/left/right`, `__bubble--sm/md/lg`, `__bubble--multiline`, `__bubble--interactive`, `__kbd` | [page=tooltip](https://docs-phi-black.vercel.app/?page=tooltip) |
| Popover | `gds-popover`, `--open`, `__arrow`, `__content` | [page=popover](https://docs-phi-black.vercel.app/?page=popover) |
| Calendar | `gds-calendar`, `--compact`, `--advanced`, `__header`, `__nav`, `__title`, `__grid`, `__weekdays`, `__day`, `__day--today/selected/disabled/outside/in-range/range-start/range-end`, `__presets`, `__time`, `__footer` | [page=calendar](https://docs-phi-black.vercel.app/?page=calendar) |

Every component also has a docs page with a live example: `https://docs-phi-black.vercel.app/?page=<component>`.

---

## Accessibility

GDS handles these automatically:
- Focus rings via `--gds-color-border-focus` (themed)
- Disabled opacity via `--gds-opacity-disabled`
- `prefers-reduced-motion` should be added by consuming apps
- All icon buttons MUST have `aria-label`
- All checkboxes/radios MUST have associated labels
- Modal/sidepanel must trap focus when open
- Text color must follow the "Text contrast rules" table (WCAG AA 4.5:1)
- GDS v2.6 runs automated axe + visual tests on its components (`tests/visual/`)

---

## File Structure

```
gjirafa-design-system/
  docs/
    gjirafa-ds.css          <-- compiled CSS served by the CDN link above
    index.html              <-- live docs
  dist/                     <-- local build output (not published yet)
  src/
    tokens/                 <-- foundation + semantic + component tokens
    themes/                 <-- codex.scss, vpplayer.scss
    components/             <-- 26 component SCSS files
    utilities/              <-- color, spacing, typography, shadow, radius classes
    index.scss              <-- main entry point
```
