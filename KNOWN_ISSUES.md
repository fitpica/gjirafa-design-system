# Known Issues — Gjirafa Design System

## GDS-1 · Nested `data-theme` does not re-theme components

**Severity:** Medium · **Scope:** System-wide (all components) · **Status:** Open

### Summary
Setting `data-theme="vpplayer"` (or any non-default theme) on a **nested** element
does **not** re-theme that subtree. Only setting the theme on the **document root**
(`<html>` / `<body>`) works.

### Reproduction
```html
<!-- Root theme = codex (default) -->
<div data-theme="vpplayer">
  <button class="gds-btn gds-btn--primary">Expected orange, renders BLUE</button>
</div>
```
The primary button stays CODEX blue. The same happens to every component
(Calendar selected day, etc.) — it is **not** Calendar-specific.

### Root cause
Component color tokens are **flattened at `:root`**:

```scss
// _component-button.scss
:root { --btn-primary-bg: var(--gds-color-action-primary); }  // resolved ONCE, at :root
```

CSS custom properties containing `var()` are substituted using the value on the
element where the property is **declared** (`:root`), then the already-resolved
value inherits down. A nested `[data-theme="vpplayer"]` overrides
`--gds-color-action-primary` for its subtree, but `--btn-primary-bg` was already
computed as blue at `:root` and is not redeclared in the nested scope, so it stays
blue. Verified: at a nested `[data-theme="vpplayer"]`, `--gds-color-action-primary`
correctly resolves to `#ef8c13`, yet `--btn-primary-bg` / `--calendar-day-selected-bg`
remain `#206ed5`.

Root-level theming works because when `data-theme` is on `<html>`, `:root` itself
matches the override, so the flattened tokens recompute as orange.

### Fix options (needs sign-off — touches token architecture)
1. **Reference semantic tokens at the use-site** in component CSS for themed
   properties (e.g. `background: var(--gds-color-action-primary)` directly in
   `.gds-btn--primary`) instead of through a `:root`-flattened `--btn-*` token.
   Restores per-subtree theming; loses the per-component override token.
2. **Re-declare themed component tokens inside the theme selectors**
   (`[data-theme="vpplayer"] { --btn-primary-bg: …; }`). Keeps override tokens;
   larger theme files.
3. **Document root-only theming as the supported model** and drop the nested-theme
   claim. Lowest effort; no per-section theming.

### Docs corrected (this pass)
The Installation → Theme Setup section no longer advertises nested/per-section
theming. The "Mixed: VP Player for a section" example was removed and replaced
with a root-only note. Re-evaluate if option 1 or 2 is adopted.

---

## GDS-2 · Data table header text fails WCAG AA contrast

**Severity:** High · **Scope:** Data Table · **Status:** ✅ Fixed (v2.6, branch `fix/data-table-a11y`)

### Summary
Found in a product accessibility audit. `--table-header-color` referenced
`--gds-color-text-helper` (`#868693`), which renders at **3.19:1** on
`--table-header-bg` (`--gds-color-bg-tertiary`, `#f1f1f3`). Header cells are
12px semibold (normal-size text), so the WCAG 2.x AA minimum is **4.5:1**.
axe `color-contrast` flagged every header cell.

### Fix
`--table-header-color` now references `--gds-color-text-label` (`#4b4b5f`):
**7.53:1** on the header background (also passes AAA 7:1). Neither theme
overrides these semantic tokens, so the ratio holds for CODEX and VP Player.

---

## GDS-3 · Data table toolbar overlay tokens compile to invalid CSS

**Severity:** Medium · **Scope:** Data Table (bulk-actions toolbar) · **Status:** ✅ Fixed (v2.6, branch `fix/data-table-a11y`)

### Summary
Found in a product accessibility audit. `--table-toolbar-btn-hover-bg` and
`--table-toolbar-divider` were written as `rgba(#{$color-neutral-0}, a)`. Inside
a custom property Sass emits this verbatim as `rgba(#ffffff, 0.15)`, which is
not valid CSS. Browsers discarded the value, so toolbar buttons had **no hover
background** and the toolbar divider was **invisible**.

### Fix
The whole call is now interpolated, `#{rgba($color-neutral-0, a)}`, so Sass
evaluates it and the compiled output is `rgba(255, 255, 255, 0.15)` /
`rgba(255, 255, 255, 0.25)`. The value still derives from the foundation token.
Note that an uninterpolated `rgba($color-neutral-0, a)` also fails: Sass passes
custom-property values through literally.
