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
