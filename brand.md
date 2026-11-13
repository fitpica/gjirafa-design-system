# Gjirafa Design System (GDS) v2.7 — AI Integration Guide

> This document is the single source of truth for any AI tool (Claude, Cursor, Copilot, etc.)
> building UI with GDS. Read the setup, principles and rules, plus the sections for the components you use, BEFORE generating any HTML or CSS.
>
> **Version:** 2.8.0 · **Live docs:** https://docs-phi-black.vercel.app
> Every class and `--gds-*` token named here exists in the compiled CSS of v2.8.0.
> If something you need is not in this file, **do not invent it**. Say it is missing and ask.
>
> **This is the complete reference (about 60k tokens). Don't load all of it into every session.**
> - Claude Code: install the plugin (`/plugin install gds --marketplace fitpica/gjirafa-design-system`). It loads only the components a screen needs and lints your markup.
> - Other agents: start from https://docs-phi-black.vercel.app/llms.txt and fetch only the component pages you need (`/md/components/<id>.md`).
>
> Sections between `<!-- gds:component:… -->` markers are generated from `components/*.json` (the component contracts). Those contracts are the source; this file is their readable form.

---

## GDS Principles

Every rule in this file follows from these three. When a case is not covered, decide by them.

1. **Accessible by default, not by effort.** Every combination GDS allows passes WCAG AA without anyone checking. Use only the text tokens that pass AA, never show status by colour alone (dot + label), and give tables `scope` and `aria-sort`.
2. **Reuse before you create.** If GDS has it, use it. If GDS does not have it, do not invent a local version: say it is missing so it can become a GDS pattern. Custom CSS that duplicates a GDS component is a bug. (For page layout use the GDS page patterns; for layouts GDS still lacks, see Critical Rule 9.)
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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.8.0/docs/gjirafa-ds.css" />

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
@import url('https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.8.0/docs/gjirafa-ds.css');
```

> **Do NOT use `npm install @gjirafa/design-system`** — the NPM package is not published yet (404).
> Always pin the version (`@v2.8.0`), never `@latest` or `@main`.

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
9. **Page layout comes from GDS patterns.** Use `gds-page`, `gds-page-header` and `gds-filter-bar` (see Page patterns). For a layout GDS still lacks, you may write layout CSS with your product prefix (e.g. `cx-…`): only `display`, `flex`/`grid`, `gap`, alignment, width/max-width and padding/margin, with `--gds-*` tokens for every value. Never set colours, borders, typography or shadows, never restyle a `gds-` class, and add `/* GDS gap: <pattern name> */` so it can be replaced when the pattern ships.

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

**Neutral:** 0 `#ffffff` | 20 `#F7F7F8` | 25 `#f1f1f3` | 30 `#ebebed` | 40 `#dedee2` | 50 `#c0c0c7` | 60 `#b1b1b9` | 80 `#9595a0` | 90 `#868693` | 100 `#767685` | 200 `#6c6c7c` | 300 `#58586a` | 400 `#4b4b5f` | 700 `#1e1e36` | 900 `#02021d`

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
| `text-tertiary` / `text-placeholder` / `text-helper` | 5.16 | 4.81 | ✅ Metadata, placeholders, hints, secondary icons (lighter than `text-secondary`) |
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

## Page patterns

Every screen is built from the same frame: `gds-page` (grey background, padding, spacing) → `gds-page-header` (title + main actions) → optional `gds-filter-bar` → content in white surfaces (table, cards). A list screen adds the bulk-action bar, `gds-table` and `gds-pagination-bar--full` inside one `gds-page__section`.

<!-- gds:component:page:start -->
### Page layout and page header

The frame of a product screen: page background, padding and spacing, and the header with the page title and its main actions.

**Use when:**
- Every full screen in a product (lists, forms, settings).
- A screen needs a title and one main action such as "New entry".

**Don't use when:**
- Content inside a modal or side panel → use the modal or side panel header
- A small section inside a page → use a card header or gds-page__section

**Example: List page header**
```html
<main class="gds-page">
  <header class="gds-page-header">
    <div class="gds-page-header__text">
      <h1 class="gds-page-header__title">All Entries</h1>
      <p class="gds-page-header__desc">124 entries</p>
    </div>
    <div class="gds-page-header__actions">
      <button type="button" class="gds-btn gds-btn--secondary gds-btn--md"><span class="gds-btn__label">Import</span></button>
      <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><i data-lucide="plus" class="gds-btn__icon"></i><span class="gds-btn__label">New entry</span></button>
    </div>
  </header>
</main>
```

**Example: Narrow form page**
```html
<main class="gds-page gds-page--narrow">
  <header class="gds-page-header">
    <div class="gds-page-header__text">
      <nav class="gds-page-header__breadcrumb" aria-label="Breadcrumb">Entries / Edit</nav>
      <h1 class="gds-page-header__title">Edit entry</h1>
    </div>
  </header>
  <section class="gds-page__section" aria-label="Entry details"></section>
</main>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-page` | main \| div | yes | top level | The page frame: light grey background, padding, vertical gap between its children. White surfaces (table, cards) sit on it. Use <main> when the page is the whole app; use <div> inside an app shell that already has a <main>. The shell can remove the frame padding with --page-padding: 0 (and --page-padding-mobile: 0). |
| `gds-page-header` | header | no | `gds-page` | Title on the left, actions on the right. Wraps on narrow screens. |
| `gds-page-header__text` | div | yes | `gds-page-header` | Stacks breadcrumb, title and description. |
| `gds-page-header__breadcrumb` | nav | no | `gds-page-header__text` | Optional breadcrumb above the title. Attributes: `aria-label` (Breadcrumb). |
| `gds-page-header__title` | h1 | yes | `gds-page-header__text` | The page title. One <h1> per page. 24px semibold. |
| `gds-page-header__desc` | p | no | `gds-page-header__text` | Optional short description or count, e.g. "124 entries". |
| `gds-page-header__actions` | div | no | `gds-page-header` | Buttons for the page. At most one primary, plus up to two others; put more in a menu. |
| `gds-page__section` | section | no, repeats | `gds-page` | Groups related blocks with a smaller gap, e.g. bulk bar + table + pagination. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-page--narrow` | `gds-page` | width | Centres the page at 640px max. Use for forms and settings. |

**Accessibility:**
- Exactly one <main> per document: gds-page is the <main>, unless an app shell already provides one (then gds-page is a <div> inside it). Exactly one <h1> (the page title).
- Give a breadcrumb <nav> an aria-label.
- If a section has no visible heading, give it aria-label.

**Rules:**
- A page has exactly one gds-page-header__title and it is an <h1>. *Why:* Screen reader users jump to the h1 to know where they are. (Accessible by default · auto-checkable)
- gds-page-header__actions contains at most one gds-btn--primary. *Why:* One clear main action per screen. (Obvious over documented · auto-checkable)
- Use gds-page, gds-page-header and gds-filter-bar for page layout instead of product CSS. *Why:* These were the most common custom CSS in AI tests; they now exist in GDS. (Reuse before you create)
- Forms and settings pages use gds-page--narrow; lists and tables use the full width. *Why:* Long lines of form fields are hard to scan; tables need the width. (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- No docs page yet; only this contract and the AI guide describe it. *Planned fix:* Add a Page patterns page to the docs site.
- gds-page uses min-height: 100%, so the grey background only fills the viewport when html and body have height: 100% (or the app shell gives the page a height). *Planned fix:* Document html, body { height: 100% } in Setup, or use min-height: 100dvh when the page is the whole viewport.
- Inside an app shell that has its own padding, gds-page adds its padding on top. *Planned fix:* Set --page-padding: 0 and --page-padding-mobile: 0 on the shell or on the page. Reported in the first product pilot (Nov 2026).

*Generated from `components/page.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:page:end -->

---

<!-- gds:component:filter-bar:start -->
### Filter bar

A row above a list with a search field and filter dropdowns; active filters show inside each dropdown trigger.

**Use when:**
- Above a table or list that people search and filter.

**Don't use when:**
- A single search field with no filters → use a gds-input on its own
- Filters that need many fields → use a side panel with a form

**Example: Search and two filters**
```html
<div class="gds-filter-bar" role="search" aria-label="Filter entries">
  <div class="gds-input gds-input--md gds-filter-bar__search">
    <div class="gds-input__wrap">
      <i data-lucide="search" class="gds-input__icon"></i>
      <input type="search" class="gds-input__field" placeholder="Search entries" aria-label="Search entries" />
    </div>
  </div>
  <div class="gds-dropdown">
    <button type="button" class="gds-dropdown__trigger" aria-haspopup="listbox" aria-expanded="false">
      <span class="gds-dropdown__value">Status: Published</span>
      <span class="gds-dropdown__arrow"><i data-lucide="chevron-down" width="16" height="16"></i></span>
    </button>
    <div class="gds-dropdown__panel">
      <div class="gds-dropdown__list" role="listbox" aria-label="Status">
        <button type="button" class="gds-dropdown__item gds-dropdown__item--selected" role="option" aria-selected="true"><span class="gds-dropdown__label">Published</span></button>
      </div>
    </div>
  </div>
  <div class="gds-dropdown">
    <button type="button" class="gds-dropdown__trigger" aria-haspopup="listbox" aria-expanded="false">
      <span class="gds-dropdown__placeholder">Content type</span>
      <span class="gds-dropdown__arrow"><i data-lucide="chevron-down" width="16" height="16"></i></span>
    </button>
    <div class="gds-dropdown__panel">
      <div class="gds-dropdown__list" role="listbox" aria-label="Content type">
        <button type="button" class="gds-dropdown__item" role="option" aria-selected="false"><span class="gds-dropdown__label">Article</span></button>
      </div>
    </div>
  </div>
  <button type="button" class="gds-btn gds-btn--ghost gds-btn--md gds-filter-bar__clear"><span class="gds-btn__label">Clear filters</span></button>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-filter-bar` | div | yes | top level | Flex row that wraps on narrow screens. Dropdown triggers inside it match the 40px input height. Attributes: `role` (search), `aria-label` (e.g. "Filter entries"). |
| `gds-filter-bar__search` | div | no | `gds-filter-bar` | Put this class on the gds-input wrapper of the search field: it grows up to 360px. |
| `gds-filter-bar__clear` | button | no | `gds-filter-bar` | "Clear filters" ghost button, pushed to the right. Show it only when a filter is active. Attributes: `type` (button). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|

**States:**
- **filter active**: Show the choice in the trigger value ("Status: Published") and show gds-filter-bar__clear.

**Accessibility:**
- Give the bar role="search" and an aria-label.
- The search input needs an aria-label (no visible label in a filter bar).
- Each dropdown trigger names its filter and current value.

**Rules:**
- The search field uses gds-input gds-input--md together with gds-filter-bar__search. *Why:* The bar aligns controls to the md height. (Obvious over documented · auto-checkable)
- Show an active filter inside its dropdown trigger ("Status: Published"), not as a separate row of badges. *Why:* Design decision (11 Nov 2026): keeps the bar to one row. (Reuse before you create)
- The bar has role="search" and an aria-label. *Why:* Lets screen reader users find the filters. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Outside the filter bar, dropdown triggers are still shorter than md inputs. *Planned fix:* v3: shared control heights for all components.

*Generated from `components/filter-bar.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:filter-bar:end -->

---

## Components — Full API Reference

<!-- gds:component:button:start -->
### Button

Triggers an action: text buttons, icon-only buttons and joined button groups.

**Use when:**
- Running an action on the current page: Save, Publish, Delete, Create entry.
- Opening a dialog, menu or panel.
- An icon-only action in a dense toolbar or table row, when the icon is widely understood (more, close, edit).

**Don't use when:**
- Going to another page or URL → use a link (<a href>); if it must look like a button, put .gds-btn on the <a>
- Switching a setting on or off → use toggle
- Filtering a list by one or more values → use chip (gds-chip--selectable) or filter-badge
- Choosing between views inside one panel → use tabs

**Example: Entry editor header actions**
```html
<button type="button" class="gds-btn gds-btn--secondary gds-btn--md">
  <span class="gds-btn__label">Save draft</span>
</button>
<button type="button" class="gds-btn gds-btn--primary gds-btn--md">
  <span class="gds-btn__icon"><i data-lucide="send"></i></span>
  <span class="gds-btn__label">Publish</span>
</button>
<button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--md" aria-label="More actions">
  <i data-lucide="ellipsis-vertical"></i>
</button>
```

**Example: Loading while publishing**
```html
<button type="button" class="gds-btn gds-btn--primary gds-btn--md gds-btn--loading" aria-busy="true">
  <i data-lucide="loader-circle" class="gds-btn__spinner" aria-hidden="true"></i>
  <span class="gds-btn__label">Publishing</span>
</button>
```

**Example: Schedule navigation group**
```html
<div class="gds-btn-group" role="group" aria-label="Schedule navigation">
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Previous week</span></button>
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Today</span></button>
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Next week</span></button>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-btn-group` | div | no | top level | Joins adjacent .gds-btn elements into one bar with shared borders. Only direct .gds-btn children are joined. Attributes: `role` (group), `aria-label` (What the buttons control, e.g. "Date range"). |
| `gds-btn` | button \| a | yes | top level | Text button. Needs one size and one variant modifier: the base class has no height, padding or colour. Can sit alone or inside .gds-btn-group. Attributes: `type` ("button" unless it submits a form (on <button>)), `href` (Required when the element is an <a>). |
| `gds-btn__spinner` | i \| svg | no | `gds-btn` | Loading spinner: <i data-lucide="loader-circle" class="gds-btn__spinner"></i>. Only with gds-btn--loading. Centred over the hidden label. Attributes: `aria-hidden` (true). |
| `gds-btn__icon` | span | no, repeats | `gds-btn` | Icon slot before or after the label. Wraps one Lucide icon; the size modifier sets the icon size. Decorative: the label carries the meaning. |
| `gds-btn__label` | span | yes | `gds-btn` | The button text. Loading hides only this element, so all text must be inside it. |
| `gds-btn-icon` | button \| a | no | top level | Square icon-only button, used instead of .gds-btn. Contains one Lucide icon directly (no __icon wrapper). Needs one size and one variant modifier. Attributes: `type` ("button" unless it submits a form (on <button>)), `aria-label` (Required: the action, e.g. "More actions"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-btn--primary` | `gds-btn` | variant | Filled brand colour. The main action of a view. |
| `gds-btn--secondary` | `gds-btn` | variant | White with a border. Supporting actions. |
| `gds-btn--ghost` | `gds-btn` | variant | No background or border until hover. Low-emphasis actions in toolbars and cards. |
| `gds-btn--critical` | `gds-btn` | variant | Red fill. Destructive actions (delete, remove, revoke). |
| `gds-btn--positive` | `gds-btn` | variant | Green fill. Confirming a positive outcome (approve, mark as done). |
| `gds-btn--xs` | `gds-btn` | size | 24px high, 12px icon. |
| `gds-btn--sm` | `gds-btn` | size | 28px high, 14px icon. Toolbars, table rows, cards. |
| `gds-btn--md` | `gds-btn` | size | 36px high, 16px icon. Forms, page headers, dialogs. |
| `gds-btn--lg` | `gds-btn` | size | 44px high, 18px icon. |
| `gds-btn--xl` | `gds-btn` | size | 52px high, 20px icon. Landing or onboarding screens only. |
| `gds-btn--pill` | `gds-btn` | style | Fully rounded corners. |
| `gds-btn--full` | `gds-btn` | width | Takes the full width of its container. |
| `gds-btn--loading` | `gds-btn` | state | Hides the label (keeps the width) and shows .gds-btn__spinner. Add aria-busy="true". Does not block clicks on its own. |
| `gds-btn--disabled` | `gds-btn` | state | Disabled look for elements that cannot take the disabled attribute (<a>). On <button>, use the disabled attribute instead. |
| `gds-btn-icon--primary` | `-icon` | variant | Filled brand colour. |
| `gds-btn-icon--secondary` | `-icon` | variant | White with a border. |
| `gds-btn-icon--ghost` | `-icon` | variant | Transparent until hover. The usual choice in toolbars, table rows and dialog headers. |
| `gds-btn-icon--critical` | `-icon` | variant | Red fill. Destructive actions. |
| `gds-btn-icon--positive` | `-icon` | variant | Green fill. |
| `gds-btn-icon--xs` | `-icon` | size | 24px square, 12px icon. |
| `gds-btn-icon--sm` | `-icon` | size | 28px square, 14px icon. |
| `gds-btn-icon--md` | `-icon` | size | 36px square, 16px icon. |
| `gds-btn-icon--lg` | `-icon` | size | 44px square, 18px icon. |
| `gds-btn-icon--xl` | `-icon` | size | 52px square, 20px icon. |
| `gds-btn-icon--circle` | `-icon` | style | Round instead of square. |

**States:**
- **hover**: Native :hover. Skipped when the button is disabled.
- **active**: Native :active: darker fill and a slight press (scale).
- **focus**: Native :focus-visible shows a two-ring focus outline.
- **disabled**: disabled attribute on <button>. On <a>: gds-btn--disabled + aria-disabled="true" + remove href. .gds-btn-icon supports the attribute only.
- **loading**: gds-btn--loading + .gds-btn__spinner + aria-busy="true". Ignore clicks in JS while loading.

**Accessibility:**
- Use <button> for actions and <a href> for navigation, whatever it looks like.
- Every .gds-btn-icon needs an aria-label that names the action.
- Use the native disabled attribute on <button>; the class alone leaves it clickable and focusable.
- While loading, keep the label in the DOM (it stays the accessible name) and set aria-busy="true".
- Give .gds-btn-group role="group" and an aria-label. If the group works as a toggle, set aria-pressed on each button.

