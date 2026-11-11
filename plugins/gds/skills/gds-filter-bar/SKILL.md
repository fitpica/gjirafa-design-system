---
name: gds-filter-bar
description: "GDS Filter bar contract: exact markup, anatomy, modifiers, accessibility and rules for gds-filter-bar*. A row above a list with a search field and filter dropdowns; active filters show inside each dropdown trigger. Load before writing or editing filter bar markup with GDS."
---

# Filter bar

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
