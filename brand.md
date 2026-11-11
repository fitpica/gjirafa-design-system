# Gjirafa Design System (GDS) v2.6 — AI Integration Guide

> This document is the single source of truth for any AI tool (Claude, Cursor, Copilot, etc.)
> building UI with GDS. Read this BEFORE generating any HTML or CSS.
>
> **Version:** 2.6.2 · **Live docs:** https://docs-phi-black.vercel.app
> Every class and `--gds-*` token named here exists in the compiled CSS of v2.6.2.
> If something you need is not in this file, **do not invent it**. Say it is missing and ask.
>
> Sections between `<!-- gds:component:… -->` markers are generated from `components/*.json` (the component contracts). Those contracts are the source; this file is their readable form.

---

## GDS Principles

Every rule in this file follows from these three. When a case is not covered, decide by them.

1. **Accessible by default, not by effort.** Every combination GDS allows passes WCAG AA without anyone checking. Use only the text tokens that pass AA, never show status by colour alone (dot + label), and give tables `scope` and `aria-sort`.
2. **Reuse before you create.** If GDS has it, use it. If GDS does not have it, do not invent a local version: say it is missing so it can become a GDS pattern. Custom CSS that duplicates a GDS component is a bug. (The one exception is layout-only CSS for missing page patterns, see Critical Rule 9.)
3. **Obvious over documented.** If a rule has to be explained, the system should change. Defaults must be safe, one modifier means one thing, and BEM has no exceptions. Report any rule in this file you think could be removed by changing the system.

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.6.2/docs/gjirafa-ds.css" />

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
@import url('https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.6.2/docs/gjirafa-ds.css');
```

> **Do NOT use `npm install @gjirafa/design-system`** — the NPM package is not published yet (404).
> Always pin the version (`@v2.6.2`), never `@latest` or `@main`.

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
9. **Layout-only exception (until GDS has the pattern).** GDS has no page header, filter bar or page layout yet. For those only, you may write layout CSS with your product prefix (e.g. `cx-page-header`). It may use only `display`, `flex`/`grid`, `gap`, alignment, width/max-width and padding/margin, with `--gds-*` tokens for every value. It must never set colours, borders, typography or shadows, and never restyle a `gds-` class. Add a comment `/* GDS gap: <pattern name> */` so it can be replaced when the pattern ships.

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

Font token: `--gds-font-family-base` = `Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif` (set it on `body`, see Setup step 3)

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

<!-- gds:component:input:start -->
### Input

A text field with optional label, icon, prefix/suffix, helper text and character count.

**Use when:**
- Short free text: names, titles, emails, search.
- Multi-line text with gds-input--textarea.

**Don't use when:**
- Choosing from a known list of options → use dropdown
- Picking a date → use calendar

**Example: Search box (no visible label)**
```html
<div class="gds-input gds-input--md">
  <div class="gds-input__wrap">
    <i data-lucide="search" class="gds-input__icon"></i>
    <input type="search" class="gds-input__field" placeholder="Search entries" aria-label="Search entries" />
  </div>
</div>
```

**Example: With label, helper and error**
```html
<div class="gds-input gds-input--md gds-input--error">
  <label class="gds-input__label" for="entry-title">Title <span class="gds-input__required">*</span></label>
  <div class="gds-input__wrap"><input id="entry-title" class="gds-input__field" aria-invalid="true" aria-describedby="entry-title-help" /></div>
  <span class="gds-input__helper" id="entry-title-help">Title is required</span>
</div>
```

**Example: Textarea with count**
```html
<div class="gds-input gds-input--md gds-input--textarea">
  <label class="gds-input__label" for="entry-summary">Summary</label>
  <div class="gds-input__wrap"><textarea id="entry-summary" class="gds-input__field" rows="3"></textarea></div>
  <span class="gds-input__count">0 / 200</span>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-input` | div | yes | top level | Wrapper that stacks label, field and helper. Always has a size modifier. |
| `gds-input__label` | label | no | `gds-input` | Visible label. Link it with for/id. Attributes: `for` (id of the field). |
| `gds-input__required` | span | no | `gds-input__label` | Required marker "*" inside the label. |
| `gds-input__wrap` | div | yes | `gds-input` | The bordered box. Its height comes from the size modifier. |
| `gds-input__icon` | i \| span | no | `gds-input__wrap` | Leading icon (e.g. search). |
| `gds-input__prefix` | span | no | `gds-input__wrap` | Fixed text before the value (e.g. https://). |
| `gds-input__field` | input \| textarea | yes | `gds-input__wrap` | The native field. Attributes: `id` (matches the label's for), `aria-label` (Required when there is no visible label (e.g. a search box)). |
| `gds-input__suffix` | span | no | `gds-input__wrap` | Fixed text after the value (e.g. .com). |
| `gds-input__helper` | span | no | `gds-input` | Helper or error text under the box. |
| `gds-input__count` | span | no | `gds-input` | Character count, e.g. "0 / 200". |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-input--sm` | `gds-input` | size | 32px high. |
| `gds-input--md` | `gds-input` | size | 40px high. The usual choice. |
| `gds-input--lg` | `gds-input` | size | 48px high. |
| `gds-input--error` | `gds-input` | state | Red border. Put the message in __helper and set aria-invalid="true". |
| `gds-input--warning` | `gds-input` | state | Orange border. |
| `gds-input--success` | `gds-input` | state | Green border. |
| `gds-input--disabled` | `gds-input` | state | Disabled look. Also set disabled on the field. |
| `gds-input--textarea` | `gds-input` | content | Multi-line: the field is a <textarea>. |
| `gds-input--shadow` | `gds-input` | style | Shadow instead of an outline border. |
| `gds-input--full` | `gds-input` | width | Fills the available width. |