**Rules:**
- Every .gds-btn and .gds-btn-icon has exactly one size and one variant modifier. *Why:* The base class has no height, padding or colours, so a bare button renders as an unstyled box. (Obvious over documented · auto-checkable)
- Every .gds-btn-icon has an aria-label (or aria-labelledby). *Why:* An icon alone has no text, so screen readers announce just "button". (Accessible by default · auto-checkable)
- All text inside .gds-btn sits in .gds-btn__label; icons sit in .gds-btn__icon. *Why:* Loading hides only the label element, and the icon size comes from the __icon wrapper. (Obvious over documented · auto-checkable)
- A disabled <button> uses the disabled attribute. gds-btn--disabled is only for <a>, together with aria-disabled="true". *Why:* The class only changes the look; the button would still be focusable and clickable. (Accessible by default · auto-checkable)
- A gds-btn--loading button has aria-busy="true" and contains .gds-btn__spinner. *Why:* Without aria-busy, screen-reader users get no sign that something is happening; without the spinner the button just looks empty. (Accessible by default · auto-checkable)
- A <button class="gds-btn"> or <button class="gds-btn-icon"> inside a form has type="button" unless it submits the form. *Why:* A button in a form submits it by default, which surprises people when the button only opens a menu. (Obvious over documented · auto-checkable)
- At most one gds-btn--primary per view or dialog. *Why:* One clear main action; two primaries compete and slow the decision. (Obvious over documented)
- Use gds-btn--critical only for actions that delete or remove something, and gds-btn--positive only to confirm a good outcome. *Why:* Red and green carry meaning; using them for emphasis teaches people to ignore them. (Obvious over documented)
- Navigation uses <a href class="gds-btn ...">; actions use <button>. *Why:* Links and buttons behave differently for keyboards, new tabs and screen readers. (Accessible by default)
- A .gds-btn-group contains only .gds-btn elements of one size. *Why:* The group only joins direct .gds-btn children and sets corner radius per size; icon buttons or mixed sizes break the joined edges. (Reuse before you create · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Docs use gds-btn--icon-left, gds-btn--icon-right and gds-btn--icon-only, and the SCSS header lists --icon-left/--icon-right, but none of these classes exist in the CSS. *Planned fix:* Remove them from docs and the header comment. The gap already spaces icon and label; icon-only buttons use .gds-btn-icon.
- A bare .gds-btn or .gds-btn-icon has no size and no colours. brand.md says md is the default and shows buttons without a size class, which is wrong. *Planned fix:* v3: make md + secondary the default. Until then, fix brand.md.
- gds-btn--loading does not block clicks or hover, and a .gds-btn__icon stays visible next to the spinner. *Planned fix:* Add pointer-events: none and hide .gds-btn__icon while loading.
- On secondary and ghost, the loading colour (neutral-60) makes the spinner about 2.1:1 against white, below the 3:1 needed for non-text graphics. *Planned fix:* Use --gds-color-text-secondary for the spinner on light buttons.
- .gds-btn-icon has no disabled class and its variant hovers only check :disabled, so an <a class="gds-btn-icon"> cannot look disabled. *Planned fix:* Add [aria-disabled="true"] styling shared by both button types.
- .gds-btn-group only styles direct .gds-btn children; a .gds-btn-icon inside keeps its own radius and doubles borders. *Planned fix:* Extend the group selectors to .gds-btn-icon.
- There is no selected style for a button inside .gds-btn-group, yet docs show Day/Week/Month groups that read as a toggle. *Planned fix:* Add a pressed style driven by aria-pressed="true", or point toggles to tabs.
- Docs token table lists --btn-critical-bg as red-600; the SCSS uses red-700. *Planned fix:* Regenerate the docs token table from the SCSS.

*Generated from `components/button.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:button:end -->

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
- gds-input--md renders 42px, not 40px: the wrap sets height 40px in the content-box model and adds a 1px border top and bottom (same for sm 34px and lg 50px). The same content-box model makes the wrap (width 100% + padding + border) about 22px wider than its parent, so it overlaps the next control in a row. *Planned fix:* v3: box-sizing: border-box on .gds-input__wrap so sizes are exactly 32/40/48 px; update the filter-bar control height with it.

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

<!-- gds:component:radio:start -->
### Radio

Lets people pick exactly one option from a short, visible list.

**Use when:**
- Exactly one choice from 2 to about 6 options that people should see side by side (e.g. Visibility: Public / Unlisted / Private).
- The options need a short explanation each (use __helper).

**Don't use when:**
- Any number of options can be chosen → use checkbox
- A single on/off setting → use toggle (immediate) or checkbox (submitted later)
- More than about 6 options, or the list is long → use dropdown
- Switching between views of the same content → use tabs

**Example: Article visibility**
```html
<fieldset>
  <legend>Visibility</legend>
  <label class="gds-radio gds-radio--md">
    <input type="radio" class="gds-radio__input" name="visibility" value="public" checked />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Public<span class="gds-radio__helper">Anyone can find and read it</span></span>
  </label>
  <label class="gds-radio gds-radio--md">
    <input type="radio" class="gds-radio__input" name="visibility" value="unlisted" />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Unlisted<span class="gds-radio__helper">Only people with the link</span></span>
  </label>
  <label class="gds-radio gds-radio--md">
    <input type="radio" class="gds-radio__input" name="visibility" value="private" />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Private<span class="gds-radio__helper">Only editors of this site</span></span>
  </label>
</fieldset>
```

**Example: Compact group with a disabled option**
```html
<div role="radiogroup" aria-labelledby="img-size-label">
  <span id="img-size-label">Image size</span>
  <label class="gds-radio gds-radio--sm">
    <input type="radio" class="gds-radio__input" name="img-size" value="original" checked />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Original</span>
  </label>
  <label class="gds-radio gds-radio--sm">
    <input type="radio" class="gds-radio__input" name="img-size" value="wide" />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Wide</span>
  </label>
  <label class="gds-radio gds-radio--sm gds-radio--disabled">
    <input type="radio" class="gds-radio__input" name="img-size" value="full" disabled />
    <span class="gds-radio__control"><span class="gds-radio__dot"></span></span>
    <span class="gds-radio__label">Full bleed (needs a 2000px image)</span>
  </label>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-radio` | label | yes, repeats | top level | One option. A <label>, so clicking the text selects it. Put all options of a group in a <fieldset> with a <legend> (or role="radiogroup" with aria-labelledby); GDS has no class for the group. |
| `gds-radio__input` | input | yes | `gds-radio` | Native radio, visually hidden but focusable. Its :checked state drives the visual. Must come before the control (CSS uses ~). Attributes: `type` (radio), `name` (Same value for every option in the group), `value` (The option's value). |
| `gds-radio__control` | span | yes | `gds-radio` | The visible circle. |
| `gds-radio__dot` | span | yes | `gds-radio__control` | Inner dot, shown when checked. Without it the checked radio is a filled circle with no dot. |
| `gds-radio__label` | span | no | `gds-radio` | Visible label text. Stacks its children in a column, so the helper goes inside it. |
| `gds-radio__helper` | span | no | `gds-radio__label` | Helper line under the label text (12px, text-secondary). Put it inside __label. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-radio--sm` | `gds-radio` | size | 16px circle, 12px label. Use in dense panels and tables. |
| `gds-radio--md` | `gds-radio` | size (default) | 20px circle, 14px label. Use in forms. |
| `gds-radio--lg` | `gds-radio` | size | 24px circle, 16px label. |
| `gds-radio--checked` | `gds-radio` | state | Forces the checked look. Prefer the native checked attribute, which works without this class. |
| `gds-radio--disabled` | `gds-radio` | state | Disabled look. Also set the disabled attribute on the input. |

**States:**
- **checked**: checked attribute on one .gds-radio__input of the group (CSS reads :checked).
- **disabled**: gds-radio--disabled + disabled attribute on the input (or on the <fieldset> for the whole group).
- **focus**: Native :focus-visible on the input shows a ring on the control.
- **hover**: Native :hover on the wrapper darkens the circle border.

**Accessibility:**
- Keep the native input: browsers then give arrow-key movement inside the group for free.
- All options in a group share one name, so only one can be checked.
- Wrap the group in <fieldset> + <legend> (or role="radiogroup" + aria-labelledby) so the question is read with each option.
- Helper text inside __label becomes part of the option's name; keep it short.

**Rules:**
- Every .gds-radio contains <input type="radio" class="gds-radio__input"> before .gds-radio__control. *Why:* The visual state comes from the input through the ~ selector; without it the circle never changes. (Accessible by default · auto-checkable)
- Every radio input has a name, and the options of one group share it. *Why:* Without a shared name each radio acts alone: several can be checked and arrow keys do not move between them. (Accessible by default · auto-checkable)
- A group of .gds-radio sits in a <fieldset> with a <legend>, or in an element with role="radiogroup" and an accessible name. *Why:* Screen readers read the question ("Visibility") with each option. (Accessible by default · auto-checkable)
- Exactly one option in a group is checked by default, unless having no answer is meaningful. *Why:* A radio group cannot be cleared once picked; start from a sensible default. (Obvious over documented)
- A group has at least 2 options; for a single yes/no use a checkbox or toggle. *Why:* A single radio cannot be turned off. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Disabled + checked looks different depending on how checked is set: with the native :checked the circle stays primary blue and still changes colour on hover; with --checked alone it turns grey. *Planned fix:* v3: drive the look only from the native state and add .gds-radio__input:disabled styles that win over :checked.
- Disabled is class-only; a native disabled input (or disabled fieldset) without the class still looks enabled. *Planned fix:* v3: style from .gds-radio__input:disabled ~ .gds-radio__control and the label.
- __helper sits inside __label here (the label is a flex column), but the checkbox contract places __helper next to __label. The CSS is the same for both. *Planned fix:* Pick one structure (inside __label) and align the checkbox contract and docs.
- There is no class for the group (spacing, legend style). Each product builds its own wrapper. *Planned fix:* Add .gds-radio-group (and reuse it for checkbox groups) with gap and legend styles.
- __helper keeps text-secondary when the option is disabled, while the label turns text-disabled. *Planned fix:* Dim the helper in .gds-radio--disabled too.

*Generated from `components/radio.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:radio:end -->

---

<!-- gds:component:toggle:start -->
### Toggle

An on/off switch for a setting that takes effect immediately.

**Use when:**
- A setting that applies the moment it is flipped, with no Save button (e.g. Email notifications, Auto-publish).
- Turning a feature or a single item on and off in a list (e.g. enable a plugin, show a section on the homepage).

**Don't use when:**
- A choice that is submitted later with a form button → use checkbox
- Picking several options from a list → use checkbox
- Picking one of two or more named options (e.g. Public / Private) → use radio or tabs--filled
- An action that runs once (e.g. Publish now) → use button

**Example: Setting with label**
```html
<label class="gds-toggle gds-toggle--md">
  <input type="checkbox" role="switch" class="gds-toggle__input" checked />
  <span class="gds-toggle__track"><span class="gds-toggle__knob"></span></span>
  <span class="gds-toggle__label">Email me when an article is published</span>
</label>
```

**Example: In a list row (no visible label)**
```html
<label class="gds-toggle gds-toggle--sm">
  <input type="checkbox" role="switch" class="gds-toggle__input" aria-label="Show Breaking news section on homepage" />
  <span class="gds-toggle__track"><span class="gds-toggle__knob"></span></span>
</label>
```

**Example: Disabled**
```html
<label class="gds-toggle gds-toggle--md gds-toggle--disabled">
  <input type="checkbox" role="switch" class="gds-toggle__input" disabled />
  <span class="gds-toggle__track"><span class="gds-toggle__knob"></span></span>
  <span class="gds-toggle__label">Auto-translate (Pro plan)</span>
</label>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-toggle` | label | yes | top level | Wrapper. A <label>, so clicking the text flips the switch. |
| `gds-toggle__input` | input | yes | `gds-toggle` | Native checkbox with the switch role, visually hidden but focusable. Its :checked state drives the visual. Must come before the track (CSS uses ~). Attributes: `type` (checkbox), `role` (switch), `aria-label` (Required when there is no visible label), `aria-describedby` (Optional: id of help text outside the toggle). |
| `gds-toggle__track` | span | yes | `gds-toggle` | The pill-shaped track. Grey when off, primary colour when on. |
| `gds-toggle__knob` | span | yes | `gds-toggle__track` | The round knob. Slides right when on. |
| `gds-toggle__label` | span | no | `gds-toggle` | Visible label text, after the track. Name the setting, not the state ("Email notifications", not "On"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-toggle--sm` | `gds-toggle` | size | 32×16 track, 12px label. Use in dense lists and table rows. |
| `gds-toggle--md` | `gds-toggle` | size (default) | 40×20 track, 14px label. Use in forms and settings. |
| `gds-toggle--lg` | `gds-toggle` | size | 48×24 track, 16px label. |
| `gds-toggle--on` | `gds-toggle` | state | Forces the on look. Prefer the native checked attribute, which works without this class. |
| `gds-toggle--disabled` | `gds-toggle` | state | Disabled look. Also set the disabled attribute on the input. |

**States:**
- **on**: checked attribute on .gds-toggle__input (CSS reads :checked). role="switch" makes screen readers say on/off.
- **disabled**: gds-toggle--disabled + disabled attribute on the input.
- **focus**: Native :focus-visible on the input shows a ring around the track.
- **hover**: Native :hover on the wrapper darkens the track.

**Accessibility:**
- Use the native checkbox with role="switch": keyboard (Space) and screen readers work, and the checked state is announced as on/off. Do not add aria-checked; the native checked state is enough.
- Without visible text, give the input an aria-label that names the setting.
- The change applies immediately: if it can fail, tell the user (toast) and flip it back.
- For disabled, set the disabled attribute, not only the class.

**Rules:**
- Every .gds-toggle contains <input type="checkbox" role="switch" class="gds-toggle__input"> before .gds-toggle__track. *Why:* The visual state comes from the input through the ~ selector, and role="switch" makes it announced as on/off instead of checked. (Accessible by default · auto-checkable)
- A toggle without .gds-toggle__label has an aria-label on the input. *Why:* Otherwise it is announced as an unnamed switch. (Accessible by default · auto-checkable)
- Use a toggle only when flipping it applies the change right away; inside a form that is submitted with a button, use a checkbox. *Why:* A switch looks like a light switch: people expect the effect now. Mixing the two makes people unsure whether they must save. (Obvious over documented)
- The label names the setting and does not change with the state (not "On"/"Off"). *Why:* The switch already shows the state; a changing label makes it unclear what the switch controls. (Obvious over documented)
- gds-toggle--disabled always comes with the disabled attribute on the input. *Why:* The class only changes the look; without the attribute the switch still works from the keyboard. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The docs say to use role="switch", but none of the docs markup has it; they also advise aria-checked, which is redundant on a native checkbox. *Planned fix:* Add role="switch" to every docs example and drop the aria-checked advice.
- On can be shown two ways (native checked or gds-toggle--on), and they behave differently when disabled: with :checked the track stays primary (only dimmed) and still changes colour on hover; with --on alone it turns grey. *Planned fix:* v3: drive the look only from the native state, add .gds-toggle__input:disabled styles that win over :checked, and keep --on for docs previews.
- Disabled is class-only; a native disabled input without the class still looks enabled. *Planned fix:* v3: style from .gds-toggle__input:disabled ~ .gds-toggle__track.
- Only a native checkbox is supported. A <button aria-pressed> has no styles (the focus ring and on state need the input). *Planned fix:* Keep the checkbox pattern; if a button version is needed, add [aria-checked="true"] styles on the wrapper.
- The knob slide uses translateX, which goes the wrong way in right-to-left layouts. *Planned fix:* Use a logical property or flip the transform under [dir="rtl"].

*Generated from `components/toggle.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:toggle:end -->

---

<!-- gds:component:chip:start -->
### Chip

A compact token for a tag, a selected value or a toggleable filter, optionally removable, alone, in a group or inside a tag field.

**Use when:**
- Showing tags, categories or people attached to an entry, with an optional remove button.
- Quick filters above a list that people switch on and off (selectable chips).
- Entering several values in one field: tags, recipients, keywords (chip input).

**Don't use when:**
- A read-only status such as Published or Draft → use badge
- A count on its own → use pill
- Opening a filter panel with a count of active filters → use filter-badge
- A main action → use button

**Example: Tags field on an article**
```html
<label for="article-tags">Tags</label>
<div class="gds-chip-input">
  <span class="gds-chip gds-chip--sm">
    <span class="gds-chip__label">Politics</span>
    <button type="button" class="gds-chip__close" aria-label="Remove Politics"><i data-lucide="x"></i></button>
  </span>
  <span class="gds-chip gds-chip--sm">
    <span class="gds-chip__label">Elections 2027</span>
    <button type="button" class="gds-chip__close" aria-label="Remove Elections 2027"><i data-lucide="x"></i></button>
  </span>
  <input id="article-tags" type="text" class="gds-chip-input__field" placeholder="Add tag" />
</div>
```

**Example: Quick filters above the entries list**
```html
<div class="gds-chip-group gds-chip-group--rounded" role="group" aria-label="Filter by content type">
  <button type="button" class="gds-chip gds-chip--selectable gds-chip--rounded gds-chip--active" aria-pressed="true">
    <span class="gds-chip__icon"><i data-lucide="check"></i></span>
    <span class="gds-chip__label">Articles</span>
  </button>
  <button type="button" class="gds-chip gds-chip--selectable gds-chip--rounded" aria-pressed="false">
    <span class="gds-chip__label">Videos</span>
  </button>
  <button type="button" class="gds-chip gds-chip--selectable gds-chip--rounded" aria-pressed="false">
    <span class="gds-chip__label">Galleries</span>
  </button>
  <button type="button" class="gds-chip-group__counter">+4 more</button>
</div>
```

**Example: Assigned reviewer**
```html
<span class="gds-chip gds-chip--rounded gds-chip--neutral">
  <span class="gds-avatar"><img class="gds-avatar__img" src="/avatars/lirie-gashi.jpg" alt="" /></span>
  <span class="gds-chip__label">Lirie Gashi</span>
  <button type="button" class="gds-chip__close" aria-label="Remove Lirie Gashi"><i data-lucide="x"></i></button>
</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-chip-group` | div | no | top level | Wrapping row of chips with even spacing. Can end with a +N counter. |
| `gds-chip-input` | div | no | top level | Field that looks like an input and holds chips followed by a text field. Clicking it should focus the field (JS). |
| `gds-chip` | span \| button | yes | top level | The chip. A <span> for static or removable chips; a <button> only with gds-chip--selectable. Medium size by default. Can hold a .gds-avatar (sized automatically) before the label. Attributes: `type` ("button" (selectable chips only)), `aria-pressed` ("true" / "false" on selectable chips, matching gds-chip--active). |
| `gds-chip__icon` | span | no | `gds-chip` | Leading Lucide icon (e.g. tag, check). Decorative. |
| `gds-chip__label` | span | yes | `gds-chip` | The text. Truncates with an ellipsis. |
| `gds-chip__close` | button | no | `gds-chip` | Remove button after the label: <i data-lucide="x"></i>. Only on <span> chips, never inside a <button> chip. Attributes: `type` (button), `aria-label` (Required: "Remove <label>", e.g. "Remove Politics"). |
| `gds-chip-group__counter` | button | no | `gds-chip-group` | "+N more" at the end of a group. A button that reveals the hidden chips. Attributes: `type` (button). |
| `gds-chip-input__field` | input | yes | `gds-chip-input` | Borderless text field after the chips. Attributes: `type` (text), `aria-label` (Required unless a <label for> points at it, e.g. "Add tag"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-chip--sm` | `gds-chip` | size | Small. Use inside .gds-chip-input and dense table cells. |
| `gds-chip--lg` | `gds-chip` | size | Large. Medium is the base size (there is no --md class). |
| `gds-chip--neutral` | `gds-chip` | variant | Gray instead of the default blue. |
| `gds-chip--success` | `gds-chip` | variant | Green. |
| `gds-chip--warning` | `gds-chip` | variant | Orange. |
| `gds-chip--error` | `gds-chip` | variant | Red. |
| `gds-chip--rounded` | `gds-chip` | style | Fully rounded (pill shape) instead of small corners. |
| `gds-chip--outline` | `gds-chip` | style | Border and transparent background. Works with the colour variants. |
| `gds-chip--selectable` | `gds-chip` | style | Toggleable filter chip: gray with a border, pointer cursor and focus ring. Put it on a <button>. |
| `gds-chip--active` | `gds-chip` | state | Selected (brand fill, white text). Only works together with gds-chip--selectable. Set aria-pressed="true" too. Requires `gds-chip--selectable`. |
| `gds-chip--disabled` | `gds-chip` | state | Faded and ignores the mouse. Also set disabled on the button(s) inside, or on the chip if it is a button. |
| `gds-chip-group--rounded` | `-group` | style | Makes the +N counter fully rounded. Add it when the chips use gds-chip--rounded. |

**States:**
- **hover**: Native :hover darkens the background (on every chip, see knownIssues).
- **focus**: Selectable chips show a focus ring on :focus-visible. The close button uses the browser default.
- **selected**: gds-chip--selectable + gds-chip--active + aria-pressed="true".
- **disabled**: gds-chip--disabled + disabled attribute on the chip button or the close button.
- **field focus**: Native :focus-within on .gds-chip-input changes its border colour.

**Accessibility:**
- The close button is a real <button type="button"> with aria-label "Remove <label>"; "Remove" alone is ambiguous in a list of chips.
- Selectable chips are <button> with aria-pressed reflecting the selected state.
- Never put a close button inside a <button> chip or other button: nested interactive elements break keyboard and screen readers.
- The chip input field needs an accessible name, and the container should move focus to the field when clicked.
- After removing a chip, move focus to the next chip's close button or to the field, so keyboard users are not lost.

**Rules:**
- Every .gds-chip__close is a <button type="button"> with an aria-label that names the chip. *Why:* An icon-only x is announced as "button"; with several chips people cannot tell which one it removes. (Accessible by default · auto-checkable)
- A gds-chip--selectable is a <button> with aria-pressed, "true" exactly when gds-chip--active is present. *Why:* The selected state must not be visual only. (Accessible by default · auto-checkable)
- A chip without gds-chip--selectable is a <span>, not a <button> or <a>. Removing happens on .gds-chip__close. *Why:* Only selectable chips have focus styles; a clickable static chip has no visible focus. (Accessible by default · auto-checkable)
- A .gds-chip__close is never inside a <button> (a selectable chip, a dropdown trigger or any other). *Why:* Buttons inside buttons are invalid HTML and cannot be reached reliably by keyboard. (Accessible by default · auto-checkable)
- Every .gds-chip-input__field has an aria-label or a <label for>. *Why:* A placeholder is not a label and disappears once people type. (Accessible by default · auto-checkable)
- With gds-chip--disabled, buttons inside the chip (or the chip itself, if it is a button) have the disabled attribute. *Why:* The class only blocks the mouse; keyboard users could still remove or toggle it. (Accessible by default · auto-checkable)
- Chips inside .gds-chip-input use gds-chip--sm. *Why:* Medium chips make the field taller than a regular input. (Reuse before you create · auto-checkable)
- Use the default blue for user tags and selected values; use success, warning and error only when the value itself has that meaning. *Why:* Colour suggests a status; random colours make tags look like warnings. (Obvious over documented)
- When the chips in a .gds-chip-group use gds-chip--rounded, the group has gds-chip-group--rounded. *Why:* Otherwise the +N counter has square corners next to round chips. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The SCSS header lists gds-chip--md and gds-chip--avatar, which do not exist. Medium is the base size and avatar chips are a plain .gds-avatar inside .gds-chip. *Planned fix:* Update the header comment.
- Every chip gets a hover background, including static <span> chips, so read-only tags look clickable. *Planned fix:* Apply hover only to selectable chips and to the close button.
- gds-chip--active does nothing without gds-chip--selectable. *Planned fix:* v3: drive the selected look from aria-pressed="true" on selectable chips and drop --active.
- gds-chip--disabled uses pointer-events: none only; the close button stays focusable and works by keyboard. *Planned fix:* Require the disabled attribute and style the chip from :disabled / :has(:disabled).
- The rule .gds-chip--rounded .gds-chip-group__counter targets a counter inside a chip, which never happens. Docs also omit gds-chip-group--rounded, so the docs counter is square next to rounded chips. *Planned fix:* Remove the dead selector and fix the docs example.
- The close button is 12–16px with a 6–10px icon, below the 24px minimum target size (WCAG 2.2, 2.5.8). *Planned fix:* Keep the visual size but add an invisible 24px hit area (padding or ::before).
- .gds-chip-input shows focus only as a border colour change and the field removes its outline; other inputs show a focus ring. *Planned fix:* Add the input focus ring on :focus-within.
- In the docs dropdown example, chips inside the <button> trigger use <span role="button"> close controls, which nests interactive elements. *Planned fix:* Move the tags out of the trigger, or make the chips non-removable there.
- The selectable focus ring and the chip input borrow input tokens (--input-focus-ring, --input-border) with fallbacks instead of chip tokens. *Planned fix:* Add chip focus tokens, or a shared focus token used by all components.

*Generated from `components/chip.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:chip:end -->

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

<!-- gds:component:pill:start -->
### Pill (number count)

A small circle with a number: unread counts, items in a tab, or the number of a step.

**Use when:**
- Showing how many items are waiting: unread notifications, comments to review, failed uploads.
- A count next to a tab or menu label (Drafts 4).
- Numbering the steps of a short flow.

**Don't use when:**
- Words, statuses or labels (Published, On track) → use badge
- A count inside a badge or filter → use badge (gds-badge__count) or filter-badge
- A percentage change → use pct-badge
- Presence without a number → use status-dot

**Example: Unread notifications on the header bell**
```html
<button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--md" aria-label="Notifications, 3 unread">
  <i data-lucide="bell"></i>
</button>
<span class="gds-pill gds-pill--sm gds-pill--dark gds-pill--critical" aria-hidden="true">3</span>
```

**Example: Count next to a list label**
```html
<span>Waiting for review</span>
<span class="gds-pill gds-pill--md gds-pill--warning">12</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-pill` | span | yes | top level | The circle. Its text is the number (one or two characters). Fixed width per size: longer text is clipped. Attributes: `aria-hidden` ("true" when nearby text already says the count; otherwise add visually hidden context, e.g. "3 unread notifications"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-pill--sm` | `gds-pill` | size | 16px. Next to icons (notification bell) and small labels. |
| `gds-pill--md` | `gds-pill` | size (default) | 20px. Tabs and menu items. Same as the base size. |
| `gds-pill--lg` | `gds-pill` | size | 24px. Step numbers. |
| `gds-pill--neutral` | `gds-pill` | variant (default) | Gray. Passive counts. Same as the base colour. |
| `gds-pill--critical` | `gds-pill` | variant | Red. Counts that need action: errors, failed items, urgent notifications. |
| `gds-pill--positive` | `gds-pill` | variant | Green. Completed steps or successful items. |
| `gds-pill--warning` | `gds-pill` | variant | Orange. Counts that need attention soon (items expiring, pending review). |
| `gds-pill--purple` | `gds-pill` | variant | Purple. Category counts with no status meaning. |
| `gds-pill--blank` | `gds-pill` | variant | No background, gray number. Upcoming steps. |
| `gds-pill--dark` | `gds-pill` | style | Solid fill with white text instead of the light tint. Combine with a tone (alone it is dark gray). Do not combine with --blank: dark overrides it. |

**Accessibility:**
- A number alone means nothing to a screen reader: either the visible label next to it says what is counted, or add visually hidden text such as "3 unread notifications".
- When the count changes live (new notifications), announce the change in a polite live region elsewhere, not on every pill.
- Do not show meaning by colour alone: the label or the step text must say it too.
- Light tones meet text contrast except warning (just under 4.5:1); dark tones do not (see knownIssues).

**Rules:**
- A .gds-pill contains a number of one or two characters (e.g. 3, 12, 9+). Never words. *Why:* The width is fixed, so longer text is cut off; words belong in a badge. (Reuse before you create · auto-checkable)
- Every pill sits next to text that says what is counted, or contains visually hidden text that does. *Why:* "3" alone does not tell anyone what there are three of. (Accessible by default)
- A .gds-pill is never a <button> or <a>; make the parent tab, menu item or button clickable instead. *Why:* Pills have no hover or focus styles, and a 16–24px target is too small. (Accessible by default · auto-checkable)
- A pill has at most one tone class; gds-pill--dark is not combined with gds-pill--blank. *Why:* Two tones give an undefined colour, and dark silently overrides blank. (Obvious over documented · auto-checkable)
- Use gds-pill--dark for counts that ask for action (unread, errors); use the light style for passive totals. *Why:* The solid fill pulls the eye; keep it for things people should act on. (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Width is fixed per size and overflow is hidden, so three or more characters (100, 99+) are clipped. *Planned fix:* Use min-width plus horizontal padding instead of a fixed width.
- White text on the dark tones is below 4.5:1: warning about 2.5:1, purple and critical about 3.5:1, positive about 4:1. *Planned fix:* Use the 700 shades for dark backgrounds, or dark text on warning.
- Light warning (orange-700 on orange-50) is about 4.35:1, just under 4.5:1 for small text. *Planned fix:* Use orange-900 text, as the warning chip does.
- gds-pill--dark and gds-pill--blank have the same specificity and dark comes later, so blank + dark renders as dark gray. *Planned fix:* Scope --dark rules to exclude --blank, or document the pair as invalid (rule pill-one-tone).
- The name collides with gds-btn--pill and "pill shape" chips, which mean rounded corners, while this component is a number count. brand.md even shows text like "On Track" in a pill, which gets clipped. *Planned fix:* v3: rename to gds-count. Now: fix the brand.md example.

*Generated from `components/pill.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:pill:end -->

---

<!-- gds:component:status-dot:start -->
### Status dot

A small coloured dot that shows someone's presence (online, away, busy, offline), always next to text or with a label.

**Use when:**
- Showing whether a person is online, away, busy or offline in a list of users or collaborators.
- Live presence of editors on an entry (who is editing now).

**Don't use when:**
- The status of content (Published, Draft, Scheduled) → use badge with .gds-badge__dot
- Online status on a photo avatar → use avatar (.gds-avatar__status) for online; see knownIssues for other states
- A count → use pill

**Example: Editors currently on an entry**
```html
<span class="gds-status-dot gds-status-dot--online" aria-hidden="true"></span>
<span>Arta Berisha · Editing now</span>
<span class="gds-status-dot gds-status-dot--away" aria-hidden="true"></span>
<span>Dren Hoxha · Away</span>
```

**Example: Dot without visible text**
```html
<span class="gds-status-dot gds-status-dot--busy gds-status-dot--lg gds-status-dot--ring" role="img" aria-label="Busy"></span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-status-dot` | span | yes | top level | The dot. Empty element; 8px gray (offline) by default. Place it before a text label. Attributes: `aria-hidden` ("true" when the status is written in text next to it), `role` ("img" when there is no text next to it), `aria-label` (With role="img": the status, e.g. "Away"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-status-dot--sm` | `gds-status-dot` | size | 6px. Dense lists and small avatars. |
| `gds-status-dot--md` | `gds-status-dot` | size (default) | 8px. Same as the base size. |
| `gds-status-dot--lg` | `gds-status-dot` | size | 10px. |
| `gds-status-dot--xl` | `gds-status-dot` | size | 12px. Large avatars and profile headers. |
| `gds-status-dot--online` | `gds-status-dot` | variant | Green. Active now. |
| `gds-status-dot--offline` | `gds-status-dot` | variant (default) | Gray. Not active. Same as the base colour. |
| `gds-status-dot--busy` | `gds-status-dot` | variant | Red. Do not disturb. |
| `gds-status-dot--away` | `gds-status-dot` | variant | Orange. Idle or away. |
| `gds-status-dot--info` | `gds-status-dot` | variant | Blue. Not a presence state; use only for a custom state you name in text. |
| `gds-status-dot--purple` | `gds-status-dot` | variant | Purple. Not a presence state; use only for a custom state you name in text. |
| `gds-status-dot--ring` | `gds-status-dot` | style | Adds a white ring (outside the dot) so it stays visible on photos and coloured backgrounds. |

**Accessibility:**
- A dot is colour only. Write the status in text next to it (and hide the dot with aria-hidden="true"), or give it role="img" and aria-label.
- aria-label on a plain <span> is ignored by most screen readers; it needs role="img".
- Offline and away dots are below 3:1 against white (see knownIssues), so text next to them matters even more.

**Rules:**
- Every .gds-status-dot either has aria-hidden="true" with the status written next to it, or has role="img" and an aria-label. *Why:* Colour alone does not reach colour-blind or screen-reader users. (Accessible by default · auto-checkable)
- A status dot has exactly one state class, even for offline. *Why:* Writing the state makes the markup readable and avoids two colours fighting. (Obvious over documented · auto-checkable)
- Use status dots for people's presence. For content or process status use a badge with a dot. *Why:* Badges carry a label and the agreed content-status colours; dots do not. (Reuse before you create)
- Add gds-status-dot--ring when the dot sits on a photo, avatar or coloured surface. *Why:* Without the ring the dot blends into the image. (Obvious over documented)
- A status dot is never a <button> or <a> and never the only content of one. *Why:* At 6–12px it is far too small to hit and has no focus style. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Offline (neutral-80) is about 3:1 and away (orange-500) about 2.5:1 against white, below the 3:1 needed for meaningful graphics. *Planned fix:* Darken the offline and away tokens, or always require text (rule status-dot-labelled).
- info and purple are not presence states, so the set mixes presence and decoration. *Planned fix:* v3: keep online/away/busy/offline; move other colours to badge dots.
- Avatars have their own .gds-avatar__status that is always green; a status-dot cannot be placed in the avatar corner without custom CSS. *Planned fix:* Allow .gds-status-dot--ring inside .gds-avatar in the status position and deprecate __status.
- brand.md calls away "yellow"; the token is orange-500. *Planned fix:* Update brand.md.

*Generated from `components/status-dot.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:status-dot:end -->

---

<!-- gds:component:pct-badge:start -->
### Percentage badge

A pill that shows how much a metric changed, with an arrow for the direction and a colour for good or bad.

**Use when:**
- Next to a metric on a dashboard or stat card to show change against a previous period (e.g. Page views 1.2M, +12.5%).
- In a table column that compares periods (e.g. traffic change per article).

**Don't use when:**
- A status or category (Published, Draft, Sports) → use badge
- A plain count with no comparison → use badge with __count, or plain text
- Something people can click or remove → use chip

**Example: Increase that is good (page views)**
```html
<span class="gds-pct-badge gds-pct-badge--positive">
  <i data-lucide="arrow-up" class="gds-pct-badge__icon" aria-hidden="true"></i>
  <span class="gds-pct-badge__value"><span class="gds-sr-only">Up </span>12.5%</span>
</span>
```

**Example: Increase that is bad (bounce rate)**
```html
<span class="gds-pct-badge gds-pct-badge--critical">
  <i data-lucide="arrow-up" class="gds-pct-badge__icon" aria-hidden="true"></i>
  <span class="gds-pct-badge__value"><span class="gds-sr-only">Up </span>4.2%</span>
</span>
```

**Example: No change**
```html
<span class="gds-pct-badge gds-pct-badge--neutral">
  <span class="gds-pct-badge__value">0%</span>
</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-pct-badge` | span | yes | top level | Wrapper pill. Neutral grey unless a tone modifier is set. |
| `gds-pct-badge__icon` | i | no | `gds-pct-badge` | Direction arrow: Lucide arrow-up (increase) or arrow-down (decrease). Decorative. Attributes: `data-lucide` ("arrow-up" or "arrow-down"), `aria-hidden` (true). |
| `gds-pct-badge__value` | span | yes | `gds-pct-badge` | The change, e.g. "12.5%". Add the direction as hidden text for screen readers (gds-sr-only). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-pct-badge--positive` | `gds-pct-badge` | variant | Green. The change is good. |
| `gds-pct-badge--warning` | `gds-pct-badge` | variant | Orange. The change needs watching. |
| `gds-pct-badge--critical` | `gds-pct-badge` | variant | Red. The change is bad. |
| `gds-pct-badge--neutral` | `gds-pct-badge` | variant (default) | Grey. No change, or the change has no good/bad meaning. Same as the bare class. |

**Accessibility:**
- The arrow and colour are visual only. Put the direction in text: <span class="gds-sr-only">increase of</span> before the value, or write the sign (+12.5% / −3.1%).
- Hide the arrow icon with aria-hidden="true".
- Say what the change compares to near the badge (e.g. "vs last week").

**Rules:**
- The direction is in text (sr-only text or a +/− sign), not only in the arrow. *Why:* Screen readers would read "12.5%" with no idea whether it went up or down. (Accessible by default · auto-checkable)
- Pick the tone by whether the change is good or bad, not by the arrow: bounce rate up is critical, page views up is positive. *Why:* Red and green carry meaning; tying them to the arrow gives wrong signals for metrics where lower is better. (Obvious over documented)
- arrow-up only with a positive change and arrow-down only with a negative one; a 0% change uses no arrow (or minus) and --neutral. *Why:* An arrow that disagrees with the number is misleading. (Obvious over documented)
- A pct-badge has at most one tone modifier. *Why:* Two tones produce an undefined colour. (Obvious over documented · auto-checkable)
- Use pct-badge only for numeric change; statuses and categories use gds-badge. *Why:* One meaning per component keeps dashboards readable. (Reuse before you create · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The SCSS header lists --up and --down direction classes that do not exist; direction is set only by the icon. *Planned fix:* Remove them from the comment, or add them and let CSS draw the arrow so the icon cannot disagree.
- There is no size option (fixed 26px high, 14px text), so the badge is too big for dense table rows. *Planned fix:* Add --sm matching gds-badge--sm if tables need it.
- The docs show only the arrow for direction, with no text alternative. *Planned fix:* Add gds-sr-only direction text to the docs examples.

*Generated from `components/pct-badge.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:pct-badge:end -->

---

<!-- gds:component:filter-badge:start -->
### Filter badge

A compact pill with a filter icon and the number of applied filters; it opens the filter panel.

**Use when:**
- The entry point to filters in a list toolbar (Entries, Assets, Videos), showing how many filters are applied.
- Tight spaces where a full "Filters" button does not fit.

**Don't use when:**
- Showing each applied filter value so people can remove it (Status: Published ×) → use chip
- Showing a status or category → use badge
- A single filter with a few values → use dropdown

**Example: Filters applied (toolbar)**
```html
<button type="button" class="gds-filter-badge gds-filter-badge--active" aria-label="Filters, 3 applied" aria-haspopup="dialog" aria-expanded="false">
  <span class="gds-filter-badge__icon"><i data-lucide="filter"></i></span>
  <span class="gds-filter-badge__count" aria-hidden="true">3</span>
</button>
```

**Example: No filters applied**
```html
<button type="button" class="gds-filter-badge" aria-label="Filters" aria-haspopup="dialog" aria-expanded="false">
  <span class="gds-filter-badge__icon"><i data-lucide="filter"></i></span>
</button>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-filter-badge` | button | yes | top level | The pill: light blue background, 24px high, pointer cursor. A <button> that opens the filter panel. Attributes: `type` (button), `aria-label` (Includes the count, e.g. "Filters, 3 applied" or "Filters"), `aria-haspopup` ("dialog" when it opens a filter panel), `aria-expanded` ("true" while the panel is open). |
| `gds-filter-badge__icon` | span | yes | `gds-filter-badge` | Round icon container with the Lucide filter icon (16px, blue). |
| `gds-filter-badge__count` | span | no | `gds-filter-badge` | White circle with the number of applied filters (20px, fixed width). Hidden from screen readers because the button's aria-label says the count. Attributes: `aria-hidden` (true). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-filter-badge--active` | `gds-filter-badge` | state | At least one filter is applied: adds a blue border. |

**States:**
- **no filters**: No --active and no __count; aria-label="Filters".
- **filters applied**: gds-filter-badge--active + __count with the number; aria-label="Filters, N applied".
- **panel open**: aria-expanded="true" on the button (no visual class).

**Accessibility:**
- Use a <button>, so it is focusable and works with Enter / Space.
- The button's aria-label says the count ("Filters, 3 applied"); hide __count with aria-hidden so it is not read twice.
- The active state is not colour-only: the count also shows that filters are applied.
- There is no visible focus style in the CSS yet (known issue); the browser default outline must not be removed.

**Rules:**
- .gds-filter-badge is a <button type="button">, never a <span> or <div>. *Why:* It is clickable (pointer cursor) but a span cannot be reached by keyboard. The docs examples use <span>. (Accessible by default · auto-checkable)
- The button has an aria-label that includes the filter count when there is one. *Why:* Icon plus a bare number is announced as "button, 3". (Accessible by default · auto-checkable)
- Show __count and --active together, only when at least one filter is applied; never show a count of 0. *Why:* One clear meaning: border and number both mean "filters are on". (Obvious over documented · auto-checkable)
- Show at most "9+" in __count. *Why:* The count circle has a fixed 20px width; longer numbers overflow. (Obvious over documented · auto-checkable)
- Show the applied filter values next to it as removable chips, not as badges. *Why:* Badges are not interactive; chips are built for remove actions. (Reuse before you create)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The docs examples use a <span> (not focusable), and brand.md shows a different structure (<button> with a "Filters" text label and the icon class on the <i>). The CSS has no styles for a text label. *Planned fix:* Update docs and brand.md to the anatomy here; add a __label element if a text version is wanted.
- No :hover, :focus-visible or disabled styles, although the pill is clickable. *Planned fix:* Add hover background, a focus ring like other controls, and a disabled state.
- The active border (blue-200 #98bcec on blue-50 #e9f1fb) has about 1.7:1 contrast, below the 3:1 that WCAG 1.4.11 asks for UI states. *Planned fix:* Use a darker border (e.g. blue-500) for --active.
- The base class does not reset font-family or color, so on a <button> the count may pick up the browser's button font. *Planned fix:* Add font: inherit and color: inherit to .gds-filter-badge.
- __count has a fixed 20px width, so three-digit numbers overflow. *Planned fix:* min-width instead of width, plus inline padding.
- __icon repeats the badge background (both blue-50), so the icon circle is invisible as a shape. *Planned fix:* Drop the icon background or give it a distinct tint, if a visible circle was intended.

*Generated from `components/filter-badge.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:filter-badge:end -->

---

<!-- gds:component:avatar:start -->
### Avatar

A photo, initials or icon that represents a person or an organisation, alone, stacked in a group or paired with a name.

**Use when:**
- Showing who wrote, edited or owns an entry or asset.
- Listing collaborators on an item (avatar group).
- A user or author cell in a table, paired with the name (avatar name).
- Representing an organisation, site or publication (square shape).

**Don't use when:**
- A removable person token in a field or filter → use chip with a .gds-avatar inside
- A presence indicator without a picture → use status-dot
- A thumbnail of an image or video asset → use a plain <img> in a card or table cell

**Example: Author cell in an entries table**
```html
<div class="gds-avatar-name gds-avatar-name--sm">
  <div class="gds-avatar gds-avatar--32">
    <img class="gds-avatar__img" src="/avatars/arta-berisha.jpg" alt="" />
  </div>
  <div class="gds-avatar-name__info">
    <span class="gds-avatar-name__label">Arta Berisha</span>
    <span class="gds-avatar-name__subtitle">Senior editor</span>
  </div>
</div>
```

**Example: Collaborators on an article**
```html
<div class="gds-avatar-group" role="group" aria-label="Collaborators: 6 people">
  <span class="gds-avatar-group__counter">+3</span>
  <div class="gds-avatar gds-avatar--32">
    <img class="gds-avatar__img" src="/avatars/dren-hoxha.jpg" alt="Dren Hoxha" />
  </div>
  <div class="gds-avatar gds-avatar--32" role="img" aria-label="Lirie Gashi">
    <span class="gds-avatar__text" aria-hidden="true">LG</span>
  </div>
  <div class="gds-avatar gds-avatar--32">
    <img class="gds-avatar__img" src="/avatars/arta-berisha.jpg" alt="Arta Berisha" />
  </div>
</div>
```

**Example: Publication with online editor**
```html
<div class="gds-avatar gds-avatar--40 gds-avatar--square" role="img" aria-label="City Desk">
  <span class="gds-avatar__icon"><i data-lucide="building-2"></i></span>
</div>
<div class="gds-avatar gds-avatar--40">
  <img class="gds-avatar__img" src="/avatars/dren-hoxha.jpg" alt="Dren Hoxha" />
  <span class="gds-avatar__status" role="img" aria-label="Online"></span>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-avatar-group` | div | no | top level | Overlapping stack of avatars. Uses row-reverse: the first child in the DOM appears on the right, in front. Attributes: `role` (group), `aria-label` (Who is shown, e.g. "Collaborators: 7 people"). |
| `gds-avatar-group__counter` | span | no | `gds-avatar-group` | "+N" for people not shown. Must be the FIRST child of the group so it appears last (on the right). Fixed at 32px. |
| `gds-avatar-name` | div | no | top level | Avatar + name pair. Contains one .gds-avatar followed by .gds-avatar-name__info. |
| `gds-avatar` | div \| span | yes | top level | The avatar circle or square. 32px circle by default. Contains exactly one of __img, __text or __icon, plus an optional __status. Can sit alone, in .gds-avatar-group, in .gds-avatar-name or in a chip. Attributes: `role` ("img" when it shows initials or an icon and no name is visible next to it), `aria-label` (The full name of the person or organisation). |
| `gds-avatar__img` | img | no | `gds-avatar` | Photo or logo, cropped to fill. Attributes: `alt` (Required. The name when the avatar stands alone; alt="" when the name is visible next to it). |
| `gds-avatar__text` | span | no | `gds-avatar` | Initials (one or two letters). Shown in upper case. Attributes: `aria-hidden` ("true"; the name comes from the avatar's aria-label or the visible name). |
| `gds-avatar__icon` | span | no | `gds-avatar` | Fallback icon when there is no photo or name: <i data-lucide="user"></i> for people, "building-2" for organisations. Size follows the avatar size. |
| `gds-avatar__status` | span | no | `gds-avatar` | Small green "online" dot in the bottom-right corner, with a white ring. Only one colour exists. Attributes: `role` (img), `aria-label` ("Online"). |
| `gds-avatar-name__info` | div | yes | `gds-avatar-name` | Text column next to the avatar. |
| `gds-avatar-name__label` | span | yes | `gds-avatar-name__info` | The name. Truncates with an ellipsis. |
| `gds-avatar-name__subtitle` | span | no | `gds-avatar-name__info` | Second line: role, email or team. Truncates with an ellipsis. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-avatar--16` | `gds-avatar` | size | 16px. Inline in text or very dense lists. |
| `gds-avatar--20` | `gds-avatar` | size | 20px. |
| `gds-avatar--24` | `gds-avatar` | size | 24px. Table cells and compact lists. |
| `gds-avatar--32` | `gds-avatar` | size (default) | 32px. Same as the base size. |
| `gds-avatar--40` | `gds-avatar` | size | 40px. Comments, cards, panel headers. |
| `gds-avatar--48` | `gds-avatar` | size | 48px. |
| `gds-avatar--64` | `gds-avatar` | size | 64px. Profile headers. |
| `gds-avatar--circle` | `gds-avatar` | style (default) | Round. For people. Same as the base shape. |
| `gds-avatar--square` | `gds-avatar` | style | Rounded square. For organisations, sites and publications. |
| `gds-avatar-name--sm` | `-name` | size | Smaller name and subtitle text. Pair with a 32px avatar. |
| `gds-avatar-name--xs` | `-name` | size | Smallest text (both lines the same size). Pair with a 24px avatar. |
| `gds-avatar-name--soft` | `-name` | style | Muted name and subtitle colours, for secondary mentions. |

**Accessibility:**
- Every .gds-avatar__img has alt. Use alt="" when the name is already visible next to it (avatar name, table cell), so it is not read twice.
- An initials or icon avatar with no visible name gets role="img" and aria-label with the full name; initials alone mean nothing to a screen reader.
- Status is not shown by colour alone: give .gds-avatar__status role="img" and aria-label="Online", or say it in text nearby.
- In a group, each avatar needs a name (alt or aria-label) and the group an aria-label with the total count.
- The group's DOM order is the reverse of what people see; keep groups non-interactive or see knownIssues.

**Rules:**
- Every .gds-avatar__img has an alt attribute (empty when the name is visible next to it). *Why:* Without alt, screen readers read the file name. (Accessible by default · auto-checkable)
- An avatar with initials or an icon and no visible name next to it has role="img" and aria-label with the full name. *Why:* "FK" or a generic person icon does not tell anyone who it is. (Accessible by default · auto-checkable)
- .gds-avatar__status has role="img" and aria-label, or the status is written in nearby text. *Why:* A green dot is colour only. aria-label on a plain span is ignored, so it needs the img role. (Accessible by default · auto-checkable)
- Circle for people, square for organisations, sites and publications. *Why:* The shape tells people at a glance whether it is a person or an entity. (Obvious over documented)
- .gds-avatar__text holds one or two letters. *Why:* More letters do not fit the circle at small sizes. (Obvious over documented · auto-checkable)
- .gds-avatar-group__counter is the first child of .gds-avatar-group. *Why:* The group uses row-reverse, so the first child appears last; anywhere else the counter lands in the middle of the stack. (Obvious over documented · auto-checkable)
- All avatars in a .gds-avatar-group use the same size. *Why:* The overlap and the counter are tuned for one size; mixed sizes look broken. (Reuse before you create · auto-checkable)
- To show an avatar with a name, use .gds-avatar-name, not a custom flex row. *Why:* It already handles spacing, truncation and type sizes. (Reuse before you create)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-avatar-group uses flex-direction: row-reverse, so screen readers and keyboard focus go through the avatars in the opposite order to what people see, and the counter must come first in the DOM. *Planned fix:* v3: normal order, negative margin-left and z-index stacking.
- .gds-avatar-group__counter is fixed at 32px. Docs patch other sizes with inline styles, and gds-avatar--24 on the counter loses to the counter rule. *Planned fix:* Add group size modifiers (e.g. gds-avatar-group--24) that size both the avatars and the counter.
- .gds-avatar__status is always green (online) and duplicates status-dot, which has busy, away and offline. *Planned fix:* Allow a .gds-status-dot--ring inside .gds-avatar in the status position, and deprecate __status.
- gds-avatar-name--soft subtitle (neutral-80 on white) is about 3:1, below the 4.5:1 needed for small text. *Planned fix:* Use neutral-300 or the text-secondary token for the soft subtitle.
- At 16px, the icon size token is also 16px, so the fallback icon fills the whole avatar with no padding. *Planned fix:* Set --avatar-icon-16 to 10–12px.

*Generated from `components/avatar.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:avatar:end -->

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

<!-- gds:component:menu:start -->
### Menu

A list of actions on demand: overflow ("more") menus, context menus, row actions.

**Use when:**
- Actions on one item that do not fit as buttons (Edit, Duplicate, Move to, Archive, Delete on an article row).
- A "more" (ellipsis) button in a toolbar or card.
- Right-click / context actions.

**Don't use when:**
- Choosing a value (status, author, category) → use dropdown
- One or two main actions → use buttons, visible on the page
- Navigation between pages or sections → use sidebar, tabs or links
- A form or other interactive content → use popover

**Example: Article row actions**
```html
<button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm" aria-label="Actions for Election results live" aria-haspopup="menu" aria-expanded="true" aria-controls="article-actions"><i data-lucide="more-horizontal"></i></button>
<div id="article-actions" class="gds-menu" role="menu" aria-label="Article actions">
  <button type="button" class="gds-menu__item" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="pencil" width="16" height="16"></i></span>
    <span class="gds-menu__label">Edit</span>
  </button>
  <button type="button" class="gds-menu__item" role="menuitem" tabindex="-1" aria-keyshortcuts="Control+D">
    <span class="gds-menu__icon"><i data-lucide="copy" width="16" height="16"></i></span>
    <span class="gds-menu__label">Duplicate</span>
    <span class="gds-menu__shortcut">Ctrl+D</span>
  </button>
  <button type="button" class="gds-menu__item" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="false">
    <span class="gds-menu__icon"><i data-lucide="folder" width="16" height="16"></i></span>
    <span class="gds-menu__label">Move to category</span>
    <span class="gds-menu__trailing"><i data-lucide="chevron-right" width="16" height="16"></i></span>
  </button>
  <button type="button" class="gds-menu__item gds-menu__item--disabled" role="menuitem" tabindex="-1" aria-disabled="true">
    <span class="gds-menu__icon"><i data-lucide="send" width="16" height="16"></i></span>
    <span class="gds-menu__label">Push notification</span>
  </button>
  <div class="gds-menu__divider" role="separator"></div>
  <button type="button" class="gds-menu__item gds-menu__item--danger" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="trash-2" width="16" height="16"></i></span>
    <span class="gds-menu__label">Delete</span>
  </button>
</div>
```

**Example: Export menu (grouped, rich items)**
```html
<div class="gds-menu" role="menu" aria-label="Export">
  <div class="gds-menu__group" role="presentation">Export report</div>
  <button type="button" class="gds-menu__item gds-menu__item--rich" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="file-spreadsheet" width="20" height="20"></i></span>
    <span class="gds-menu__content">
      <span class="gds-menu__label">CSV</span>
      <span class="gds-menu__desc">Page views per article, for spreadsheets</span>
    </span>
  </button>
  <button type="button" class="gds-menu__item gds-menu__item--rich" role="menuitem" tabindex="-1">
    <span class="gds-menu__icon"><i data-lucide="file-text" width="20" height="20"></i></span>
    <span class="gds-menu__content">
      <span class="gds-menu__label">PDF</span>
      <span class="gds-menu__desc">Printable summary with charts</span>
    </span>
  </button>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-menu` | div | yes | top level | The menu surface: background, border, shadow, column of items. Has no open state and no positioning: the product shows / hides it (hidden attribute) and places it next to its trigger. Long menus scroll inside the panel past 360px (or 60% of the screen height): --menu-max-height. Attributes: `role` (menu), `id` (Referenced by aria-controls on the trigger), `aria-label` (e.g. "Article actions" (or aria-labelledby the trigger)). |
| `gds-menu__group` | div | no | `gds-menu` | Small uppercase heading above a set of items. A sibling of the items, not a wrapper. Attributes: `role` (presentation). |
| `gds-menu__item` | button | yes, repeats | `gds-menu` | One action. Full-width <button>. Attributes: `type` (button), `role` (menuitem), `tabindex` (-1 (roving: the focused item gets focus via JS)), `aria-disabled` ("true" with --disabled), `aria-haspopup` ("menu" when it opens a submenu (with __trailing)), `aria-keyshortcuts` (When __shortcut is shown, e.g. "Control+D"). |
| `gds-menu__icon` | span | no | `gds-menu__item` | Leading icon (16px; 20px in --rich). Decorative. |
| `gds-menu__content` | span | no | `gds-menu__item` | Rich items only: stacks __label and __desc. |
| `gds-menu__label` | span | yes | `gds-menu__item` or `gds-menu__content` | Action name. One line, truncated with ellipsis. |
| `gds-menu__desc` | span | no | `gds-menu__content` | Second line in rich items. |
| `gds-menu__shortcut` | span | no | `gds-menu__item` | Keyboard shortcut hint on the right (e.g. Ctrl+D). |
| `gds-menu__trailing` | span | no | `gds-menu__item` | Trailing icon on the right, e.g. chevron-right for a submenu. |
| `gds-menu__divider` | div | no | `gds-menu` | 1px line between groups of items. Attributes: `role` (separator). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-menu__item--danger` | `__item` | variant | Destructive action (Delete): red text and icon. |
| `gds-menu__item--disabled` | `__item` | state | Not available: faded (opacity), no pointer events. Also set aria-disabled="true". |
| `gds-menu__item--rich` | `__item` | layout | Two-line item: larger icon + __content with __label and __desc. |

**States:**
- **open / closed**: No class. The product toggles the hidden attribute (or wraps the menu in its own positioned layer) and sets aria-expanded on the trigger.
- **hover / focus**: Native :hover and :focus-visible on the item.
- **disabled item**: gds-menu__item--disabled + aria-disabled="true".

**Accessibility:**
- Container role="menu" with a name; items role="menuitem"; dividers role="separator".
- Trigger: <button> with aria-haspopup="menu", aria-expanded and aria-controls.
- Keyboard (product JS): Enter / Space / Arrow Down opens and focuses the first item; arrows move; Home / End jump; Escape closes and returns focus to the trigger.
- Items use roving tabindex (tabindex="-1", focus moved by JS). Disabled items stay focusable with aria-disabled="true" so people can find them.
- Icons are decorative: the label carries the meaning.

**Rules:**
- .gds-menu has role="menu" and an aria-label or aria-labelledby; every .gds-menu__item has role="menuitem". *Why:* Without roles a screen reader reads a pile of buttons with no menu context or arrow-key hint. (Accessible by default · auto-checkable)
- .gds-menu__item is a <button type="button">, never a <div> or <li>. *Why:* The item styles reset a button; other elements are not focusable or clickable by keyboard. (Accessible by default · auto-checkable)
- --disabled items have aria-disabled="true". *Why:* The class only fades the item; the attribute tells assistive tech it is unavailable. (Accessible by default · auto-checkable)
- An item with a chevron-right in __trailing has aria-haspopup="menu" and aria-expanded. *Why:* Announces that the item opens a submenu. (Accessible by default · auto-checkable)
- Use menu for actions, dropdown for choosing values. *Why:* Different semantics (menu vs listbox) and different keyboard models. (Reuse before you create)
- Put --danger items last, after a __divider. *Why:* Separating destructive actions avoids accidental clicks; red text alone is not enough. The action itself should still ask for confirmation (modal) before deleting. (Obvious over documented · auto-checkable)
- Within a menu, give every item an icon or none. *Why:* Mixed items make the labels start at different positions and look broken. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- No open state and no positioning, unlike gds-dropdown--open and gds-popover--open. Each product invents its own show / hide and placement. *Planned fix:* v3: show menus inside .gds-popover (role "menu" on the controller) and drop the menu's own surface.
- The menu draws its own background, border and shadow, so inside a .gds-popover or the calendar presets column it gets a second frame. *Planned fix:* Add a flat variant, or move the surface to .gds-popover.
- The menu uses the dropdown tokens (--dd-*) and has no component tokens of its own. *Planned fix:* Add _component-menu.scss tokens that alias the dropdown ones.
- --disabled uses opacity 0.4. The calendar dropped opacity for disabled days because it cut contrast to about 1.4:1. *Planned fix:* Use a muted text colour token for disabled items, like the calendar.
- --disabled sets pointer-events: none and the docs use the disabled attribute, which removes the item from keyboard focus. The ARIA menu pattern keeps disabled items focusable. *Planned fix:* Document aria-disabled without the disabled attribute; keep pointer-events: none only for the mouse.
- The focus ring is a box-shadow, which disappears in Windows forced-colours mode. *Planned fix:* Use outline (as the calendar does) or add a forced-colors fallback.
- __group is a sibling label, not a wrapper, so it cannot form an ARIA group; text directly inside role="menu" is not an allowed child. *Planned fix:* v3: add a __section wrapper with role="group" and aria-labelledby pointing to __group.
- text-align: left and margin-left are physical properties, so items do not mirror in right-to-left layouts. *Planned fix:* Use text-align: start and margin-inline-start.

*Generated from `components/menu.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:menu:end -->

---

<!-- gds:component:tabs:start -->
### Tabs

A row (or column) of tabs that switches between panels of related content on the same page.

**Use when:**
- Splitting one object into views of the same level (e.g. an entry's Content, SEO, Media, History).
- Settings pages with a few sections, with --vertical.
- Switching a view mode of the same data, with --filled (e.g. Grid / List).

**Don't use when:**
- Moving between pages of the app (the URL changes) → use sidebar or navigation links with aria-current
- Steps that must be done in order → use stepper
- Filtering a list by a value → use chip or filter-badge
- More than about 7 sections, or content people need to compare side by side → use a single page with headings

**Example: Entry editor sections**
```html
<div class="gds-tabs" role="tablist" aria-label="Entry sections">
  <button type="button" class="gds-tab gds-tab--active" role="tab" id="tab-content" aria-selected="true" aria-controls="panel-content" tabindex="0"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="file-text"></i></span><span class="gds-tab__text">Content</span></button>
  <button type="button" class="gds-tab" role="tab" id="tab-seo" aria-selected="false" aria-controls="panel-seo" tabindex="-1"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="search"></i></span><span class="gds-tab__text">SEO</span></button>
  <button type="button" class="gds-tab" role="tab" id="tab-comments" aria-selected="false" aria-controls="panel-comments" tabindex="-1"><span class="gds-tab__text">Comments</span><span class="gds-tab__badge"><span class="gds-badge gds-badge--sm gds-badge--info"><span class="gds-badge__label">12</span></span></span></button>
  <button type="button" class="gds-tab gds-tab--disabled" role="tab" id="tab-history" aria-selected="false" aria-controls="panel-history" aria-disabled="true" tabindex="-1"><span class="gds-tab__text">History</span></button>
</div>
<div role="tabpanel" id="panel-content" aria-labelledby="tab-content" tabindex="0">…</div>
<div role="tabpanel" id="panel-seo" aria-labelledby="tab-seo" tabindex="0" hidden>…</div>
<div role="tabpanel" id="panel-comments" aria-labelledby="tab-comments" tabindex="0" hidden>…</div>
<div role="tabpanel" id="panel-history" aria-labelledby="tab-history" tabindex="0" hidden>…</div>
```

**Example: Media library view switch (filled, icon only)**
```html
<div class="gds-tabs gds-tabs--filled gds-tabs--sm" role="tablist" aria-label="Media view">
  <button type="button" class="gds-tab gds-tab--icon-only gds-tab--active" role="tab" id="view-grid" aria-label="Grid" aria-selected="true" aria-controls="media-grid" tabindex="0"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="layout-grid"></i></span></button>
  <button type="button" class="gds-tab gds-tab--icon-only" role="tab" id="view-list" aria-label="List" aria-selected="false" aria-controls="media-list" tabindex="-1"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="list"></i></span></button>
</div>
<div role="tabpanel" id="media-grid" aria-labelledby="view-grid">…</div>
<div role="tabpanel" id="media-list" aria-labelledby="view-list" hidden>…</div>
```

**Example: Vertical settings tabs with a status dot**
```html
<div class="gds-tabs gds-tabs--vertical" role="tablist" aria-label="Site settings" aria-orientation="vertical" style="width:var(--tab-vertical-width)">
  <button type="button" class="gds-tab gds-tab--active" role="tab" id="set-general" aria-selected="true" aria-controls="set-general-panel" tabindex="0"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="settings"></i></span><span class="gds-tab__text">General</span></button>
  <button type="button" class="gds-tab" role="tab" id="set-ads" aria-selected="false" aria-controls="set-ads-panel" tabindex="-1"><span class="gds-tab__icon" aria-hidden="true"><i data-lucide="megaphone"></i></span><span class="gds-tab__text">Ads</span><span class="gds-tab__status"></span><span class="gds-sr-only">new</span></button>
</div>
<div role="tabpanel" id="set-general-panel" aria-labelledby="set-general" tabindex="0">…</div>
<div role="tabpanel" id="set-ads-panel" aria-labelledby="set-ads" tabindex="0" hidden>…</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-tabs-wrap` | div | no | top level | Optional wrapper around a scrolling .gds-tabs. Shows fade edges when the fade modifiers are set by JS. |
| `gds-tabs` | div | yes | top level | The tab list. Horizontal with a bottom border by default; scrolls sideways when it overflows. Attributes: `role` (tablist), `aria-label` (What the tabs switch between, e.g. "Entry sections"), `aria-orientation` ("vertical" with gds-tabs--vertical). |
| `gds-tab` | button | yes, repeats | `gds-tabs` | One tab. A <button> (the CSS resets its button styles). Attributes: `type` (button), `role` (tab), `id` (Referenced by the panel's aria-labelledby), `aria-selected` ("true" on the active tab, "false" on the others), `aria-controls` (id of the tab panel), `tabindex` (0 on the active tab, -1 on the others (arrow keys move focus)), `aria-label` (Required on --icon-only tabs). |
| `gds-tab__icon` | span | no | `gds-tab` | Leading icon slot. Holds a Lucide <i>. Decorative. Attributes: `aria-hidden` (true). |
| `gds-tab__text` | span | no | `gds-tab` | Tab label. Required unless the tab is --icon-only. |
| `gds-tab__badge` | span | no | `gds-tab` | Slot for a small gds-badge (e.g. a count) after the label. |
| `gds-tab__status` | span | no | `gds-tab` | Red dot that means "something new". Add hidden text for screen readers next to it. |
| `gds-tab__close` | button | no | `gds-tab` | Close button for closable tabs (12px Lucide x). See known issues: a button inside a tab is a nested control. Attributes: `type` (button), `aria-label` ("Close <tab name>"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-tabs--filled` | `s` | variant | Segmented look: grey track, the active tab is a filled pill. Good for view switches. |
| `gds-tabs--card` | `s` | variant | Folder-tab look: the active tab joins the panel below. |
| `gds-tabs--vertical` | `s` | layout | Tabs in a column with a left indicator. Set the width (e.g. var(--tab-vertical-width)) and aria-orientation="vertical". |
| `gds-tabs--sm` | `s` | size | Smaller tabs and text. Without it tabs are the normal size. |
| `gds-tab--active` | `gds-tab` | state | The selected tab. Always with aria-selected="true". |
| `gds-tab--disabled` | `gds-tab` | state | Dimmed and blocks the mouse. Also set aria-disabled="true" (keyboard can still reach it). |
| `gds-tab--icon-only` | `gds-tab` | content | Tab with only an icon, no gap. Needs aria-label on the tab. |
| `gds-tabs-wrap--fade-left` | `s-wrap` | state | Shows the left fade. Set by JS when the list is scrolled away from the start. |
| `gds-tabs-wrap--fade-right` | `s-wrap` | state | Shows the right fade. Set by JS when more tabs are hidden on the right. |

**States:**
- **selected**: gds-tab--active + aria-selected="true" + tabindex="0"; its panel is visible, the other panels have the hidden attribute.
- **hover**: Native :hover darkens the label and icon.
- **focus**: Native :focus-visible: thicker indicator in the focus colour (bordered, vertical), inset outline (filled, card).
- **disabled**: gds-tab--disabled + aria-disabled="true".

**Accessibility:**
- Use the WAI-ARIA tabs pattern: role="tablist" on .gds-tabs, role="tab" on each .gds-tab, role="tabpanel" on each panel.
- Each tab has aria-selected and aria-controls; each panel has an id and aria-labelledby pointing back at its tab, plus tabindex="0" when it has no focusable content.
- Keyboard: Tab enters the list on the active tab; Left/Right (Up/Down when vertical) move between tabs; Home/End go to the first/last. The CSS does not do this; the product JS must.
- Hide inactive panels with the hidden attribute so they are not read.
- The status dot is colour only: add <span class="gds-sr-only">new</span> next to it.

**Rules:**
- .gds-tabs has role="tablist" and every .gds-tab has role="tab". *Why:* Without the roles, screen readers announce a row of unrelated buttons and the selected tab is not known. (Accessible by default · auto-checkable)
- Exactly one .gds-tab has gds-tab--active, and it is the only tab with aria-selected="true". *Why:* The class draws the selection, the attribute announces it; they must agree. (Accessible by default · auto-checkable)
- Every .gds-tab has aria-controls pointing to an element with role="tabpanel". *Why:* Links each tab to the content it shows. (Accessible by default · auto-checkable)
- A gds-tab--icon-only tab has an aria-label. *Why:* An icon alone has no accessible name. (Accessible by default · auto-checkable)
- Do not use tabs to link to other pages; use navigation with links and aria-current. *Why:* Tabs switch content in place; pages change the URL and need real links. (Obvious over documented)
- A .gds-tabs has at most one of --filled and --card. *Why:* The two looks override each other. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The docs build tabs as <nav> with plain buttons: no role="tablist"/"tab", no aria-selected, no panels. *Planned fix:* Update all docs examples to the ARIA tabs pattern in this contract.
- The closable tab in the docs is a <div class="gds-tab"> with a button inside. As role="tab" this is a nested control, and the div is not focusable. .gds-tab__close also has no :focus-visible style. *Planned fix:* Support Delete to close on the focused tab and make the close button tabindex="-1", or move the close button outside the tab element; add a focus style to __close.
- --active and --disabled are classes only; nothing ties them to aria-selected / aria-disabled. --disabled uses pointer-events: none, so keyboard users can still activate it. *Planned fix:* v3: style from [aria-selected="true"] and [aria-disabled="true"].
- In --vertical the active tab text uses the hover colour (text-primary) while the other variants use action-primary. *Planned fix:* Confirm with design; if not intended, use --tab-color-active in vertical too.
- .gds-tabs-wrap and its fade modifiers are not shown in the docs and need JS that GDS does not ship. *Planned fix:* Add a docs example with the small scroll script, or remove the wrapper.
- --vertical combined with --filled or --card is not designed; the styles mix. *Planned fix:* Document as unsupported, or add a check.

*Generated from `components/tabs.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:tabs:end -->

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
          <button type="button" class="gds-table__sort-btn">Title <span class="gds-table__sort-icon"><i data-lucide="arrow-up-down"></i></span></button>
        </th>
        <th scope="col" class="gds-table__cell">Status</th>
        <th scope="col" class="gds-table__cell gds-table__cell--sortable gds-table__cell--sorted gds-table__cell--sorted-desc" aria-sort="descending">
          <button type="button" class="gds-table__sort-btn">Last updated <span class="gds-table__sort-icon"><i data-lucide="arrow-up"></i></span></button>
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
| `gds-table__sort-btn` | button | no | `gds-table__cell` | Reset button inside a sortable <th> holding the header text and the sort icon, so sorting works with Tab + Enter. Attributes: `type` (button). |
| `gds-table__sort-icon` | span | no | `gds-table__sort-btn` or `gds-table__cell` | Wraps the sort icon, inside gds-table__sort-btn. Unsorted: arrow-up-down; sorted: arrow-up (CSS flips it for descending). |
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
- Put the header text and icon of a sortable column inside <button class="gds-table__sort-btn"> so it works with the keyboard.
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
- Every sortable header cell contains a gds-table__sort-btn button. *Why:* Sorting must work with the keyboard, not only the mouse. (Accessible by default · auto-checkable)

**Do not use** (exist in the CSS for docs only):
- `gds-table__row--hover`: Docs preview that forces the hover look. Real hover is native :hover.
- `gds-table__row--striped`: Docs preview that forces a striped row. Use gds-table--striped.
- `gds-table__cell--label`: Docs-only cell that labels demo rows ("Default", "Hovered").

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- The action-cell dropdown uses .gds-dropdown__menu and .is-open, while the Dropdown component uses .gds-dropdown__panel and .gds-dropdown--open. *Planned fix:* v3: one dropdown API everywhere (__panel / --open).
- is-visible on the toolbar breaks the BEM naming rule. *Planned fix:* v3: gds-table__toolbar--visible.
- Sorting needs two modifiers and one specific icon. *Planned fix:* v3: --sort-asc / --sort-desc.

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

<!-- gds:component:alert:start -->
### Alert

A persistent message inside the page that explains a state or problem and stays until the cause is gone or the user dismisses it.

**Use when:**
- A message that must stay visible while the user works: a failed publish, validation summary, locked entry, missing permission.
- A problem the user has to fix or a state they need to know about before acting (e.g. "This entry is scheduled; edits go live at 18:00").
- System-wide notices across the top of the app (maintenance, expiring licence): use --banner.
- Short inline hints under a field or in a form section: use --compact.

**Don't use when:**
- A short confirmation that something just worked ("Article published") → use toast
- A question the user must answer before continuing → use modal
- An error tied to a single form field → use input with gds-input--error and its helper text
- A status label on a row or card → use badge

**Example: Publish failed (inserted after the action, with retry)**
```html
<div class="gds-alert gds-alert--error gds-alert--accent" role="alert">
  <span class="gds-alert__icon" aria-hidden="true"><i data-lucide="alert-circle" width="24" height="24"></i></span>
  <div class="gds-alert__body">
    <div class="gds-alert__content">
      <p class="gds-alert__title">The article could not be published</p>
      <p class="gds-alert__desc">Two required fields are empty: SEO title and cover image.</p>
    </div>
    <div class="gds-alert__actions">
      <button type="button" class="gds-btn gds-btn--primary gds-btn--sm"><span class="gds-btn__label">Show fields</span></button>
      <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Save as draft</span></button>
    </div>
  </div>
  <button type="button" class="gds-alert__close" aria-label="Dismiss"><i data-lucide="x" width="16" height="16"></i></button>
</div>
```

**Example: Entry locked (present on load, no live role)**
```html
<div class="gds-alert gds-alert--warning">
  <span class="gds-alert__icon" aria-hidden="true"><i data-lucide="alert-triangle" width="24" height="24"></i></span>
  <div class="gds-alert__body">
    <div class="gds-alert__content">
      <p class="gds-alert__title">Another editor is working on this entry</p>
      <p class="gds-alert__desc">You can read it, but your changes cannot be saved until they close it.</p>
    </div>
    <a class="gds-alert__link" href="/entries/4821/history">View edit history <span class="gds-alert__link-icon" aria-hidden="true"><i data-lucide="arrow-right" width="16" height="16"></i></span></a>
  </div>
</div>
```

**Example: Compact field hint**
```html
<div class="gds-alert gds-alert--info gds-alert--compact">
  <span class="gds-alert__icon" aria-hidden="true"><i data-lucide="info" width="16" height="16"></i></span>
  <div class="gds-alert__body">
    <div class="gds-alert__content">
      <p class="gds-alert__desc">The slug cannot be changed after the entry is published.</p>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-alert` | div | yes | top level | Wrapper. Flex row: icon, body, close. Base styles are the info colours. Attributes: `role` ("alert" for errors, "status" for others, only when the alert is inserted after a user action (see rules). No role when it is part of the page on load.). |
| `gds-alert__icon` | span | no | `gds-alert` | Icon slot (24px, 16px in --compact). Holds a Lucide icon that matches the variant. Coloured by the variant. Attributes: `aria-hidden` ("true": the text carries the meaning.). |
| `gds-alert__body` | div | yes | `gds-alert` | Column that holds content, link and actions. Takes the remaining width. |
| `gds-alert__content` | div | yes | `gds-alert__body` | Stacks title and description. |
| `gds-alert__title` | p \| h2 \| h3 \| h4 | no | `gds-alert__content` | Short headline (14px medium). Use a heading tag when the alert starts a section of the page. |
| `gds-alert__desc` | p | no | `gds-alert__content` | Explanation (14px regular). Use title, description or both; one of them is needed. |
| `gds-alert__link` | a \| button | no | `gds-alert__body` | Text link below the content ("Read more", "View errors"). Use <button type="button"> when it does not navigate. |
| `gds-alert__link-icon` | span | no | `gds-alert__link` | Trailing icon in the link (16px), e.g. external-link or arrow-right. Attributes: `aria-hidden` ("true"). |
| `gds-alert__actions` | div | no | `gds-alert__body` | Row of buttons (gds-btn --sm) below the content. |
| `gds-alert__close` | button | no | `gds-alert` | Dismiss button (32px), last child of the alert. Contains a Lucide x icon. Attributes: `type` (button), `aria-label` (e.g. "Dismiss" or "Close"). |
| `gds-alert__progress` | div | no | `gds-alert` | Time bar at the bottom of a --toast alert. Width set by product JS. Needs position: relative on the alert (known issue). Attributes: `aria-hidden` ("true"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-alert--info` | `gds-alert` | variant (default) | Purple. Neutral information. |
| `gds-alert--success` | `gds-alert` | variant | Green. Something worked or is ready. |
| `gds-alert--warning` | `gds-alert` | variant | Orange. Something needs attention soon. |
| `gds-alert--error` | `gds-alert` | variant | Red. Something failed or is blocked. |
| `gds-alert--minimal` | `gds-alert` | layout | Description only, smaller padding (12px), items centred. Leave out the title. |
| `gds-alert--compact` | `gds-alert` | size | Smallest form for inline hints: 8/12px padding, 16px icon, 12px text. |
| `gds-alert--accent` | `gds-alert` | style | 4px coloured left border in the variant colour. |
| `gds-alert--banner` | `gds-alert` | layout | Full width, no radius, no left/right border. For the top of the app or a page. |
| `gds-alert--toast` | `gds-alert` | style | Floating card: white background, shadow, max 400px, slide-in animation, coloured left border per variant. For rich notifications with title and actions. |
| `gds-alert--dismissing` | `gds-alert` | state | Fades and slides out. Add with JS, then remove the element after the transition. |

**States:**
- **dismissing**: Add gds-alert--dismissing, wait for the transition (normal duration), then remove the element and move focus to a sensible place if the close button had focus.

**Accessibility:**
- Live role only for alerts added after a user action: role="alert" (assertive) for errors, role="status" (polite) for the rest. A live region must not be on alerts that are present on page load.
- Icon is decorative (aria-hidden="true"); the title or description says what happened. Colour is never the only signal.
- __close is a <button type="button"> with an aria-label. After dismiss, move focus to the next logical element (product JS).
- Do not auto-hide an inline alert. Only --toast alerts may time out, and they pause on hover and focus (product JS).
- In --compact the close button shrinks to 16px, below the 24px minimum target: do not use __close there.

**Rules:**
- An alert inserted after a user action has role="alert" (error) or role="status" (info, success, warning). An alert present on page load has no live role. *Why:* Screen readers announce new messages only through a live role; a role on static content makes them announce it on every load. (Accessible by default)
- .gds-alert__close is a <button type="button"> with an aria-label. *Why:* The button shows only an x icon, so it has no name without aria-label. (Accessible by default · auto-checkable)
- .gds-alert__icon has aria-hidden="true" and the alert has a __title or __desc with text. *Why:* The meaning lives in the text, not in the icon or colour. (Accessible by default · auto-checkable)
- An alert has exactly one variant (--info, --success, --warning, --error). Write --info explicitly even though it is the default look. *Why:* Two variants give an undefined colour; an explicit class makes intent readable. (Obvious over documented · auto-checkable)
- Icons: info → info, success → check, warning → alert-triangle, error → alert-circle. *Why:* Same icon for the same meaning everywhere, as in the docs. (Reuse before you create · auto-checkable)
- Short "it worked" confirmations use gds-toast, not an inline alert or gds-alert--toast. *Why:* Alerts are for messages that must stay; a confirmation that stays clutters the page. (Reuse before you create)
- .gds-alert__progress is used only inside a .gds-alert--toast, which needs position: relative (inline style or the toast container). *Why:* The bar is absolutely positioned; without a positioned alert it sticks to another element. (Obvious over documented · auto-checkable)
- Do not put .gds-alert__close inside a .gds-alert--compact. *Why:* Compact shrinks the button to 16px, below the 24px minimum target size. (Accessible by default · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-alert__progress is position: absolute but .gds-alert has no position: relative (only inside .gds-toast-container). Docs add style="position:relative" by hand. *Planned fix:* Add position: relative to .gds-alert--toast.
- Two toast implementations: .gds-alert--toast (400px, title, actions, progress bar) and .gds-toast (490px, single line, timer ring), with different shadows and radii. *Planned fix:* v3: one toast component with an optional title/actions slot.
- Naming: alert uses --error while toast, badge and button use --critical. *Planned fix:* v3: rename to --critical (keep --error as an alias for one release).
- Alert info is purple while badge --info is blue. *Planned fix:* Decide one info colour for all components.
- --compact sets __close to 16×16px, below the WCAG 2.2 24px target size. *Planned fix:* Keep a 24px hit area (padding or min-size) in compact.
- __link is inline-flex; inside __desc the docs need style="display:inline". *Planned fix:* Add an inline link variant, or make the link display: inline when inside __desc.
- __close focus ring borrows --input-focus-* tokens. *Planned fix:* Use a shared focus-ring token.
- Docs side panel example uses old alert markup (class on <i>, no __body). *Planned fix:* Update the docs example to the anatomy here.

*Generated from `components/alert.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:alert:end -->

---

<!-- gds:component:toast:start -->
### Toast

A short, single-line floating message that confirms something just happened and goes away on its own.

**Use when:**
- Confirming an action the user just took: "Article published", "Entry deleted", "Link copied".
- Offering one quick follow-up such as Undo or View.
- Background events that do not need action now ("Draft auto-saved").

**Don't use when:**
- An error the user must read or fix (failed publish, validation) → use alert (inline, persistent)
- A message longer than one short sentence, or with a title → use alert
- A decision the user must make → use modal
- The only way to reach an important action → use a button in the page; the toast can repeat it

**Example: Article published (with action)**
```html
<div class="gds-toast-container gds-toast-container--top-right" role="status" aria-live="polite" aria-label="Notifications">
  <div class="gds-toast gds-toast--success">
    <div class="gds-toast__icon" aria-hidden="true"><i data-lucide="check" width="24" height="24"></i></div>
    <div class="gds-toast__body">
      <span class="gds-toast__text">Article published</span>
      <button type="button" class="gds-toast__action">View</button>
    </div>
  </div>
</div>
```

**Example: Entry deleted (undo + countdown)**
```html
<div class="gds-toast-container gds-toast-container--bottom-right" role="status" aria-live="polite" aria-label="Notifications">
  <div class="gds-toast gds-toast--info">
    <div class="gds-toast__icon" aria-hidden="true"><i data-lucide="info" width="24" height="24"></i></div>
    <div class="gds-toast__body">
      <span class="gds-toast__text">Entry moved to trash</span>
      <button type="button" class="gds-toast__action">Undo</button>
      <div class="gds-toast__timer" role="timer" aria-label="Closes in 10 seconds">
        <span>10</span>
        <svg class="gds-toast__timer-ring" viewBox="0 0 29 29" aria-hidden="true"><circle cx="14.5" cy="14.5" r="12.5"></circle></svg>
      </div>
    </div>
  </div>
</div>
```

**Example: Background failure (critical)**
```html
<div class="gds-toast-container gds-toast-container--top-right" role="status" aria-live="polite" aria-label="Notifications">
  <div class="gds-toast gds-toast--critical" role="alert">
    <div class="gds-toast__icon" aria-hidden="true"><i data-lucide="x-circle" width="24" height="24"></i></div>
    <div class="gds-toast__body">
      <span class="gds-toast__text">Auto-save failed</span>
      <button type="button" class="gds-toast__action">Retry</button>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-toast-container` | div | no | top level | Fixed stack at a screen edge. Put it in the page once (empty) so it can act as a live region; toasts are added inside it. Needs one position modifier. Attributes: `role` ("status"), `aria-live` ("polite"), `aria-label` (e.g. "Notifications"). |
| `gds-toast` | div | yes | top level | The toast. Flex row: icon block, body. Usually inside gds-toast-container. Attributes: `role` ("alert" only on --critical toasts; others rely on the container's role="status".). |
| `gds-toast__icon` | div | yes | `gds-toast` | Solid colour block on the left with a white 24px Lucide icon. Colour comes from the variant. Attributes: `aria-hidden` ("true"). |
| `gds-toast__body` | div | yes | `gds-toast` | Row with text, action and timer. |
| `gds-toast__text` | span | yes | `gds-toast__body` | The message. One line; longer text is cut with an ellipsis. |
| `gds-toast__action` | button | no | `gds-toast__body` | One text button (Undo, View, Retry). Attributes: `type` (button). |
| `gds-toast__timer` | div | no | `gds-toast__body` | Round countdown badge (26px). Contains a <span> with the seconds left and the __timer-ring SVG. Product JS updates both. Attributes: `role` ("timer"), `aria-label` (e.g. "Closes in 5 seconds"). |
| `gds-toast__timer-ring` | svg | no | `gds-toast__timer` | Progress ring: <svg viewBox="0 0 29 29"> with one <circle cx="14.5" cy="14.5" r="12.5">. JS sets stroke-dasharray/offset (circumference ≈ 78.5). Attributes: `aria-hidden` ("true"). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-toast--info` | `gds-toast` | variant (default) | Purple icon block and ring. Neutral events. |
| `gds-toast--success` | `gds-toast` | variant | Green. Action completed. |
| `gds-toast--warning` | `gds-toast` | variant | Orange. Completed, but with something to note. |
| `gds-toast--critical` | `gds-toast` | variant | Red. Something failed in the background; keep it short and offer Retry. |
| `gds-toast--dismissing` | `gds-toast` | state | Fades and slides out. Add with JS, then remove the element after the transition. |
| `gds-toast-container--top-right` | `-container` | layout | 24px from the top and right edges. |
| `gds-toast-container--top-left` | `-container` | layout | 24px from the top and left edges. |
| `gds-toast-container--top-center` | `-container` | layout | Top, centred. |
| `gds-toast-container--bottom-right` | `-container` | layout | 24px from the bottom and right edges. |
| `gds-toast-container--bottom-left` | `-container` | layout | 24px from the bottom and left edges. |
| `gds-toast-container--bottom-center` | `-container` | layout | Bottom, centred. |

**States:**
- **counting down**: Product JS updates the timer <span> text, its aria-label and the ring circle stroke-dashoffset each second.
- **dismissing**: Add gds-toast--dismissing, wait for the transition (normal duration), then remove the element.

**Accessibility:**
- The container is in the DOM before any toast is added, with role="status" and aria-live="polite", so new toasts are announced.
- --critical toasts get role="alert" so they are announced at once.
- Auto-dismiss timing is product JS: at least 5 seconds, longer with an action, and the timer pauses on hover and on focus inside the toast.
- The action is a real <button>. Moving focus into a toast is never automatic; keyboard users must be able to reach it (e.g. a shortcut or it stays until focus leaves).
- The icon is decorative; the text carries the meaning.
- Timer: role="timer" with an aria-label; the ring SVG is aria-hidden.

**Rules:**
- Toasts live inside a .gds-toast-container with role="status" and aria-live="polite" that exists before toasts are added. --critical toasts add role="alert". *Why:* A live region only announces content added after it exists. (Accessible by default · auto-checkable)
- .gds-toast-container has exactly one position modifier. Default choice: --top-right. *Why:* Without one the fixed container has no offsets and lands in an arbitrary spot. (Obvious over documented · auto-checkable)
- Toast text is one short sentence (about 60 characters or less), with no title and no links inside the text. *Why:* __text never wraps; longer text is cut with an ellipsis and cannot be read. (Obvious over documented)
- An auto-dismissing toast stays at least 5 seconds (10 with an action) and pauses on hover and focus. *Why:* People need time to read and to reach the action (WCAG 2.2.1). (Accessible by default)
- .gds-toast__action is a <button type="button">; at most one per toast. *Why:* It must be reachable with the keyboard, and one action keeps the toast quick to read. (Accessible by default · auto-checkable)
- .gds-toast__timer has role="timer" and an aria-label; .gds-toast__timer-ring has aria-hidden="true". *Why:* The number alone has no context for screen readers, and the ring is decoration. (Accessible by default · auto-checkable)
- .gds-toast__icon has aria-hidden="true"; icons: info → info, success → check, warning → alert-triangle, critical → x-circle. *Why:* The meaning is in the text; same icon for the same meaning, as in the docs. (Accessible by default · auto-checkable)
- A toast has exactly one variant class. Write --info explicitly. *Why:* Two variants give an undefined colour. (Obvious over documented · auto-checkable)
- Errors the user has to fix are shown as an inline alert, not a toast. *Why:* Toasts disappear; an error that vanishes leaves the user without a way to fix it. (Reuse before you create)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-toast-container is defined twice: in _alert.scss (max-width 400px) and _toast.scss (max-width 490px). The toast file wins only because it loads later. *Planned fix:* Define the container once, in _toast.scss.
- The docs never show __timer / __timer-ring markup. The ring geometry exists only as a JS constant (r = 12.5) and the ring is offset to sit over the border. brand.md puts the timer outside __body, but __body's right padding suggests inside. *Planned fix:* Document the SVG markup (viewBox, circle) in the docs, or replace the SVG with a CSS-only ring (conic-gradient + a registered custom property).
- There is no close element. A toast without a timer (docs: "Action without timer") cannot be dismissed. *Planned fix:* Add .gds-toast__close (24px+ icon button).
- White icon on the warning block (orange-500) is 2.5:1, below the 3:1 non-text contrast minimum. Info 3.5:1, critical 3.6:1, success 4.0:1 pass. *Planned fix:* Use a darker orange for --toast-warning-bg or a dark icon on warning.
- __text is nowrap with ellipsis; longer messages are cut with no way to read them. *Planned fix:* Allow up to two lines (line-clamp) and keep the full text available.
- .gds-toast:hover changes the background, which suggests the whole toast is clickable. It is not. *Planned fix:* Remove the hover background.
- Naming: toast uses --critical, alert uses --error. Toast info is purple, badge info is blue. *Planned fix:* Align variant names and the info colour across components.

*Generated from `components/toast.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:toast:end -->

---

<!-- gds:component:modal:start -->
### Modal

A centred dialog over a dimmed page that blocks everything else until the user confirms, decides or cancels.

**Use when:**
- A decision that must be made before going on: "Publish now?", "Discard changes?".
- Irreversible or destructive actions (delete entry, unpublish, remove user): use --destructive.
- Short, focused tasks with a few fields (rename a tag, merge tags) that make sense without seeing the page.

**Don't use when:**
- Editing entry details while the list or page stays in view → use sidepanel
- Long forms or many sections → use sidepanel (--lg) or a full page
- Telling the user something happened → use toast
- A persistent problem on the page → use alert
- A confirmation started from inside a side panel → use a confirmation inside the panel (modal z-index is below the panel, known issue)

**Example: Publish confirmation**
```html
<div class="gds-modal-overlay gds-modal-overlay--open">
  <div class="gds-modal gds-modal--sm" role="dialog" aria-modal="true" aria-labelledby="publish-title" aria-describedby="publish-desc">
    <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle gds-modal__close" aria-label="Close"><i data-lucide="x"></i></button>
    <div class="gds-modal__inner">
      <div class="gds-modal__header">
        <h2 class="gds-modal__title" id="publish-title">Publish article?</h2>
        <p class="gds-modal__desc" id="publish-desc">"Election night: live results" will be visible on the website and in the app right away.</p>
      </div>
      <div class="gds-modal__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Publish now</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Delete entry (destructive)**
```html
<div class="gds-modal-overlay gds-modal-overlay--open">
  <div class="gds-modal gds-modal--sm gds-modal--destructive" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc">
    <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle gds-modal__close" aria-label="Close"><i data-lucide="x"></i></button>
    <div class="gds-modal__inner">
      <div class="gds-modal__header">
        <h2 class="gds-modal__title" id="delete-title">Delete this entry?</h2>
        <p class="gds-modal__desc" id="delete-desc">"Summer festival guide" and its 3 translations will be deleted. This cannot be undone.</p>
      </div>
      <div class="gds-modal__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Delete entry</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Rename tag (short form)**
```html
<div class="gds-modal-overlay gds-modal-overlay--open">
  <div class="gds-modal gds-modal--sm" role="dialog" aria-modal="true" aria-labelledby="rename-title">
    <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle gds-modal__close" aria-label="Close"><i data-lucide="x"></i></button>
    <div class="gds-modal__inner">
      <div class="gds-modal__header">
        <h2 class="gds-modal__title" id="rename-title">Rename tag</h2>
      </div>
      <div class="gds-modal__body">
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="tag-name">Tag name</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="tag-name" value="Elections 2026" /></div>
        </div>
      </div>
      <div class="gds-modal__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Save</span></button>
      </div>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-modal-overlay` | div | yes | top level | Fixed full-screen backdrop that centres the modal. Hidden (opacity 0, visibility hidden) until --open. Product JS may close on backdrop click, except for destructive modals. |
| `gds-modal` | div | yes | `gds-modal-overlay` | The dialog box: white, 640px (md) or 456px (sm), max height viewport minus 64px each side. Full-screen below 640px. Attributes: `role` ("dialog", or "alertdialog" for --destructive), `aria-modal` ("true"), `aria-labelledby` (id of .gds-modal__title), `aria-describedby` (id of .gds-modal__desc (required for alertdialog)). |
| `gds-modal__close` | button | no | `gds-modal` | Close button, top-right, first child of the modal. Combine with gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-btn-icon--circle and a Lucide x icon. Attributes: `type` (button), `aria-label` ("Close"). |
| `gds-modal__inner` | div | yes | `gds-modal` | Scroll container with side padding. Header and footer stick to its top and bottom. |
| `gds-modal__header` | div | yes | `gds-modal__inner` | Sticky header with title and description. |
| `gds-modal__title` | h2 | yes | `gds-modal__header` | Dialog title (16px medium). Give it an id for aria-labelledby. Attributes: `id` (referenced by aria-labelledby). |
| `gds-modal__desc` | p | no | `gds-modal__header` | Supporting text (14px). For destructive modals, say what will be lost. Give it an id for aria-describedby. |
| `gds-modal__body` | div | no | `gds-modal__inner` | Content: text, form fields (gds-input, gds-dropdown, gds-checkbox…). Column with 20px gap. |
| `gds-modal__footer` | div | no | `gds-modal__inner` | Sticky footer with actions, right-aligned: secondary/ghost first, primary last. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-modal-overlay--open` | `-overlay` | state | Shows the overlay and animates the modal in (fade + scale). |
| `gds-modal--sm` | `gds-modal` | size | 456px. Confirmations and one or two fields. |
| `gds-modal--md` | `gds-modal` | size (default) | 640px. Short forms. |
| `gds-modal--destructive` | `gds-modal` | variant | Turns the .gds-btn--primary in the footer red (critical colours). For irreversible actions. |
| `gds-modal__header--scrolled` | `__header` | state | Divider under the header. Product JS adds it when the body is scrolled away from the top. |
| `gds-modal__footer--scrolled` | `__footer` | state | Divider above the footer. Product JS adds it while there is more content below. |
| `gds-modal__footer--split` | `__footer` | layout | First action left, the rest right (e.g. "Back" left, "Cancel / Next" right). |

**States:**
- **closed**: gds-modal-overlay without --open (stays in the DOM, invisible and hidden from assistive tech by visibility: hidden), or not rendered.
- **open**: Add gds-modal-overlay--open; then move focus into the modal.
- **scrolled**: Toggle __header--scrolled when __inner scrollTop > 0 and __footer--scrolled while it is not scrolled to the end.

**Accessibility:**
- role="dialog" (or "alertdialog" for destructive), aria-modal="true" and aria-labelledby on .gds-modal, the element that contains the content.
- Destructive modals: role="alertdialog" with aria-describedby on the consequence text.
- The close button has aria-label="Close".
- Product JS: on open move focus into the modal (first field, or Cancel in a destructive modal), keep Tab inside it, close on Escape, make the page behind inert, and return focus to the trigger on close.
- Lock page scroll while open (product JS).

**Rules:**
- .gds-modal has role="dialog" or "alertdialog", aria-modal="true" and aria-labelledby pointing to the id of .gds-modal__title. *Why:* Screen readers then announce a dialog with its title and treat the page behind as unavailable. (Accessible by default · auto-checkable)
- .gds-modal__close is a <button type="button"> with aria-label. *Why:* It shows only an x icon. (Accessible by default · auto-checkable)
- A .gds-modal--destructive uses role="alertdialog" and aria-describedby pointing to .gds-modal__desc, which says what will be lost. *Why:* The consequence is read out together with the title. (Accessible by default · auto-checkable)
- In a destructive modal the confirm button names the action ("Delete entry", "Unpublish"), never "OK" or "Yes". Initial focus goes to Cancel; the backdrop does not close it. *Why:* People confirm by habit; a specific label and a safe default prevent accidents. (Obvious over documented)
- In a .gds-modal--destructive, the confirm button is .gds-btn--primary (the modifier makes it red). Do not add a second primary. *Why:* The modifier only recolours .gds-btn--primary inside the footer. (Reuse before you create · auto-checkable)
- The footer has at most one .gds-btn--primary, placed last. Cancel uses .gds-btn--ghost. *Why:* One clear main action, same order in every dialog. (Obvious over documented · auto-checkable)
- Product JS: on open move focus into the modal (first field, or Cancel in a destructive modal), keep Tab inside it, close on Escape, make the page behind inert, and return focus to the trigger on close. *Why:* Without it keyboard and screen reader users can reach the page behind or get lost after closing. (Accessible by default)
- Use --sm for confirmations, --md (default) for short forms. Anything longer goes in a side panel or a page. *Why:* A modal hides the context; long tasks in it are hard to check and easy to lose. (Obvious over documented)
- Toggle __header--scrolled and __footer--scrolled from the scroll position of __inner. *Why:* Shows that content continues under the sticky header or footer. (Obvious over documented)
- Do not open a modal from inside an open side panel. *Why:* The modal overlay (z-index 1000) renders behind the side panel (1020). (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- z-index: modal overlay is 1000, side panel is 1020. A modal opened from a side panel (delete, discard changes) appears behind it. *Planned fix:* Raise --modal-z-index above --sidepanel-z-index (e.g. a $z-modal token at 1025).
- --destructive re-implements critical button colours on .gds-btn--primary instead of using .gds-btn--critical. *Planned fix:* v3: drop --destructive; footer uses .gds-btn--critical.
- Docs put role="dialog" and aria-modal on the overlay, and the close buttons have no aria-label. *Planned fix:* Move the role to .gds-modal and add aria-label="Close" in the docs.
- __header--scrolled / __footer--scrolled need JS to work. *Planned fix:* CSS scroll-driven animation or scroll shadows.
- Mobile rule uses width: 100% !important and max-height: 100vh (mobile browser bars can cover the footer). *Planned fix:* Drop !important; use 100dvh.
- --modal-scroll-shadow token is defined but not used. *Planned fix:* Remove it or use it for the scroll dividers.

*Generated from `components/modal.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:modal:end -->

---

<!-- gds:component:sidepanel:start -->
### Side panel

A full-height panel that slides in from the right over a dimmed page, for editing or viewing details while the underlying list stays visible.

**Use when:**
- Editing the details of an item picked from a list (entry metadata, SEO fields, tag settings) while the list stays visible behind.
- Viewing details of a row without leaving the page (author profile, asset info, version history).
- Forms that are too long for a modal but do not need their own page.
- Settings or filters that apply to the page behind (--default, 300px).

**Don't use when:**
- A yes/no decision or confirmation → use modal
- Destructive confirmation started from the panel → use an inline confirmation inside the panel (a modal would open behind it, known issue)
- The main editing task of a page (writing the article body) → use a full page
- A short message → use toast or alert

**Example: Edit entry details**
```html
<div class="gds-sidepanel-overlay gds-sidepanel-overlay--open">
  <div class="gds-sidepanel" role="dialog" aria-modal="true" aria-labelledby="entry-panel-title">
    <div class="gds-sidepanel__topbar">
      <span class="gds-sidepanel__topbar-title">Summer festival guide</span>
      <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--xs" aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="gds-sidepanel__content">
      <div class="gds-sidepanel__header">
        <h2 class="gds-sidepanel__title" id="entry-panel-title">Edit details</h2>
        <p class="gds-sidepanel__desc">Changes are saved to the draft. Publish to make them live.</p>
      </div>
      <div class="gds-sidepanel__body">
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="entry-title">Title</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="entry-title" value="Summer festival guide" /></div>
        </div>
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="entry-slug">Slug</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="entry-slug" value="summer-festival-guide" /></div>
          <span class="gds-input__helper">Used in the article URL.</span>
        </div>
      </div>
      <div class="gds-sidepanel__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Cancel</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Save</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Asset details (large, split footer, no header)**
```html
<div class="gds-sidepanel-overlay gds-sidepanel-overlay--open">
  <aside class="gds-sidepanel gds-sidepanel--lg" role="dialog" aria-modal="true" aria-labelledby="asset-panel-title">
    <div class="gds-sidepanel__topbar">
      <span class="gds-sidepanel__topbar-title" id="asset-panel-title">stadium-night.jpg</span>
      <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--xs" aria-label="Close"><i data-lucide="x"></i></button>
    </div>
    <div class="gds-sidepanel__content">
      <div class="gds-sidepanel__body">
        <div class="gds-input gds-input--md">
          <label class="gds-input__label" for="asset-alt">Alt text</label>
          <div class="gds-input__wrap"><input type="text" class="gds-input__field" id="asset-alt" value="Fans in the stadium at night" /></div>
        </div>
      </div>
      <div class="gds-sidepanel__footer gds-sidepanel__footer--split">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--md"><span class="gds-btn__label">Replace file</span></button>
        <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><span class="gds-btn__label">Save</span></button>
      </div>
    </div>
  </aside>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-sidepanel-overlay` | div | yes | top level | Fixed full-screen backdrop; aligns the panel to the right. Hidden until --open. Product JS may close on backdrop click when there are no unsaved changes. |
| `gds-sidepanel` | div \| aside | yes | `gds-sidepanel-overlay` | The panel: full height, white, rounded left corners, slides in from the right. 500px unless a size modifier is set. Full width below 640px (and below its own width for --lg/--xl). Attributes: `role` ("dialog"), `aria-modal` ("true"), `aria-labelledby` (id of .gds-sidepanel__title (or of __topbar-title when there is no header)). |
| `gds-sidepanel__topbar` | div | yes | `gds-sidepanel` | 40px bar with a bottom border: __topbar-title on the left, close button on the right. The close button is a gds-btn-icon gds-btn-icon--ghost gds-btn-icon--xs with aria-label="Close" (no element class of its own). |
| `gds-sidepanel__topbar-title` | span | yes | `gds-sidepanel__topbar` | Small title (14px medium, one line, ellipsis). Names the object being viewed or edited, e.g. the entry title. |
| `gds-sidepanel__content` | div | yes | `gds-sidepanel` | Scroll container (left padding only; children add right padding). Holds header, body and footer. |
| `gds-sidepanel__header` | div | no | `gds-sidepanel__content` | Sticky header with the task title and description. |
| `gds-sidepanel__title` | h2 | no | `gds-sidepanel__header` | Task title (16px medium). Give it an id for aria-labelledby. Attributes: `id` (referenced by aria-labelledby). |
| `gds-sidepanel__desc` | p | no | `gds-sidepanel__header` | Supporting text (14px). |
| `gds-sidepanel__body` | div | yes | `gds-sidepanel__content` | Content: fields, lists, details. Column with 20px gap. |
| `gds-sidepanel__footer` | div | no | `gds-sidepanel__content` | Sticky footer with actions, right-aligned: ghost first, primary last. Must be inside __content (it relies on its left padding). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-sidepanel-overlay--open` | `-overlay` | state | Shows the overlay and slides the panel in. |
| `gds-sidepanel--default` | `gds-sidepanel` | size | 300px. Despite the name it is NOT the default; use for narrow filters or settings. |
| `gds-sidepanel--normal` | `gds-sidepanel` | size (default) | 500px. Same as no modifier. Most edit forms. |
| `gds-sidepanel--lg` | `gds-sidepanel` | size | 850px. Rich details: media, previews, two-column forms. |
| `gds-sidepanel--xl` | `gds-sidepanel` | size | 1170px. Near full-screen work (comparing versions). |
| `gds-sidepanel__header--scrolled` | `__header` | state | Divider under the header. Product JS adds it when __content is scrolled. |
| `gds-sidepanel__footer--scrolled` | `__footer` | state | Divider above the footer. Product JS adds it while there is more content below. |
| `gds-sidepanel__footer--split` | `__footer` | layout | First action left, the rest right (e.g. "Delete" left, "Cancel / Save" right). |

**States:**
- **closed**: gds-sidepanel-overlay without --open (invisible and hidden from assistive tech by visibility: hidden), or not rendered.
- **open**: Add gds-sidepanel-overlay--open; then move focus into the panel.
- **scrolled**: Toggle __header--scrolled when __content scrollTop > 0 and __footer--scrolled while it is not scrolled to the end.

**Accessibility:**
- role="dialog", aria-modal="true" and aria-labelledby on .gds-sidepanel. The overlay blocks the page, so the panel is modal.
- The topbar close button is an icon button with aria-label="Close".
- Product JS: on open move focus to the first field (or the panel title), keep Tab inside the panel, close on Escape, make the page behind inert, and return focus to the trigger on close.
- If there are unsaved changes, ask before closing (product JS); do not lose input on Escape or backdrop click.

**Rules:**
- .gds-sidepanel has role="dialog", aria-modal="true" and aria-labelledby pointing to the panel title. *Why:* Screen readers announce a dialog with its name and ignore the page behind. (Accessible by default · auto-checkable)
- The close button in .gds-sidepanel__topbar is a <button type="button"> with aria-label. *Why:* It shows only an x icon. (Accessible by default · auto-checkable)
- .gds-sidepanel__footer is inside .gds-sidepanel__content. *Why:* The footer has only right padding; outside __content it touches the left edge and does not stick. (Obvious over documented · auto-checkable)
- Leave the size as default (--normal, 500px) for edit forms; --lg/--xl only for media or side-by-side content; --default (300px) only for filters or settings. *Why:* Wider panels hide more of the list the user wants to keep in view. (Obvious over documented)
- __topbar-title names the object ("Summer festival guide"); __title names the task ("Edit details"). If you show only one, label the dialog with it. *Why:* Two similar titles stacked read as a repeat; distinct roles make each useful. (Obvious over documented)
- The footer has at most one .gds-btn--primary, placed last. Cancel uses .gds-btn--ghost. *Why:* One clear main action, same order as in modals. (Obvious over documented · auto-checkable)
- Product JS: on open move focus to the first field (or the panel title), keep Tab inside the panel, close on Escape, make the page behind inert, and return focus to the trigger on close. *Why:* Without it keyboard and screen reader users can reach the page behind or get lost after closing. (Accessible by default)
- Do not open a modal from inside the panel; confirm inside the panel instead. *Why:* The modal (z-index 1000) renders behind the panel (1020). (Obvious over documented)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- --default is 300px, but the real default (no modifier) is 500px (= --normal). *Planned fix:* v3: sizes sm 300 / md 500 / lg 850 / xl 1170, md default; keep old names as aliases for one release.
- Footer placement differs: the SCSS comment and live docs put __footer inside __content; the docs "Show code" puts it after __content, where it has no left padding. *Planned fix:* Fix the docs snippet, or give the footer full padding so both work.
- No close element class (modal has __close); docs use gds-btn-icon--xs without aria-label, while the modal uses --sm --circle. *Planned fix:* Add .gds-sidepanel__close and use the same button style as the modal.
- Two titles (__topbar-title and __title) with no guidance; docs examples use different text in each. *Planned fix:* Agree on their roles (see rule sidepanel-titles) or drop one.
- z-index 1020 is above the modal (1000), so modals opened from a panel are hidden. *Planned fix:* Modal above side panel in the z-index scale.
- Docs put role="dialog" on the overlay instead of the panel. *Planned fix:* Move role/aria-modal/aria-labelledby to .gds-sidepanel in the docs.
- Always modal (backdrop blocks the list); there is no docked, non-modal variant for editing while still using the list. *Planned fix:* v3: optional non-modal panel without overlay.
- height: 100vh can be covered by mobile browser bars; width: 100% !important on mobile. *Planned fix:* Use 100dvh; drop !important.
- --sidepanel-footer-padding and --sidepanel-scroll-shadow tokens are defined but not used. *Planned fix:* Remove them or use them.

*Generated from `components/sidepanel.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:sidepanel:end -->

---

<!-- gds:component:card:start -->
### Card

A container that groups related content and actions, with optional media, header, body and footer.

**Use when:**
- Grouping one object's summary and actions on a dashboard (e.g. an article, a report, a video).
- A grid of items people open, with --interactive (e.g. a media library).
- Picking one option from a few rich choices, with --selected (e.g. a plan or layout picker).

**Don't use when:**
- Many items with the same fields that people compare or sort → use table
- A message that needs attention (success, error, warning) → use alert or toast
- Content that blocks the page until the user acts → use modal
- Only adding space or a border around a section of a form → use a plain layout container, no card

**Example: Article summary with actions**
```html
<article class="gds-card">
  <div class="gds-card__header">
    <h3 class="gds-card__title">Weekly traffic report</h3>
    <p class="gds-card__subtitle">Updated today at 09:00</p>
  </div>
  <div class="gds-card__body">
    <p class="gds-text-body-sm">Page views are up 12% on last week. Sports and Politics drove most of the growth.</p>
  </div>
  <div class="gds-card__footer">
    <button class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Dismiss</span></button>
    <button class="gds-btn gds-btn--primary gds-btn--sm"><span class="gds-btn__label">Open report</span></button>
  </div>
</article>
```

**Example: Interactive media card (whole card is a link)**
```html
<a href="/videos/4821" class="gds-card gds-card--interactive">
  <img class="gds-card__media" src="/thumbs/4821.jpg" alt="" />
  <div class="gds-card__header">
    <h3 class="gds-card__title">Election night highlights</h3>
    <p class="gds-card__subtitle">Video · 4:12 · 2 hours ago</p>
  </div>
</a>
```

**Example: Selected option in a layout picker**
```html
<div role="radiogroup" aria-label="Homepage layout">
  <div class="gds-card gds-card--interactive gds-card--selected gds-card--padded-sm" role="radio" aria-checked="true" tabindex="0">
    <div class="gds-card__header">
      <h3 class="gds-card__title">Hero + grid</h3>
      <p class="gds-card__subtitle">One lead story, six below</p>
    </div>
  </div>
  <div class="gds-card gds-card--interactive gds-card--padded-sm" role="radio" aria-checked="false" tabindex="-1">
    <div class="gds-card__header">
      <h3 class="gds-card__title">River</h3>
      <p class="gds-card__subtitle">Newest stories in one column</p>
    </div>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-card` | article \| div \| a | yes | top level | Wrapper. <article> for a self-contained item, <div> for a panel, <a href> when the whole card opens something (with --interactive). Attributes: `href` (Only on <a>, when the whole card is a link). |
| `gds-card__media` | img \| video \| div | no | `gds-card` | Full-bleed image or video at the top, no padding. Put it first. Attributes: `alt` (On <img>: describe the image, or alt="" if the title already says it all). |
| `gds-card__header` | div \| header | no | `gds-card` | Title and subtitle. Draws a separator below when something follows. |
| `gds-card__title` | h2 \| h3 \| h4 | yes | `gds-card__header` | Card heading. Pick the level that fits the page outline, not the look. |
| `gds-card__subtitle` | p | no | `gds-card__header` | Secondary line under the title (12px, text-secondary). |
| `gds-card__body` | div | no | `gds-card` | Main content. Grows to fill the card height. |
| `gds-card__footer` | div \| footer | no | `gds-card` | Action row, right-aligned. Draws a separator above when something precedes it. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-card--elevated` | `gds-card` | variant | No border, stronger shadow. Use for cards that float above a grey page. |
| `gds-card--flat` | `gds-card` | variant | No border, no shadow, background only. Use for nested or quiet panels. |
| `gds-card--interactive` | `gds-card` | style | Pointer cursor, lift and shadow on hover, focus ring on :focus-visible. Use on an <a href> (or a focusable element that opens something). |
| `gds-card--padded-none` | `gds-card` | size | 0 padding in header, body and footer. |
| `gds-card--padded-sm` | `gds-card` | size | 12px padding. |
| `gds-card--padded-lg` | `gds-card` | size | 24px padding. Without a padding class the card uses 16px. |
| `gds-card--selected` | `gds-card` | state | Inset ring in the focus colour to show the chosen card in a picker. Pair it with a real selected state (aria-checked, aria-pressed or a checked radio). |
| `gds-card--disabled` | `gds-card` | state | Dimmed, blocks pointer events and cancels the interactive hover. Does not block the keyboard: also remove href or set aria-disabled and tabindex="-1". |

**States:**
- **hover**: Native :hover on gds-card--interactive (lift + shadow). Turned off by prefers-reduced-motion.
- **focus**: Native :focus-visible on gds-card--interactive draws a 2px focus ring.
- **selected**: gds-card--selected + aria-checked/aria-pressed or a checked radio inside.
- **disabled**: gds-card--disabled + no href (or aria-disabled="true" and tabindex="-1").

**Accessibility:**
- An interactive card is one link or button. Do not put other buttons or links inside it.
- The card title is a real heading, so people can jump between cards with a screen reader.
- --selected and --disabled are only visual: expose the same state with an attribute.
- Give images alt text, or alt="" when they only repeat the title.

**Rules:**
- .gds-card__title is an <h2>–<h4>, never a <div> or <span>. *Why:* Screen reader users move through a card grid by headings. (Accessible by default · auto-checkable)
- A .gds-card--interactive card contains no <button>, <a> or form control. *Why:* A clickable inside a clickable is a nested interactive element: keyboard and screen readers cannot reach it reliably, and clicks fire twice. (Accessible by default · auto-checkable)
- .gds-card--interactive is on an <a href>, a <button>, or an element with tabindex="0" and a role. *Why:* Hover alone is not an interaction; keyboard users need to reach and open the card. (Accessible by default · auto-checkable)
- .gds-card--selected comes with aria-checked="true", aria-pressed="true", or a checked radio inside the card. *Why:* The ring only shows the choice to sighted users. (Accessible by default · auto-checkable)
- Footer actions use gds-btn, at most one primary, with the primary on the right. *Why:* Same action order as modals and forms across the product. (Reuse before you create)
- Do not build a list of many same-shaped records out of cards; use a table. *Why:* Tables can be scanned, sorted and selected in bulk; card grids cannot. (Reuse before you create)

**Do not use** (exist in the CSS for docs only):
- `is-hover-preview`: Docs and screenshot tests only: freezes the hover look of --interactive.
- `is-focus-preview`: Docs and screenshot tests only: freezes the focus ring of --interactive.

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Subtitle colour is now text-secondary (6.96:1, was 2.96:1 and failed AA). Older screenshots, Figma and brand.md may still show the lighter grey. *Planned fix:* Update Figma and brand.md to text-secondary; keep the contrast note in the token file.
- A card with header and footer but no body draws two separators (header border-bottom + footer border-top), a 2px line. *Planned fix:* Draw only one: e.g. .gds-card__header + .gds-card__footer { border-top: 0; }.
- An <a class="gds-card gds-card--interactive"> keeps link underline and colour; the docs fix it with inline style="display:block;text-decoration:none". *Planned fix:* Add text-decoration: none; color: inherit; to .gds-card--interactive and drop the inline styles from the docs.
- --disabled only blocks the mouse (pointer-events: none). A disabled link card can still be focused and opened with Enter. *Planned fix:* Document removing href / tabindex="-1"; v3: also style [aria-disabled="true"].
- --selected uses the same colour and width as the focus ring, so a selected card looks focused and focus on it is hard to see. *Planned fix:* Give selected its own token (e.g. border-brand + check icon) different from border-focus.

*Generated from `components/card.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:card:end -->

---

<!-- gds:component:skeleton:start -->
### Skeleton

Grey shimmering shapes that stand in for content while it loads, so the layout does not jump.

**Use when:**
- First load of a page or card whose layout is known (article list, profile header, dashboard card).
- Loading takes long enough to notice (about 300ms or more).

**Don't use when:**
- A table is loading → use table with gds-table--loading and gds-table__skeleton
- An action the user just triggered (save, upload, publish) → use button loading state or a spinner
- The layout of the result is unknown or loading is very short → use spinner, or nothing
- There is no data (not loading) → use empty state

**Example: Article list item loading**
```html
<div aria-busy="true">
  <span class="gds-sr-only">Loading articles</span>
  <div class="gds-skeleton-group gds-skeleton-group--row" aria-hidden="true">
    <div class="gds-skeleton gds-skeleton--avatar-lg"></div>
    <div class="gds-skeleton-group">
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--text-xl gds-skeleton--w-50"></div>
      <div class="gds-skeleton gds-skeleton--text"></div>
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--w-75"></div>
    </div>
  </div>
</div>
```

**Example: Card with image loading**
```html
<article class="gds-card" aria-busy="true">
  <span class="gds-sr-only">Loading video</span>
  <div class="gds-card__body">
    <div class="gds-skeleton-group" aria-hidden="true">
      <div class="gds-skeleton gds-skeleton--rect"></div>
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--text-lg gds-skeleton--w-75"></div>
      <div class="gds-skeleton gds-skeleton--text gds-skeleton--w-25"></div>
    </div>
  </div>
</article>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-skeleton-group` | div | no | top level | Stacks skeletons in a column (or a row with --row) with the standard gap. Hide it from screen readers. Attributes: `aria-hidden` (true). |
| `gds-skeleton` | div \| span | yes, repeats | top level | One placeholder shape. Full width, rectangle by default. Use a shape modifier to say what it stands for. Attributes: `aria-hidden` (true (unless its group already has it)). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-skeleton--text` | `gds-skeleton` | variant | A line of text: pill radius, body-sm height. |
| `gds-skeleton--rect` | `gds-skeleton` | variant (default) | Rectangle for an image or hero. Same as the bare class; write it for clarity. |
| `gds-skeleton--circle` | `gds-skeleton` | variant | Circle, avatar-md size unless you set width and height. |
| `gds-skeleton--row` | `gds-skeleton` | variant | Full-width bar at data-table row height. |
| `gds-skeleton--avatar-sm` | `gds-skeleton` | variant | Circle at avatar sm size. |
| `gds-skeleton--avatar-md` | `gds-skeleton` | variant | Circle at avatar md size. |
| `gds-skeleton--avatar-lg` | `gds-skeleton` | variant | Circle at avatar lg size. |
| `gds-skeleton--avatar-xl` | `gds-skeleton` | variant | Circle at avatar xl size. |
| `gds-skeleton--text-sm` | `gds-skeleton` | size | Text line height for small text. Sets only the height: add --text for the pill shape. Requires `gds-skeleton--text`. |
| `gds-skeleton--text-md` | `gds-skeleton` | size (default) | Body-sm line height (same as --text alone). Requires `gds-skeleton--text`. |
| `gds-skeleton--text-lg` | `gds-skeleton` | size | Large text line height. Requires `gds-skeleton--text`. |
| `gds-skeleton--text-xl` | `gds-skeleton` | size | Heading line height. Requires `gds-skeleton--text`. |
| `gds-skeleton--text-2xl` | `gds-skeleton` | size | Large heading line height. Requires `gds-skeleton--text`. |
| `gds-skeleton--w-25` | `gds-skeleton` | width | 25% width. |
| `gds-skeleton--w-50` | `gds-skeleton` | width | 50% width. |
| `gds-skeleton--w-75` | `gds-skeleton` | width | 75% width. Use on the last line of a paragraph. |
| `gds-skeleton-group--row` | `-group` | layout | Lays skeletons out in a row, vertically centred (e.g. avatar next to text lines). |

**States:**
- **loading**: Skeletons are shown; the region they sit in has aria-busy="true".
- **loaded**: Replace the skeletons with the real content and set aria-busy="false" (or remove it).
- **reduced motion**: prefers-reduced-motion stops the shimmer and shows a static, dimmed shape. Automatic.

**Accessibility:**
- Skeletons are decorative: aria-hidden="true" on the group or on each skeleton.
- Set aria-busy="true" on the region that is loading, and give it a short text for screen readers (e.g. <span class="gds-sr-only">Loading articles</span>).
- When loading ends, remove aria-busy so the new content is read.

**Rules:**
- Every .gds-skeleton has aria-hidden="true" itself or on an ancestor. *Why:* Otherwise screen readers find empty, meaningless elements. (Accessible by default · auto-checkable)
- Skeletons sit inside an element with aria-busy="true" that also contains loading text for screen readers. *Why:* Screen reader users must know the page is loading, not empty. (Accessible by default · auto-checkable)
- The skeleton copies the shape of the content it replaces: same number of lines, avatar size, image ratio. *Why:* The page should not jump when content arrives. (Obvious over documented)
- Do not use .gds-skeleton inside .gds-table; use gds-table--loading and gds-table__skeleton. *Why:* The table has its own loading pattern sized to its cells. (Reuse before you create · auto-checkable)
- A --text-sm/md/lg/xl/2xl line also has --text. *Why:* The size classes set only the height; without --text the line has square corners. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- --text-sm/lg/xl/2xl set only the height. Alone they give a square-cornered bar; the docs use --text-xl without --text. *Planned fix:* Move the pill radius into each --text-* class (or document the pair) and fix the docs examples.
- --row says it matches .gds-data-table rows, a class that no longer exists; the table also has its own gds-table__skeleton. *Planned fix:* Point --row at the gds-table row height, or remove it in favour of gds-table__skeleton.
- --rect is identical to the bare class, and --circle overlaps the --avatar-* presets. *Planned fix:* v3: keep one way: e.g. --circle + avatar size tokens, and drop --rect or make it the documented default.
- No helper for the screen-reader loading text; every product must remember aria-busy and an sr-only label. *Planned fix:* Document the pattern in the docs page and show it in every example.

*Generated from `components/skeleton.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:skeleton:end -->

---

<!-- gds:component:tooltip:start -->
### Tooltip

A small dark label that appears on hover or keyboard focus of a control, CSS only.

**Use when:**
- Naming an icon-only button in a toolbar (Bold, Insert image, Preview).
- A short, non-essential hint about what a control does ("Saves your draft locally").
- Showing the keyboard shortcut of an action (Save · ⌘S).

**Don't use when:**
- Content with links or buttons, or anything people need to read carefully → use popover
- Information needed to complete the task (format rules, errors) → use input helper text or alert
- A list of actions → use menu
- Truncated table text that people need to read → use wider column, wrapping, or a detail view

**Example: Icon-only toolbar button**
```html
<span class="gds-tooltip">
  <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--md" aria-label="Insert image" aria-describedby="tip-insert-image"><i data-lucide="image-plus"></i></button>
  <span id="tip-insert-image" class="gds-tooltip__bubble gds-tooltip__bubble--bottom" role="tooltip">Insert image from the media library</span>
</span>
```

**Example: With keyboard shortcut**
```html
<span class="gds-tooltip">
  <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm" aria-describedby="tip-save-draft" aria-keyshortcuts="Meta+S"><span class="gds-btn__label">Save draft</span></button>
  <span id="tip-save-draft" class="gds-tooltip__bubble" role="tooltip">Save draft<kbd class="gds-tooltip__kbd">⌘S</kbd></span>
</span>
```

**Example: Longer hint (multiline)**
```html
<span class="gds-tooltip">
  <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm" aria-label="About canonical URL" aria-describedby="tip-canonical"><i data-lucide="info"></i></button>
  <span id="tip-canonical" class="gds-tooltip__bubble gds-tooltip__bubble--right gds-tooltip__bubble--md gds-tooltip__bubble--multiline" role="tooltip">Tells search engines which URL is the original when the same article is published in several places.</span>
</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-tooltip` | span | yes | top level | Inline wrapper (position: relative, inline-flex) around the trigger and the bubble. The trigger is a focusable element (button, link) placed first; the bubble shows on :hover or :focus-within. |
| `gds-tooltip__bubble` | span | yes | `gds-tooltip` | The label. Must be the last child of the wrapper. Dark surface, 12px text, no line wrap by default, arrow drawn with ::after. Above the trigger when no placement modifier is set. Attributes: `role` (tooltip), `id` (Unique; referenced by aria-describedby on the trigger). |
| `gds-tooltip__kbd` | kbd | no | `gds-tooltip__bubble` | Keyboard shortcut chip after the label text (e.g. ⌘S). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-tooltip__bubble--top` | `__bubble` | layout (default) | Above the trigger. |
| `gds-tooltip__bubble--bottom` | `__bubble` | layout | Below the trigger. |
| `gds-tooltip__bubble--left` | `__bubble` | layout | Left of the trigger. |
| `gds-tooltip__bubble--right` | `__bubble` | layout | Right of the trigger. |
| `gds-tooltip__bubble--sm` | `__bubble` | size (default) | Max width 240px (short label). |
| `gds-tooltip__bubble--md` | `__bubble` | size | Max width 290px (one sentence). Use with --multiline. |
| `gds-tooltip__bubble--lg` | `__bubble` | size | Max width 380px (two short sentences). Use with --multiline. |
| `gds-tooltip__bubble--multiline` | `__bubble` | content | Lets text wrap at the max width (default is one line, no wrap). |
| `gds-tooltip__bubble--interactive` | `__bubble` | content | Turns pointer events back on so links inside can be clicked. Avoid: see rules and known issues. |

**States:**
- **hidden**: Default. opacity 0 + visibility hidden.
- **visible**: Native :hover or :focus-within on .gds-tooltip, after --tooltip-delay-show (no delay with reduced motion).
- **forced open**: Add is-open to .gds-tooltip (docs and JS-controlled tooltips). is-open is a shared global class, so it is not listed as a modifier here (see known issues).

**Accessibility:**
- Bubble: role="tooltip" and a unique id. Trigger: aria-describedby="<bubble id>".
- The trigger must be focusable so keyboard users get the tooltip on focus (:focus-within).
- An icon-only trigger needs its own aria-label; the tooltip describes, it does not name.
- Never put the only copy of important information in a tooltip: touch screens have no hover.
- The bubble ignores the pointer by default and closes when focus or pointer leaves; it cannot be dismissed with Escape (CSS only).

**Rules:**
- The bubble has role="tooltip" and an id; the trigger inside the same wrapper has aria-describedby with that id. *Why:* Without the link, screen reader users never hear the tooltip. (Accessible by default · auto-checkable)
- The first child of .gds-tooltip is a focusable element (button, a[href], input). *Why:* The bubble shows on :focus-within; a span or icon trigger never gets focus, so keyboard users never see it. (Accessible by default · auto-checkable)
- An icon-only trigger has its own aria-label, even with a tooltip. *Why:* aria-describedby adds a description, not a name; the button would be announced as just "button". (Accessible by default · auto-checkable)
- The bubble is the last child of .gds-tooltip. *Why:* The show selector uses the child combinator and the stacking assumes the bubble comes after the trigger. (Obvious over documented · auto-checkable)
- No links or buttons inside the bubble; do not use --interactive. Use a popover for interactive content. *Why:* role="tooltip" must not contain controls, and a hover-only surface is hard to reach with keyboard, touch and screen readers. (Accessible by default · auto-checkable)
- Keep tooltip text to one short phrase. Longer text needs --multiline (and --md or --lg); more than two sentences belongs in a popover or on the page. *Why:* Without --multiline the text does not wrap and runs past the bubble; long tooltips disappear before people finish reading. (Obvious over documented)
- Tooltips hold only extra help. Labels, errors and rules people need go in visible text. *Why:* Touch screens cannot hover, and the tooltip is hidden by default. (Accessible by default)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- WCAG 1.4.13 (content on hover or focus): the CSS-only bubble cannot be dismissed with Escape, and with pointer-events: none it closes when the pointer moves onto it. *Planned fix:* Add a tooltip mode to the ds-core controller (Escape to close, hoverable bubble), and keep the CSS version for simple labels.
- --interactive puts links inside an element with role="tooltip", which ARIA does not allow, and the docs show it as a supported pattern. *Planned fix:* Deprecate --interactive; point to popover.
- Placement is pure CSS: no flip near the viewport edges, only the width is clamped. Bubbles near the top or a scrolling container edge get cut off. *Planned fix:* Use createPopover() with role "tooltip" for flip / shift, or CSS anchor positioning later.
- The size modifiers only set max-width, but the default white-space: nowrap means they have no visible effect without --multiline. *Planned fix:* v3: wrap by default; drop --multiline.
- is-open (forced open) breaks the BEM naming rule and is also used by the table action-cell dropdown, so it cannot belong to one contract. *Planned fix:* v3: gds-tooltip--open.
- Placement uses physical left / right, so --left and --right do not flip in right-to-left layouts. *Planned fix:* Use logical properties (inset-inline-start / end) and name the modifiers --start / --end.

*Generated from `components/tooltip.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:tooltip:end -->

---

<!-- gds:component:popover:start -->
### Popover

A generic floating surface anchored to a trigger, for interactive content such as a small form, a calendar or a menu.

**Use when:**
- Interactive content that belongs to one control and should not leave the page context (embed code with a Copy button, quick edit of a title, column settings).
- Hosting another component that has to float: the date picker calendar.
- Content that must escape a clipping container (table cell, modal, scrolling panel).

**Don't use when:**
- A short, non-interactive hint on hover or focus → use tooltip
- A list of actions (Edit, Duplicate, Delete) → use menu
- Choosing a value from a list → use dropdown
- A task that needs full attention or a confirmation (Delete article?) → use modal

**Example: Embed code (open)**
```html
<button type="button" class="gds-btn gds-btn--secondary gds-btn--sm" aria-haspopup="dialog" aria-controls="embed-popover" aria-expanded="true"><span class="gds-btn__label">Embed</span></button>
<div id="embed-popover" class="gds-popover gds-popover--open" role="dialog" aria-label="Embed code">
  <div class="gds-popover__content">
    <div class="gds-input gds-input--sm">
      <label class="gds-input__label" for="embed-code">Embed code</label>
      <div class="gds-input__wrap">
        <input id="embed-code" class="gds-input__field" value="&lt;iframe src=&quot;https://vp.gjirafa.net/embed/8f3k2&quot;&gt;&lt;/iframe&gt;" readonly />
      </div>
    </div>
    <button type="button" class="gds-btn gds-btn--secondary gds-btn--sm"><span class="gds-btn__label">Copy code</span></button>
  </div>
</div>
```

**Example: Closed, with arrow**
```html
<button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-haspopup="dialog" aria-controls="seo-popover" aria-expanded="false"><span class="gds-btn__label">SEO preview</span></button>
<div id="seo-popover" class="gds-popover" role="dialog" aria-label="SEO preview">
  <div class="gds-popover__content">
    <p>Kosovo wins the regional cup | Gjirafa News</p>
  </div>
  <div class="gds-popover__arrow" aria-hidden="true"></div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-popover` | div | yes | top level | The surface: light background, border, radius, shadow, max-height with scroll. position: fixed by default; the createPopover() controller writes top / left inline. Hidden (opacity + visibility) until --open. Attributes: `id` (Referenced by aria-controls on the trigger), `role` (dialog (default) \| menu \| listbox \| grid, set by the controller from its role option), `aria-label` (Name of the surface, e.g. "Embed code" (or aria-labelledby a heading inside)), `aria-modal` ("true" only in modal mode (controller)). |
| `gds-popover__content` | div | no | `gds-popover` | Padding wrapper (--popover-padding). Leave it out when the content brings its own spacing (e.g. .gds-calendar). |
| `gds-popover__arrow` | div | no | `gds-popover` | Optional decorative diamond pointing at the trigger. The controller positions it (arrow option). Attributes: `aria-hidden` (true). |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-popover--open` | `gds-popover` | state | Visible. Toggled by the controller together with aria-expanded on the trigger. |

**States:**
- **open**: gds-popover--open on the surface + aria-expanded="true" on the trigger (both set by createPopover()).
- **closed**: No --open. The element stays in the DOM (it fades out and Floating UI can measure it).

**Accessibility:**
- Trigger: a <button> with aria-haspopup (matching the role), aria-controls = popover id and aria-expanded. createPopover() sets all three.
- Surface: a role (dialog by default) and an accessible name (aria-label or aria-labelledby).
- Escape and outside click close it; focus moves into the surface on open and back to the trigger on close (controller).
- Modal mode traps focus and makes the background inert; use it only when the popover must be finished before going on.
- Reduced motion: the open / close transition snaps. Forced colours: the border stays visible.

**Rules:**
- The trigger has aria-haspopup, aria-controls pointing to the popover id, and aria-expanded matching gds-popover--open. *Why:* Screen readers announce that the button opens something and whether it is open. (Accessible by default · auto-checkable)
- A .gds-popover with role="dialog" has aria-label or aria-labelledby. *Why:* An unnamed dialog is announced as just "dialog". (Accessible by default · auto-checkable)
- .gds-popover__arrow has aria-hidden="true". *Why:* It is decoration only. (Accessible by default · auto-checkable)
- Position, open and dismiss the popover with createPopover() from @gjirafa/ds-core; do not hand-write top / left. *Why:* The controller handles flip, shift, scroll, portal out of clipping parents, Escape and focus return; the CSS alone puts the surface at the top-left of the viewport. (Reuse before you create)
- Wrap plain content in __content; put components with their own padding (.gds-calendar) directly in .gds-popover. *Why:* Otherwise the padding is doubled. (Obvious over documented · auto-checkable)
- Use a popover for interactive content opened by a click; use a tooltip for short text on hover or focus. *Why:* A popover takes focus and needs a click to open; a tooltip must never hold controls. (Reuse before you create)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- .gds-calendar-popover duplicates this surface (same border, radius, shadow) with its own absolute positioning. *Planned fix:* Rebuild .gds-calendar-popover on .gds-popover (already planned in the popover docs).
- .gds-menu and .gds-dropdown__panel carry their own background, border and shadow. Putting them in a .gds-popover draws two frames. *Planned fix:* v3: menu and dropdown panel take their surface from .gds-popover (or get a flat variant).
- Without the controller the surface is position: fixed with no coordinates, so it shows at the top-left of the viewport. *Planned fix:* Document the controller as required; later add CSS anchor positioning as a fallback.
- The arrow is a rotated square in the surface colour with no border, while the surface has a 1px border. The arrow may look cut off from the frame. Needs a visual check. *Planned fix:* Give the arrow the same border on its two outer sides.
- Open state naming differs across overlays: gds-popover--open, gds-dropdown--open, gds-calendar-popover--open, and is-open on the tooltip and the table action menu. *Planned fix:* v3: one convention for every overlay (e.g. --open on the surface).

*Generated from `components/popover.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:popover:end -->

---

<!-- gds:component:calendar:start -->
### Calendar / Date picker

A month grid for picking a date (and optionally a time), shown inline or in a popover under a date field.

**Use when:**
- Picking one date where the weekday or nearby dates matter (publish date, embargo date, report day).
- Picking a date and time together (scheduled publish).
- Offering product-defined shortcuts next to the grid (advanced layout with presets: "30 days from first upload").

**Don't use when:**
- A date people know by heart and type faster (date of birth) → use input with a date format hint
- A relative period for a report (Last 7 days, This month) → use dropdown with period options
- Showing scheduled content over weeks or months → use a dedicated schedule view, not the picker grid

**Example: Publish date picker (open, November 2026)**
```html
<div class="gds-datepicker">
  <div class="gds-input gds-input--md">
    <label class="gds-input__label" for="publish-date">Publish date</label>
    <div class="gds-input__wrap">
      <input id="publish-date" class="gds-input__field" value="18/11/2026" readonly role="combobox" aria-haspopup="dialog" aria-expanded="true" aria-controls="publish-date-cal" />
      <i data-lucide="calendar" class="gds-input__icon"></i>
    </div>
  </div>
  <div id="publish-date-cal" class="gds-calendar-popover gds-calendar-popover--open" role="dialog" aria-label="Choose publish date">
    <div class="gds-calendar">
      <div class="gds-calendar__header">
        <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-calendar__nav" aria-label="Previous month"><i data-lucide="chevron-left"></i></button>
        <h2 class="gds-calendar__title">November 2026</h2>
        <button type="button" class="gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm gds-calendar__nav" aria-label="Next month"><i data-lucide="chevron-right"></i></button>
      </div>
      <div class="gds-calendar__grid-wrap" role="grid" aria-label="November 2026">
        <div class="gds-calendar__weekdays" role="row"><span class="gds-calendar__weekday" role="columnheader" aria-label="Monday">Mo</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Tuesday">Tu</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Wednesday">We</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Thursday">Th</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Friday">Fr</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Saturday">Sa</span><span class="gds-calendar__weekday" role="columnheader" aria-label="Sunday">Su</span></div>
        <div class="gds-calendar__grid" role="rowgroup">
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Monday, 26 October 2026" tabindex="-1" aria-disabled="true" disabled>26</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Tuesday, 27 October 2026" tabindex="-1" aria-disabled="true" disabled>27</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Wednesday, 28 October 2026" tabindex="-1" aria-disabled="true" disabled>28</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Thursday, 29 October 2026" tabindex="-1" aria-disabled="true" disabled>29</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Friday, 30 October 2026" tabindex="-1" aria-disabled="true" disabled>30</button>
            <button class="gds-calendar__day gds-calendar__day--outside gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Saturday, 31 October 2026" tabindex="-1" aria-disabled="true" disabled>31</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Sunday, 1 November 2026" tabindex="-1" aria-disabled="true" disabled>1</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Monday, 2 November 2026" tabindex="-1" aria-disabled="true" disabled>2</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Tuesday, 3 November 2026" tabindex="-1" aria-disabled="true" disabled>3</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Wednesday, 4 November 2026" tabindex="-1" aria-disabled="true" disabled>4</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Thursday, 5 November 2026" tabindex="-1" aria-disabled="true" disabled>5</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Friday, 6 November 2026" tabindex="-1" aria-disabled="true" disabled>6</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Saturday, 7 November 2026" tabindex="-1" aria-disabled="true" disabled>7</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Sunday, 8 November 2026" tabindex="-1" aria-disabled="true" disabled>8</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Monday, 9 November 2026" tabindex="-1" aria-disabled="true" disabled>9</button>
            <button class="gds-calendar__day gds-calendar__day--disabled" type="button" role="gridcell" aria-label="Tuesday, 10 November 2026" tabindex="-1" aria-disabled="true" disabled>10</button>
            <button class="gds-calendar__day gds-calendar__day--today" type="button" role="gridcell" aria-label="Wednesday, 11 November 2026" tabindex="-1" aria-current="date">11</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Thursday, 12 November 2026" tabindex="-1">12</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Friday, 13 November 2026" tabindex="-1">13</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Saturday, 14 November 2026" tabindex="-1">14</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Sunday, 15 November 2026" tabindex="-1">15</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Monday, 16 November 2026" tabindex="-1">16</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Tuesday, 17 November 2026" tabindex="-1">17</button>
            <button class="gds-calendar__day gds-calendar__day--selected" type="button" role="gridcell" aria-label="Wednesday, 18 November 2026" tabindex="0" aria-selected="true">18</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Thursday, 19 November 2026" tabindex="-1">19</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Friday, 20 November 2026, 2 articles scheduled" tabindex="-1">20<span class="gds-calendar__day-dot"></span></button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Saturday, 21 November 2026" tabindex="-1">21</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Sunday, 22 November 2026" tabindex="-1">22</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Monday, 23 November 2026" tabindex="-1">23</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Tuesday, 24 November 2026" tabindex="-1">24</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Wednesday, 25 November 2026" tabindex="-1">25</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Thursday, 26 November 2026" tabindex="-1">26</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Friday, 27 November 2026" tabindex="-1">27</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Saturday, 28 November 2026" tabindex="-1">28</button>
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Sunday, 29 November 2026" tabindex="-1">29</button>
          </div>
          <div class="gds-calendar__week" role="row">
            <button class="gds-calendar__day" type="button" role="gridcell" aria-label="Monday, 30 November 2026" tabindex="-1">30</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Tuesday, 1 December 2026" tabindex="-1">1</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Wednesday, 2 December 2026" tabindex="-1">2</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Thursday, 3 December 2026" tabindex="-1">3</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Friday, 4 December 2026" tabindex="-1">4</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Saturday, 5 December 2026" tabindex="-1">5</button>
            <button class="gds-calendar__day gds-calendar__day--outside" type="button" role="gridcell" aria-label="Sunday, 6 December 2026" tabindex="-1">6</button>
          </div>
        </div>
      </div>
      <div class="gds-sr-only" aria-live="polite" aria-atomic="true"></div>
      <div class="gds-calendar__footer">
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Select today's date"><span class="gds-btn__label">Today</span></button>
        <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Clear selected date"><span class="gds-btn__label">Clear</span></button>
      </div>
    </div>
  </div>
</div>
```

**Example: Time only (embargo time)**
```html
<div class="gds-calendar" role="group" aria-label="Embargo time">
  <div class="gds-calendar__time gds-calendar__time--bare">
    <div class="gds-time-stepper">
      <div class="gds-time-stepper__unit">
        <input class="gds-time-stepper__field" type="text" inputmode="numeric" maxlength="2" value="09" role="spinbutton" aria-label="Hours" aria-valuemin="0" aria-valuemax="23" aria-valuenow="9" />
        <span class="gds-time-stepper__spin">
          <button type="button" class="gds-time-stepper__btn gds-time-stepper__btn--up" aria-label="Increment hours"><i data-lucide="chevron-up"></i></button>
          <button type="button" class="gds-time-stepper__btn" aria-label="Decrement hours"><i data-lucide="chevron-down"></i></button>
        </span>
      </div>
      <span class="gds-time-stepper__separator">:</span>
      <div class="gds-time-stepper__unit">
        <input class="gds-time-stepper__field" type="text" inputmode="numeric" maxlength="2" value="30" role="spinbutton" aria-label="Minutes" aria-valuemin="0" aria-valuemax="59" aria-valuenow="30" />
        <span class="gds-time-stepper__spin">
          <button type="button" class="gds-time-stepper__btn gds-time-stepper__btn--up" aria-label="Increment minutes"><i data-lucide="chevron-up"></i></button>
          <button type="button" class="gds-time-stepper__btn" aria-label="Decrement minutes"><i data-lucide="chevron-down"></i></button>
        </span>
      </div>
    </div>
  </div>
  <div class="gds-calendar__footer">
    <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Set the current time"><span class="gds-btn__label">Now</span></button>
    <button type="button" class="gds-btn gds-btn--ghost gds-btn--sm" aria-label="Clear selected time"><span class="gds-btn__label">Clear</span></button>
  </div>
</div>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-datepicker` | div | no | top level | Wrapper for the CSS-only date picker: position: relative anchor for .gds-calendar-popover, full width. Holds a .gds-input trigger and the popover. Not used when the ds-core createDatePicker() renders the picker (it portals a .gds-popover instead). |
| `gds-calendar-popover` | div | no | `gds-datepicker` | Floating surface under the trigger (bottom-start, absolute). Hidden until --open. The product toggles it and handles collisions. Attributes: `id` (Referenced by aria-controls on the trigger), `role` (dialog), `aria-label` (e.g. "Choose publish date"). |
| `gds-calendar` | div | yes | top level | The calendar body: header → grid → time → footer in a column. Can sit in .gds-calendar-popover, in a .gds-popover, or inline on the page. |
| `gds-calendar__main` | div | no | `gds-calendar` | Advanced layout only: left column that holds header, grid, time and footer next to __presets. |
| `gds-calendar__header` | div | no | `gds-calendar` or `gds-calendar__main` | Row: previous button, title, next button. Present in date and date-time modes; left out in time-only mode. |
| `gds-calendar__nav` | button | yes, repeats | `gds-calendar__header` | Previous / next month. Put it on a .gds-btn-icon gds-btn-icon--ghost gds-btn-icon--sm with a chevron-left / chevron-right icon. Attributes: `type` (button), `aria-label` ("Previous month" / "Next month"). |
| `gds-calendar__title` | h2 \| div | yes | `gds-calendar__header` | Month and year, e.g. "November 2026". Plain text, or __title-select + __title-year. |
| `gds-calendar__title-select` | button | no | `gds-calendar__title` | Month picker affordance ("June" + chevron). Looks like a select; the behaviour is the product's. Attributes: `type` (button), `aria-label` (e.g. "Choose month"). |
| `gds-calendar__title-year` | span | no | `gds-calendar__title` | Year next to __title-select. |
| `gds-calendar__grid-wrap` | div | no | `gds-calendar` or `gds-calendar__main` | Carries role="grid" so the weekday row and the day rows are valid grid children. display: contents, so it does not affect layout. Required whenever the month grid is shown. Attributes: `role` (grid), `aria-label` (Month and year, e.g. "November 2026"). |
| `gds-calendar__weekdays` | div | yes | `gds-calendar__grid-wrap` | Weekday header row, 7 columns. Attributes: `role` (row). |
| `gds-calendar__weekday` | span | yes, repeats | `gds-calendar__weekdays` | Short weekday name (uppercase). 7 of them, in the locale's week order. Attributes: `role` (columnheader), `aria-label` (Full weekday name when the text is abbreviated). |
| `gds-calendar__grid` | div | yes | `gds-calendar__grid-wrap` | 7 × 6 grid of days. Always reserves 6 rows so the popover does not jump between months. Attributes: `role` (rowgroup). |
| `gds-calendar__week` | div | yes, repeats | `gds-calendar__grid` | One week (6 per month). display: contents, so the days stay direct grid items. Attributes: `role` (row). |
| `gds-calendar__day` | button | yes, repeats | `gds-calendar__week` | One day: the day number. 7 per week; adjacent-month days fill the first and last weeks with --outside. Attributes: `type` (button), `role` (gridcell), `aria-label` (Full date, e.g. "Wednesday, 18 November 2026"), `tabindex` (0 on exactly one day (selected, else focused / first enabled), -1 on the rest), `aria-selected` ("true" on the selected day), `aria-current` ("date" on today), `aria-disabled` ("true" (plus disabled) on unavailable days). |
| `gds-calendar__day-dot` | span | no | `gds-calendar__day` | Small dot under the number: the day has events (e.g. scheduled articles). Decorative; say it in the day's aria-label too. |
| `gds-calendar__time` | div | no | `gds-calendar` or `gds-calendar__main` | Time row under the grid (date-time and time-only modes), with a divider on top. |
| `gds-calendar__time-label` | span | no | `gds-calendar__time` | "Time" label before the stepper (date-time mode). |
| `gds-time-stepper` | div | yes | `gds-calendar__time` | HH : MM control: two __unit segments and a __separator. |
| `gds-time-stepper__unit` | div | yes, repeats | `gds-time-stepper` | Bordered segment: number field + spin column. Shows the focus colour on its border when the field is focused. |
| `gds-time-stepper__field` | input | yes | `gds-time-stepper__unit` | Two-digit hour or minute. Arrow Up / Down step the value (product or ds-core JS). Attributes: `type` (text), `inputmode` (numeric), `maxlength` (2), `role` (spinbutton), `aria-label` ("Hours" / "Minutes"), `aria-valuemin` (0), `aria-valuemax` (23 / 59), `aria-valuenow` (Current value). |
| `gds-time-stepper__spin` | span | no | `gds-time-stepper__unit` | Column with the up and down buttons. |
| `gds-time-stepper__btn` | button | yes, repeats | `gds-time-stepper__spin` | Up (first, with --up) or down (second) step button with a chevron icon. Attributes: `type` (button), `aria-label` (e.g. "Increment hours" / "Decrement hours"). |
| `gds-time-stepper__separator` | span | no | `gds-time-stepper` | The ":" between hours and minutes. |
| `gds-calendar__footer` | div | no | `gds-calendar` or `gds-calendar__main` | Bottom row with .gds-btn gds-btn--ghost gds-btn--sm actions (Today / Now, Clear, Apply). Ghost buttons here are recoloured to the action colour. |
| `gds-calendar__presets` | div | no | `gds-calendar` | Advanced layout only: right column with __presets-title and a .gds-menu of shortcuts. Stacks under the calendar below 640px. Attributes: `role` (group), `aria-label` (e.g. "Shortcuts"). |
| `gds-calendar__presets-title` | p | no | `gds-calendar__presets` | Title of the presets column. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|
| `gds-calendar-popover--open` | `-popover` | state | Shows the popover (fade + slide). Set aria-expanded="true" on the trigger. |
| `gds-calendar-popover--align-end` | `-popover` | layout | Aligns the popover to the end edge of the trigger instead of the start. |
| `gds-calendar--compact` | `gds-calendar` | size | Smaller day cells (re-points --calendar-day-size). |
| `gds-calendar--advanced` | `gds-calendar` | layout | Two columns: __main (calendar) and __presets. Needs both children. |
| `gds-calendar__day--outside` | `__day` | state | Day from the previous / next month. Muted colour. |
| `gds-calendar__day--today` | `__day` | state | Today: inset ring + medium weight (not colour only). Add aria-current="date". |
| `gds-calendar__day--selected` | `__day` | state | Selected day: action-colour fill. Add aria-selected="true". |
| `gds-calendar__day--in-range` | `__day` | state | Day between range start and end: tinted band that bridges the grid gap. |
| `gds-calendar__day--range-start` | `__day` | state | First day of a range: filled disc, band reaches inward. |
| `gds-calendar__day--range-end` | `__day` | state | Last day of a range: filled disc, band reaches inward. |
| `gds-calendar__day--disabled` | `__day` | state | Unavailable day (before min, after max, blocked). Wins over every other state. Also set disabled and aria-disabled="true". |
| `gds-calendar__time--bare` | `__time` | style | No divider and no top padding: for a time-only panel. |
| `gds-time-stepper__btn--up` | `gds-time-stepper__btn` | layout | The up button: adds the divider line under it. The down button has no modifier. |

**States:**
- **open**: gds-calendar-popover--open on the popover + aria-expanded="true" on the trigger (or the ds-core controller adds gds-popover--open).
- **selected**: gds-calendar__day--selected + aria-selected="true" + tabindex="0".
- **today**: gds-calendar__day--today + aria-current="date".
- **disabled day**: gds-calendar__day--disabled + disabled + aria-disabled="true".
- **range**: --range-start, --in-range and --range-end on the days of the range (no ds-core support yet).
- **focused day**: Native :focus ring on the day that has tabindex="0"; arrow keys move it (JS).

**Accessibility:**
- Grid structure: __grid-wrap role="grid" (aria-label = month) > __weekdays role="row" > __weekday role="columnheader", and __grid role="rowgroup" > __week role="row" > __day role="gridcell".
- Days are <button>s with a full-date aria-label. Exactly one day has tabindex="0" (roving tabindex); arrow keys move by day / week, Page Up / Down by month (JS).
- Selected: aria-selected="true". Today: aria-current="date". Disabled: disabled + aria-disabled="true".
- Prev / next buttons need aria-label. Announce month changes in a visually hidden aria-live="polite" region (.gds-sr-only).
- The popover is role="dialog" with an aria-label; the trigger field gets role="combobox", aria-haspopup="dialog", aria-expanded and aria-controls. Escape closes and focus returns to the field.
- Today is shown with a ring + bold number, not colour alone. Forced-colours mode maps states to system colours.
- Time fields are role="spinbutton" with aria-valuemin / max / now and an aria-label.

**Rules:**
- Wrap weekdays and weeks in __grid-wrap role="grid"; every __day sits in a __week role="row" inside __grid role="rowgroup". *Why:* Gridcells outside a row are invalid ARIA, so screen readers lose row and column position. The static docs previews get this wrong; the ds-core output gets it right. (Accessible by default · auto-checkable)
- .gds-calendar__day is a <button type="button"> with role="gridcell" and a full-date aria-label. *Why:* A bare number like "18" says nothing to a screen reader; a button is focusable and clickable. (Accessible by default · auto-checkable)
- --selected has aria-selected="true", --today has aria-current="date", --disabled has disabled and aria-disabled="true". *Why:* The class only changes the look; the attribute is what assistive tech reads. (Accessible by default · auto-checkable)
- Exactly one __day has tabindex="0"; all others have tabindex="-1". *Why:* Tab should enter the grid once and leave it; 42 tab stops make the form unusable by keyboard. (Accessible by default · auto-checkable)
- Each __nav button has an aria-label ("Previous month" / "Next month"). *Why:* They are icon-only buttons. (Accessible by default · auto-checkable)
- Build parts from existing components: __nav on .gds-btn-icon (ghost, sm), footer actions as .gds-btn--ghost --sm, the trigger as .gds-input, presets as .gds-menu. *Why:* The calendar CSS only adds layout; colours, focus and sizes come from those components. (Reuse before you create · auto-checkable)
- When a day has __day-dot, add what it means to the day's aria-label (e.g. ", 2 articles scheduled"). *Why:* The dot is a visual cue only. (Accessible by default)
- Always render 6 full weeks (42 days); fill before and after the month with --outside days. *Why:* Keeps the 7-column grid aligned and the popover height stable when paging months; matches ds-core. (Obvious over documented · auto-checkable)
- For a working picker use createDatePicker() from @gjirafa/ds-core instead of writing open/close, keyboard and date logic again. *Why:* The CSS ships no behaviour; ds-core already handles keyboard, ARIA, positioning and locale. (Reuse before you create)
- Use one floating surface per picker: .gds-calendar-popover (CSS only) or .gds-popover (ds-core), never both. *Why:* Both draw a border, shadow and radius; nesting them doubles the frame. (Obvious over documented · auto-checkable)

**Known issues** (flag them; work around one only where it says how, using GDS tokens):
- Fails principle 1 (WCAG 2.2, 2.5.8 target size): the time stepper up/down buttons are about 16×16px; the minimum is 24×24px (axe). *Planned fix:* Give .gds-time-stepper buttons a 24px minimum hit area (padding or min-width/min-height), keeping the 16px icon.
- Two popover surfaces exist: .gds-calendar-popover (absolute, inside .gds-datepicker) and the generic .gds-popover that the ds-core date picker actually renders. Same look, two code paths. *Planned fix:* Make .gds-calendar-popover compose .gds-popover (already planned in the popover docs), then deprecate it and .gds-datepicker.
- ds-core createDatePicker() renders classes that are not in the CSS: gds-datepicker__popover and gds-time-stepper__btn--down. *Planned fix:* Remove them from ds-core, or add them to the CSS and this contract.
- The static docs previews put role="grid" on __grid with gridcells as direct children (no __grid-wrap, no __week rows) and the weekday row outside the grid. That is invalid ARIA; only the ds-core output is correct. *Planned fix:* Update the docs previews to the anatomy above (grid-wrap > weekdays + grid > week > day).
- gds-time-stepper lives in _calendar.scss but uses its own prefix, so it reads like a separate component. *Planned fix:* v3: rename to gds-calendar__stepper, or split it into its own component if other screens need a time field.
- Range modifiers (--range-start, --in-range, --range-end) are styled, but ds-core has no range mode yet. Products must write range logic themselves. *Planned fix:* Add range mode to ds-core (listed as an upcoming phase) or mark the range modifiers beta.
- The presets column reuses .gds-menu, which brings its own border, shadow and min-width, so it may show a framed surface inside the calendar surface. *Planned fix:* Add a flat menu variant (no border / shadow) or reset them under .gds-calendar__presets. Check visually first.
- The state preview helpers .is-hover-preview / .is-focus-preview are also defined for __day (docs only, documented as internal in pagination). They break the BEM naming rule. *Planned fix:* v3: one shared preview mechanism (e.g. a data attribute) for all components.

*Generated from `components/calendar.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:calendar:end -->

---

<!-- gds:component:visually-hidden:start -->
### Visually hidden

Hides text visually while keeping it for screen readers.

**Use when:**
- A table caption you don't want to show.
- Extra context for screen readers, e.g. "(opens in a new tab)" or the meaning behind a coloured count.

**Don't use when:**
- Hiding content from everyone → use the hidden attribute
- Labelling an icon-only button → use aria-label on the button

**Example: Hidden table caption**
```html
<span class="gds-visually-hidden">Sorted by last updated, newest first</span>
```

**Anatomy** (the DOM structure is the API; keep this nesting):

| Element | Tag | Required | Inside | Notes |
|---|---|---|---|---|
| `gds-visually-hidden` | span \| caption | yes | top level | Any element whose text should be read but not seen. |

**Modifiers:**

| Class | On | Group | Effect |
|---|---|---|---|

**Accessibility:**
- Never put focusable elements inside it.

**Rules:**
- Do not put links, buttons or inputs inside gds-visually-hidden. *Why:* Keyboard users would focus something they cannot see. (Accessible by default · auto-checkable)

*Generated from `components/visually-hidden.json`. Edit that file, then run `npm run brand`.*
<!-- gds:component:visually-hidden:end -->

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