**States:**
- **focus**: Native :focus on the field highlights the wrap.
- **error**: gds-input--error + message in __helper + aria-invalid="true" + aria-describedby pointing at the helper.
- **disabled**: gds-input--disabled + disabled on the field.

**Accessibility:**
- Every field has a name: a <label for> or, for search boxes, aria-label.
- Placeholder is not a label.
- Link helper and error text with aria-describedby.

**Rules:**
- Every .gds-input has exactly one of --sm, --md, --lg. *Why:* The height lives on the size class; a bare .gds-input collapses. (Obvious over documented · auto-checkable)
- Every .gds-input__field has a linked <label> or an aria-label. *Why:* An unnamed field is announced as "edit text". (Accessible by default · auto-checkable)
- --error always comes with a text message in __helper. *Why:* A red border alone does not say what is wrong. (Accessible by default · auto-checkable)
- The field sits inside .gds-input__wrap, never directly in .gds-input. *Why:* The border, icon and prefix layout live on the wrap. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Older guides called --md the default although a bare .gds-input has no height. *Planned fix:* v3: md height by default.

*Generated from `components/input.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:input:end -->

---

<!-- gds:component:checkbox:start -->
### Checkbox

Lets people turn one option on or off, or pick several options from a list.

**Use when:**
- Selecting rows in a table.
- Choosing any number of options from a short list.
- Agreeing to something before submitting a form.

**Don't use when:**
- A setting that takes effect immediately → use toggle
- Exactly one choice from a list → use radio

**Example: With label**
```html
<label class="gds-checkbox gds-checkbox--md">
  <input type="checkbox" class="gds-checkbox__input" />
  <span class="gds-checkbox__control"><i data-lucide="check"></i></span>
  <span class="gds-checkbox__label">Send me updates</span>
</label>
```

**Example: In a table cell (no visible label)**
```html
<label class="gds-checkbox gds-checkbox--sm">
  <input type="checkbox" class="gds-checkbox__input" checked aria-label="Select Winter travel guide" />
  <span class="gds-checkbox__control"><i data-lucide="check"></i></span>
</label>
```

**Example: Mixed (select all, some rows selected)**
```html
<label class="gds-checkbox gds-checkbox--sm gds-checkbox--mixed">
  <input type="checkbox" class="gds-checkbox__input" aria-label="Select all" />
  <span class="gds-checkbox__control"><i data-lucide="minus"></i></span>
</label>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-checkbox` | label | yes | top level | Wrapper. A <label>, so clicking the text toggles the box. |
| `gds-checkbox__input` | input | yes | `gds-checkbox` | Native checkbox, visually hidden but focusable. Its :checked state drives the visual. Attributes: `type` (checkbox), `aria-label` (Required when there is no visible label (e.g. in table cells)). |
| `gds-checkbox__control` | span | yes | `gds-checkbox` | The visible box. Must come after the input (CSS uses the ~ sibling selector). Contains the icon: <i data-lucide="check"></i>, or "minus" for mixed. |
| `gds-checkbox__label` | span | no | `gds-checkbox` | Visible label text. |
| `gds-checkbox__helper` | span | no | `gds-checkbox` | Helper text under the label. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-checkbox--sm` | `gds-checkbox` | size | 16px box. Use in tables. |
| `gds-checkbox--md` | `gds-checkbox` | size (default) | 20px box. Use in forms. |
| `gds-checkbox--lg` | `gds-checkbox` | size | 24px box. |
| `gds-checkbox--checked` | `gds-checkbox` | state | Forces the checked look. Prefer the native checked attribute, which works without this class. |
| `gds-checkbox--mixed` | `gds-checkbox` | state | Indeterminate (some, not all, selected). Use the minus icon and set input.indeterminate = true in JS. |
| `gds-checkbox--disabled` | `gds-checkbox` | state | Disabled look. Also set the disabled attribute on the input. |

**States:**
- **checked**: checked attribute on .gds-checkbox__input (CSS reads :checked).
- **mixed**: gds-checkbox--mixed + minus icon + input.indeterminate = true.
- **disabled**: gds-checkbox--disabled + disabled attribute on the input.
- **focus**: Native :focus-visible on the input shows a ring on the control.

**Accessibility:**
- Keep the native input: it is what keyboards and screen readers use.
- Without visible text, give the input an aria-label ("Select all", "Select <row name>").
- For disabled, set the disabled attribute, not only the class.

**Rules:**
- Every .gds-checkbox contains an <input type="checkbox" class="gds-checkbox__input"> before .gds-checkbox__control. *Why:* The visual state comes from the input through the ~ selector; without it the box never changes. (Accessible by default · auto-checkable)
- A checkbox without .gds-checkbox__label has an aria-label on the input. *Why:* Otherwise it is announced as an unnamed checkbox. (Accessible by default · auto-checkable)
- The control contains the Lucide check icon (or minus for mixed). Do not draw your own SVG. *Why:* Both AI tests drew their own tick because the guide showed <svg>...</svg>. (Reuse before you create · auto-checkable)
- Checkboxes in table cells use gds-checkbox--sm. *Why:* Matches the 16px icon grid of table rows. (Reuse before you create · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Checked can be shown two ways (native checked or gds-checkbox--checked), which can disagree. *Planned fix:* v3: drive the look only from the native state; keep --checked for docs previews.

*Generated from `components/checkbox.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:checkbox:end -->

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

<!-- gds:component:badge:start -->
### Badge

A small label that shows the status or category of something.

**Use when:**
- Showing a status in a table cell or card (Published, Draft…).
- Labelling a category or count next to an item.

**Don't use when:**
- Something people can click to filter or remove → use chip or filter-badge
- A percentage change → use pct-badge

**Example: Content statuses**
```html
<span class="gds-badge gds-badge--positive"><span class="gds-badge__dot"></span><span class="gds-badge__label">Published</span></span>
<span class="gds-badge gds-badge--neutral"><span class="gds-badge__dot"></span><span class="gds-badge__label">Draft</span></span>
<span class="gds-badge gds-badge--warning"><span class="gds-badge__dot"></span><span class="gds-badge__label">Scheduled</span></span>
<span class="gds-badge gds-badge--neutral"><span class="gds-badge__dot"></span><span class="gds-badge__label">Archived</span></span>
```

**Example: With icon and count**
```html
<span class="gds-badge gds-badge--neutral"><span class="gds-badge__icon"><i data-lucide="minus-circle" width="12" height="12"></i></span><span class="gds-badge__label">Neutral</span><span class="gds-badge__count">12</span></span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-badge` | span | yes | top level | Wrapper. |
| `gds-badge__dot` | span | no | `gds-badge` | Coloured dot. Use for statuses. |
| `gds-badge__icon` | span | no | `gds-badge` | Icon slot (Lucide, 12px), instead of the dot. |
| `gds-badge__label` | span | yes | `gds-badge` | The text. |
| `gds-badge__count` | span | no | `gds-badge` | Number after the label. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-badge--neutral` | `gds-badge` | variant | Gray. |
| `gds-badge--positive` | `gds-badge` | variant | Green. |
| `gds-badge--warning` | `gds-badge` | variant | Orange. |
| `gds-badge--critical` | `gds-badge` | variant | Red. |
| `gds-badge--info` | `gds-badge` | variant | Blue. |
| `gds-badge--purple` | `gds-badge` | variant | Purple. Categories only, no status meaning. |
| `gds-badge--outline` | `gds-badge` | style | Outlined instead of filled. |
| `gds-badge--solid` | `gds-badge` | style | Strong solid fill, for high emphasis. |
| `gds-badge--text` | `gds-badge` | style | Text only, no background. |
| `gds-badge--sm` | `gds-badge` | size | Small. |
| `gds-badge--md` | `gds-badge` | size (default) | Medium. |
| `gds-badge--lg` | `gds-badge` | size | Large. |

**Accessibility:**
- Never show status by colour alone: always include .gds-badge__label text.
- The dot and icon are decorative; the label carries the meaning.

**Rules:**
- Content status mapping: Published → positive, Draft → neutral, Scheduled → warning, Archived → neutral. *Why:* Design decision (11 Nov 2026). Scheduled changes state on its own, so it draws attention; Draft and Archived need no action. (Reuse before you create · auto-checkable)
- Status badges use the dot + label form. *Why:* Status is not shown by colour alone. (Accessible by default · auto-checkable)
- A badge has exactly one colour variant. *Why:* Two variants on one badge produce an undefined colour. (Obvious over documented · auto-checkable)
- A badge is never a button or link. *Why:* Badges have no hover or focus styles. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Without a variant class the badge has no defined colour. *Planned fix:* v3: neutral by default, so the variant becomes optional.

*Generated from `components/badge.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:badge:end -->

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

<!-- gds:component:dropdown:start -->
### Dropdown

A trigger that opens a panel of options: single select, multi-select, searchable lists.

**Use when:**
- Choosing one or several values from a list (status filter, content type, author).
- Lists long enough to need search.

**Don't use when:**
- 2–4 options that should all stay visible → use radio or tabs
- Actions rather than values (Edit, Duplicate, Delete) → use menu

**Example: Status filter (single select, open)**
```html
<div class="gds-dropdown gds-dropdown--open">
  <button type="button" class="gds-dropdown__trigger" aria-haspopup="listbox" aria-expanded="true">
    <span class="gds-dropdown__value">Status: All</span>
    <span class="gds-dropdown__arrow"><i data-lucide="chevron-down" width="16" height="16"></i></span>
  </button>
  <div class="gds-dropdown__panel">
    <div class="gds-dropdown__list" role="listbox" aria-label="Status">
      <button type="button" class="gds-dropdown__item gds-dropdown__item--selected" role="option" aria-selected="true">
        <span class="gds-dropdown__label">All</span>
        <span class="gds-dropdown__check"><i data-lucide="check" width="16" height="16"></i></span>
      </button>
      <button type="button" class="gds-dropdown__item" role="option" aria-selected="false">
        <span class="gds-dropdown__label">Published</span>
        <span class="gds-dropdown__check"><i data-lucide="check" width="16" height="16"></i></span>
      </button>
    </div>
  </div>
</div>
```

**Example: Closed, with placeholder**
```html
<div class="gds-dropdown">
  <button type="button" class="gds-dropdown__trigger" aria-haspopup="listbox" aria-expanded="false">
    <span class="gds-dropdown__placeholder">Content type</span>
    <span class="gds-dropdown__arrow"><i data-lucide="chevron-down" width="16" height="16"></i></span>
  </button>
  <div class="gds-dropdown__panel">
    <div class="gds-dropdown__list" role="listbox" aria-label="Content type">
      <button type="button" class="gds-dropdown__item" role="option" aria-selected="false">
        <span class="gds-dropdown__label">Article</span>
      </button>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-dropdown` | div | yes | top level | Wrapper. Has no styles of its own: the product positions the panel (e.g. position: relative on the wrapper, absolute on the panel). |
| `gds-dropdown__trigger` | button | yes | `gds-dropdown` | The closed control. Attributes: `type` (button), `aria-haspopup` (listbox), `aria-expanded` (true \| false). |
| `gds-dropdown__placeholder` | span | no | `gds-dropdown__trigger` | Shown when nothing is selected. |
| `gds-dropdown__value` | span | no | `gds-dropdown__trigger` | The selected value. |
| `gds-dropdown__tags` | div | no | `gds-dropdown__trigger` | Multi-select: selected values as .gds-chip elements. |
| `gds-dropdown__arrow` | span | yes | `gds-dropdown__trigger` | Chevron-down icon. Rotates when open. |
| `gds-dropdown__panel` | div | yes | `gds-dropdown` | The floating panel. Hidden until gds-dropdown--open. Attributes: `role` (listbox (or contains the list with role=listbox)). |
| `gds-dropdown__search` | div | no | `gds-dropdown__panel` | Search row at the top of the panel. |
| `gds-dropdown__search-icon` | span | no | `gds-dropdown__search` | Search icon. |
| `gds-dropdown__search-input` | input | no | `gds-dropdown__search` | Search field. Attributes: `aria-label` (e.g. "Search authors"). |
| `gds-dropdown__list` | div | yes | `gds-dropdown__panel` | Scrollable list of items. |
| `gds-dropdown__group` | div | no | `gds-dropdown__list` | Group heading (uppercase). |
| `gds-dropdown__item` | button | yes, repeats | `gds-dropdown__list` | One option. A <button>, so it is focusable. Attributes: `type` (button), `role` (option), `aria-selected` (true \| false). |
| `gds-dropdown__icon` | span | no | `gds-dropdown__item` | Leading icon of an item. |
| `gds-dropdown__content` | span | no | `gds-dropdown__item` | Rich items: stacks label and description. |
| `gds-dropdown__label` | span | yes | `gds-dropdown__item` | Item text. |
| `gds-dropdown__desc` | span | no | `gds-dropdown__content` | Secondary line in rich items. |
| `gds-dropdown__badge` | span | no | `gds-dropdown__item` | Small count or status on the right. |
| `gds-dropdown__check` | span | no | `gds-dropdown__item` | Check icon, visible on the selected item (single select). |
| `gds-dropdown__divider` | div | no | `gds-dropdown__list` | Separator between groups. Attributes: `role` (separator). |
| `gds-dropdown__empty` | div | no | `gds-dropdown__panel` | No-results message (with __empty-icon). |
| `gds-dropdown__empty-icon` | span | no | `gds-dropdown__empty` | Icon above the empty message. |
| `gds-dropdown__loading` | div | no | `gds-dropdown__panel` | Loading row (with __spinner). |
| `gds-dropdown__spinner` | span | no | `gds-dropdown__loading` | Spinner. |
| `gds-dropdown__create` | button | no | `gds-dropdown__panel` | "Create …" action at the bottom (with __create-icon). Attributes: `type` (button). |
| `gds-dropdown__create-icon` | span | no | `gds-dropdown__create` | Plus icon. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-dropdown--open` | `gds-dropdown` | state | Shows the panel and rotates the arrow. Set aria-expanded="true" on the trigger. |
| `gds-dropdown__trigger--sm` | `__trigger` | size | Small trigger. |
| `gds-dropdown__trigger--lg` | `__trigger` | size | Large trigger. |
| `gds-dropdown__item--selected` | `__item` | state | Selected (single select). Shows __check. |
| `gds-dropdown__item--checked` | `__item` | state | Checked (multi-select, with a .gds-checkbox__control inside). |
| `gds-dropdown__item--disabled` | `__item` | state | Not selectable. Also set disabled. |
| `gds-dropdown__item--rich` | `__item` | layout | Icon/avatar + label + description layout. |

**States:**
- **open**: gds-dropdown--open on the wrapper + aria-expanded="true" on the trigger.
- **selected**: gds-dropdown__item--selected + aria-selected="true".
- **empty / loading**: Show __empty or __loading inside the panel instead of the list.

**Accessibility:**
- Trigger: <button> with aria-haspopup="listbox" and aria-expanded.
- Items: <button> elements (focusable), role="option", aria-selected.
- Escape closes the panel and returns focus to the trigger (product JS).
- Arrow keys move between items (product JS).

**Rules:**
- .gds-dropdown__item is a <button>, never a <li> or <div>. *Why:* Non-button items cannot be reached with the keyboard; this was an unadmitted guess in the first AI test. (Accessible by default · auto-checkable)
- The trigger has aria-haspopup and aria-expanded matching gds-dropdown--open. *Why:* Screen readers announce whether the list is open. (Accessible by default · auto-checkable)
- Next to a gds-input--md, use the default trigger size; next to --sm use __trigger--sm. Heights still differ slightly today (known issue). *Why:* Closest available match; in the second AI test the filters were noticeably shorter than the search box. (Obvious over documented)
- Use dropdown for choosing values, menu for actions. *Why:* Different semantics (listbox vs menu). (Reuse before you create)

**Do not use** (exist in the CSS for docs only):
- `gds-dropdown__menu`: Only used by the table action cell (with .is-open). Not part of the dropdown API; use __panel.

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-dropdown has no CSS, so the panel is not positioned; docs examples use inline styles. *Planned fix:* v3: .gds-dropdown { position: relative } and an absolutely positioned panel by default.
- .gds-dropdown__menu exists only for the table action cell and is not part of this API. *Planned fix:* v3: remove __menu; the table uses __panel.
- Trigger heights do not match input heights. *Planned fix:* v3: shared control heights.

*Generated from `components/dropdown.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:dropdown:end -->

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

<!-- gds:component:table:start -->
### Data table

Rows of records with optional selection, sorting, bulk actions and pagination.

**Use when:**
- Showing many records that share the same fields (entries, assets, users, orders).
- People need to compare, sort, select or act on several records at once.

**Don't use when:**
- Fewer than about 5 records with no comparison needed → use card or a simple list
- Key/value details of a single record → use a description list inside a card

**Example: Sortable table with selection and bulk actions**
```html
<div class="gds-table__toolbar is-visible">
  <span class="gds-table__toolbar-count">2 selected</span>
  <div class="gds-table__toolbar-divider" aria-hidden="true"></div>
  <button type="button" class="gds-table__toolbar-btn">Publish</button>
  <button type="button" class="gds-table__toolbar-btn">Delete</button>
</div>
<div class="gds-table">
  <table class="gds-table__table" aria-label="All entries">
    <thead class="gds-table__head">
      <tr class="gds-table__row">
        <th scope="col" class="gds-table__cell gds-table__cell--checkbox">
          <label class="gds-checkbox gds-checkbox--sm gds-checkbox--mixed">
            <input type="checkbox" class="gds-checkbox__input" aria-label="Select all" />
            <span class="gds-checkbox__control"><i data-lucide="minus"></i></span>
          </label>
        </th>
        <th scope="col" class="gds-table__cell gds-table__cell--sortable">
          Title <span class="gds-table__sort-icon"><i data-lucide="arrow-up-down"></i></span>
        </th>
        <th scope="col" class="gds-table__cell">Status</th>
        <th scope="col" class="gds-table__cell gds-table__cell--sortable gds-table__cell--sorted gds-table__cell--sorted-desc" aria-sort="descending">
          Last updated <span class="gds-table__sort-icon"><i data-lucide="arrow-up"></i></span>
        </th>
      </tr>
    </thead>
    <tbody class="gds-table__body">
      <tr class="gds-table__row gds-table__row--selected">
        <td class="gds-table__cell gds-table__cell--checkbox">
          <label class="gds-checkbox gds-checkbox--sm">
            <input type="checkbox" class="gds-checkbox__input" checked aria-label="Select Winter travel guide" />
            <span class="gds-checkbox__control"><i data-lucide="check"></i></span>
          </label>
        </td>
        <td class="gds-table__cell">Winter travel guide</td>
        <td class="gds-table__cell"><span class="gds-badge gds-badge--neutral"><span class="gds-badge__dot"></span><span class="gds-badge__label">Draft</span></span></td>
        <td class="gds-table__cell gds-table__cell--secondary">Today, 08:15</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Example: Empty state**
```html
<div class="gds-table">
  <table class="gds-table__table" aria-label="All entries">
    <thead class="gds-table__head">
      <tr class="gds-table__row">
        <th scope="col" class="gds-table__cell">Title</th>
        <th scope="col" class="gds-table__cell">Status</th>
      </tr>
    </thead>
    <tbody class="gds-table__body">
      <tr class="gds-table__row">
        <td class="gds-table__cell" colspan="2"><div class="gds-table__empty">No entries yet</div></td>
      </tr>
    </tbody>
  </table>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-table__toolbar` | div | no | top level | Bulk-action bar. Sibling placed directly above .gds-table. Hidden until is-visible is added. |
| `gds-table__toolbar-count` | span | yes | `gds-table__toolbar` | Selection count, e.g. "2 selected". |
| `gds-table__toolbar-divider` | div | no | `gds-table__toolbar` | Vertical separator between count and actions. Attributes: `aria-hidden` (true). |
| `gds-table__toolbar-btn` | button | yes, repeats | `gds-table__toolbar` | One bulk action. Attributes: `type` (button). |
| `gds-table-scroll` | div | no | top level | Optional wrapper for horizontal scroll. Wraps .gds-table. |
| `gds-table` | div | yes | top level | Container (border, radius, background). |
| `gds-table__table` | table | yes | `gds-table` | The native table. Attributes: `aria-label` (Name of the data, unless a <caption> is used). |
| `gds-table__head` | thead | yes | `gds-table__table` | Header group. |
| `gds-table__body` | tbody | yes | `gds-table__table` | Body group. |
| `gds-table__row` | tr | yes, repeats | `gds-table__head` or `gds-table__body` | One row. |
| `gds-table__cell` | th \| td | yes, repeats | `gds-table__row` | One cell. Header cells are <th scope="col">. Attributes: `scope` (col (on every <th>)). |
| `gds-table__sort-icon` | span | no | `gds-table__cell` | Wraps the sort icon inside a sortable header cell. Unsorted: arrow-up-down; sorted: arrow-up (CSS flips it for descending). |
| `gds-table__cell-content` | div | no | `gds-table__cell` | Flex wrapper for icon + text combinations inside a cell. |
| `gds-table__entry` | div | no | `gds-table__cell` | Entry cell layout: thumbnail + title + subtitle (mainly in the cards variant). |
| `gds-table__entry-image` | img | no | `gds-table__entry` | Thumbnail. Not an avatar. Attributes: `alt` (Describe the image, or "" if decorative). |
| `gds-table__entry-info` | div | no | `gds-table__entry` | Stacks title and subtitle. |
| `gds-table__entry-title` | span | no | `gds-table__entry-info` | Primary text of the entry. |
| `gds-table__entry-subtitle` | span | no | `gds-table__entry-info` | Secondary text, e.g. slug or path. |
| `gds-table__action-btn` | button | no | `gds-table__cell` | Row overflow (⋯) button in the action cell. Attributes: `type` (button), `aria-label` (e.g. "Actions for <row name>"). |
| `gds-table__empty` | div | no | `gds-table__cell` | Empty-state message, inside a single full-width cell (colspan) in the body. |
| `gds-table__skeleton` | span | no | `gds-table__cell` | Loading placeholder bar inside a cell, used with gds-table--loading. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-table--compact` | `gds-table` | layout | Denser rows. |
| `gds-table--striped` | `gds-table` | style | Alternating row background. |
| `gds-table--borderless` | `gds-table` | style | No container border. |
| `gds-table--cards` | `gds-table` | layout | Each row is a separate card with shadow and gap. |
| `gds-table--responsive` | `gds-table` | layout | Below the mobile breakpoint, rows stack as label/value pairs. Each <td> needs data-label. |
| `gds-table--loading` | `gds-table` | state | Loading state with skeleton rows. Add aria-busy="true" on the <table>. |
| `gds-table__row--selected` | `__row` | state | Selected row background. |
| `gds-table__cell--checkbox` | `__cell` | content | Narrow centered cell holding a .gds-checkbox. |
| `gds-table__cell--action` | `__cell` | content | Narrow rightmost cell holding the row overflow button. |
| `gds-table__cell--secondary` | `__cell` | content | Lighter, smaller text for dates and metadata columns. |
| `gds-table__cell--header-action` | `__cell` | content | Header text for an action column (e.g. "Edit"). |
| `gds-table__cell--sortable` | `__cell` | state | Header cell that can be sorted. Shows the sort icon. |
| `gds-table__cell--sorted` | `__cell` | state | The active sort column (highlights the icon). Required for both directions. Requires `gds-table__cell--sortable`. |
| `gds-table__cell--sorted-desc` | `__cell` | state | Descending. Added on top of --sorted; rotates the arrow-up icon 180°. Requires `gds-table__cell--sorted`. |
| `gds-table__cell--sticky-checkbox` | `__cell` | layout | Freezes the checkbox column during horizontal scroll. |
| `gds-table__cell--sticky-entry` | `__cell` | layout | Freezes the entry (second) column during horizontal scroll. |
| `gds-table__skeleton--xs` | `__skeleton` | width | 20% width placeholder. |
| `gds-table__skeleton--short` | `__skeleton` | width | 30% width placeholder. |
| `gds-table__skeleton--medium` | `__skeleton` | width | 50% width placeholder. |
| `gds-table__skeleton--wide` | `__skeleton` | width | 70% width placeholder. |
| `is-visible` | `__toolbar` | state | Shows the bulk-action bar. |

**States:**
- **hover**: Native :hover on body rows. No class needed.
- **selected**: gds-table__row--selected on the row, plus a checked .gds-checkbox in its checkbox cell.
- **sorted**: gds-table__cell--sorted (+ --sorted-desc) and aria-sort on the <th>.
- **loading**: gds-table--loading on the container, aria-busy="true" on the table, skeleton bars in cells.
- **empty**: One body row with a single cell (colspan = column count) containing .gds-table__empty.

**Accessibility:**
- Name the table with aria-label on <table> or a <caption>.
- Every header cell is <th scope="col">.
- The sorted header has aria-sort="ascending" or "descending"; others have none.
- Sortable headers are not keyboard-reachable yet: GDS has no styled sort button. Flag this gap; do not add an unstyled <button>.
- The select-all checkbox has aria-label="Select all"; each row checkbox has aria-label="Select <row name>".
- Header text uses --table-header-color (text-label, 8.50:1).

**Rules:**
- The root class is gds-table. There is no gds-data-table class. *Why:* AI tools often guess gds-data-table from the component name. (Reuse before you create · auto-checkable)
- Every <th> has scope="col". *Why:* Screen readers announce the column for each cell. (Accessible by default · auto-checkable)
- The <table> has aria-label or a <caption>. *Why:* A table without a name is announced only as "table". (Accessible by default · auto-checkable)
- A descending column has both --sorted and --sorted-desc, and uses the arrow-up icon. *Why:* --sorted-desc rotates the icon; arrow-down would point up. Without --sorted the icon is not highlighted. (Obvious over documented · auto-checkable)
- The sorted <th> has aria-sort matching the direction. *Why:* Sort state must not be visual only. (Accessible by default · auto-checkable)
- Every checkbox inside the table has an aria-label. *Why:* Checkboxes in cells have no visible label. (Accessible by default · auto-checkable)
- Status cells use .gds-badge with dot + label, following the content-status mapping in the badge contract. *Why:* One status language across products; status is never colour alone. (Reuse before you create · auto-checkable)
- Paging below a table uses .gds-pagination-bar--full, never custom markup. *Why:* Custom pagination was the most broken part of the first AI test. (Reuse before you create · auto-checkable)
- The bulk-action bar sits directly above .gds-table (or .gds-table-scroll) and is shown with is-visible only while rows are selected. *Why:* Consistent place for bulk actions. (Reuse before you create)
- Cell content composes GDS components (checkbox, avatar-name, badge, button). Do not build one-off cell UI. *Why:* Keeps tables consistent and themeable. (Reuse before you create)

**Do not use** (exist in the CSS for docs only):
- `gds-table__row--hover`: Docs preview that forces the hover look. Real hover is native :hover.
- `gds-table__row--striped`: Docs preview that forces a striped row. Use gds-table--striped.
- `gds-table__cell--label`: Docs-only cell that labels demo rows ("Default", "Hovered").

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Sortable header cells are clickable only with a mouse; there is no styled button element for keyboard users. *Planned fix:* v3: a gds-table__sort-btn element (reset button inside <th>) so sorting works with Tab + Enter.
- The action-cell dropdown uses .gds-dropdown__menu and .is-open, while the Dropdown component uses .gds-dropdown__panel and .gds-dropdown--open. *Planned fix:* v3: one dropdown API everywhere (__panel / --open).
- is-visible on the toolbar breaks the BEM naming rule. *Planned fix:* v3: gds-table__toolbar--visible.
- Sorting needs two modifiers and one specific icon. *Planned fix:* v3: --sort-asc / --sort-desc.
- GDS has no page header or filter bar yet. Until it does, follow Critical Rule 9 (layout-only CSS with a product prefix and GDS tokens, marked /* GDS gap */). *Planned fix:* v3 patterns: Page header, Filter bar, List page.

*Generated from `components/table.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:table:end -->

---

<!-- gds:component:pagination:start -->
### Pagination

Moves through pages of a long list, with an optional summary and page-size control.

**Use when:**
- Below a table or list that has more records than fit on one page.

**Don't use when:**
- A feed people scroll through without needing a position → use load more / infinite scroll (not in GDS yet)
- Steps of a process → use tabs or a stepper (not in GDS yet)

**Example: Full bar below a table**
```html
<div class="gds-pagination-bar gds-pagination-bar--full">
  <span class="gds-pagination-bar__summary">Viewing 1 to 10 of 397 Items</span>
  <div class="gds-pagination-bar__cluster">
    <button type="button" class="gds-pagination-bar__select" aria-haspopup="listbox">
      <span>10 Items per page</span><i data-lucide="chevron-down"></i>
    </button>
    <nav class="gds-pagination" aria-label="Pagination">
      <button type="button" class="gds-pagination__item gds-pagination__item--icon-only gds-pagination__item--disabled" aria-label="Previous page" disabled><i data-lucide="chevron-left"></i></button>
      <button type="button" class="gds-pagination__item gds-pagination__item--current" aria-current="page">1</button>
      <button type="button" class="gds-pagination__item">2</button>
      <span class="gds-pagination__ellipsis" aria-hidden="true">…</span>
      <button type="button" class="gds-pagination__item">40</button>
      <button type="button" class="gds-pagination__item gds-pagination__item--icon-only" aria-label="Next page"><i data-lucide="chevron-right"></i></button>
    </nav>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-pagination-bar` | div | no | top level | Bar around the page numbers. Under a table, always use it with --full. |
| `gds-pagination-bar__summary` | span | no | `gds-pagination-bar` | "Viewing 1 to 10 of 397 Items". |
| `gds-pagination-bar__cluster` | div | no | `gds-pagination-bar` | Groups the page-size control and the page numbers on the right. |
| `gds-pagination-bar__select` | button | no | `gds-pagination-bar__cluster` | Page-size trigger: <span>10 Items per page</span> + chevron-down icon. Not a native <select>. Attributes: `type` (button), `aria-haspopup` (listbox). |
| `gds-pagination-bar__divider` | span | no | `gds-pagination-bar` | Vertical separator between groups inside the bar. Not needed in the --full bar. Attributes: `aria-hidden` (true). |
| `gds-pagination` | nav | yes | top level | Row of page buttons. Page items are direct children; never a <ul>/<li> list. Attributes: `aria-label` (Pagination). |
| `gds-pagination__item` | button | yes, repeats | `gds-pagination` | A page number, or an arrow with --icon-only. Attributes: `type` (button). |
| `gds-pagination__ellipsis` | span | no | `gds-pagination` | "…" for skipped pages. Attributes: `aria-hidden` (true). |
| `gds-pagination__nav` | button | no | `gds-pagination` | Labelled "Previous" / "Next" text button. Only for buttons with visible text; arrow-only buttons use __item--icon-only. Attributes: `type` (button). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-pagination--sm` | `gds-pagination` | size | Small. |
| `gds-pagination--lg` | `gds-pagination` | size | Large. |
| `gds-pagination__item--current` | `__item` | state | The current page. Add aria-current="page". |
| `gds-pagination__item--disabled` | `__item` | state | Previous/next at the first or last page. Also set the disabled attribute. |
| `gds-pagination__item--icon-only` | `__item` | content | Arrow-only item (chevron-left/right, chevrons-left/right). Needs aria-label. |
| `gds-pagination-bar--full` | `-bar` | layout | Full-width bar with summary on the left. The one to use below tables. |
| `gds-pagination-bar--no-border` | `-bar` | style | Drops the border of the full bar (e.g. inside a card). Requires `gds-pagination-bar--full`. |
| `gds-pagination-bar--on-surface` | `-bar` | style | White pill bar for coloured backgrounds. |
| `gds-pagination-bar--sm` | `-bar` | size | Small bar. |
| `gds-pagination-bar--lg` | `-bar` | size | Large bar. |

**States:**
- **current page**: gds-pagination__item--current + aria-current="page".
- **disabled arrow**: gds-pagination__item--disabled + disabled attribute.
- **single page**: Hide the number row when there is 1 page or less; keep the summary.

**Accessibility:**
- The <nav> has aria-label="Pagination".
- The current page has aria-current="page".
- Arrow-only buttons have aria-label ("Previous page", "Next page", "First page", "Last page").
- Keyboard: ← → move one page, Home/End jump to first/last (implemented in JS by the product).

**Rules:**
- Page items are <button> elements directly inside <nav class="gds-pagination">; never <ul>/<li>. *Why:* GDS has no CSS reset, so list bullets and padding show. (Obvious over documented · auto-checkable)
- Below a table use .gds-pagination-bar.gds-pagination-bar--full. *Why:* One consistent paging bar for lists. (Reuse before you create · auto-checkable)
- The page-size control is .gds-pagination-bar__select (a button), not a native <select>. *Why:* A native select does not match the bar and was a wrong guess in the first AI test. (Reuse before you create · auto-checkable)
- __nav is only for buttons with visible "Previous"/"Next" text; arrow-only buttons use __item--icon-only with aria-label. *Why:* The two have different sizes and spacing. (Obvious over documented · auto-checkable)
- Exactly one item is --current and it has aria-current="page". *Why:* Position must not be visual only. (Accessible by default · auto-checkable)

**Do not use** (exist in the CSS for docs only):
- `is-hover-preview`: Docs preview that forces the hover look.
- `is-focus-preview`: Docs preview that forces the focus ring.

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The page-size menu has no GDS markup of its own; docs use a .gds-menu positioned by script. *Planned fix:* v3: document the page-size menu as part of this contract, or reuse dropdown.

*Generated from `components/pagination.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:pagination:end -->

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
