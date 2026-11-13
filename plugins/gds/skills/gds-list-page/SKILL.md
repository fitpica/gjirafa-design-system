---
name: gds-list-page
description: GDS recipe for a full list screen (entries, assets, users, orders): page frame, page header, filter bar, bulk-action bar, data table and pagination, assembled exactly as GDS expects. Load when building a screen that lists records.
---

# List page recipe (GDS v2.8.1)

A list screen is these GDS parts, in this order. Load their contract skills for details (`gds-page`, `gds-filter-bar`, `gds-table`, `gds-pagination`, plus `gds-badge`, `gds-checkbox`, `gds-avatar`, `gds-button`, `gds-dropdown`, `gds-input` for the cells and controls).

```html
<main class="gds-page">
  <header class="gds-page-header">
    <div class="gds-page-header__text">
      <h1 class="gds-page-header__title">All Entries</h1>
      <p class="gds-page-header__desc">124 entries</p>
    </div>
    <div class="gds-page-header__actions">
      <button type="button" class="gds-btn gds-btn--primary gds-btn--md"><i data-lucide="plus" class="gds-btn__icon"></i><span class="gds-btn__label">New entry</span></button>
    </div>
  </header>

  <div class="gds-filter-bar" role="search" aria-label="Filter entries">
    <div class="gds-input gds-input--md gds-filter-bar__search">
      <div class="gds-input__wrap">
        <i data-lucide="search" class="gds-input__icon"></i>
        <input type="search" class="gds-input__field" placeholder="Search entries" aria-label="Search entries" />
      </div>
    </div>
    <!-- one gds-dropdown per filter; active value shown in the trigger: "Status: Published" -->
    <!-- gds-filter-bar__clear ghost button only while a filter is active -->
  </div>

  <section class="gds-page__section" aria-label="Entries">
    <!-- gds-table__toolbar with is-visible while rows are selected -->
    <!-- gds-table (white surface): checkbox column, sortable headers with gds-table__sort-btn, gds-badge status cells -->
    <!-- gds-pagination-bar gds-pagination-bar--full -->
  </section>
</main>
```

## Rules for this screen
- No product CSS for layout: `gds-page`, `gds-page-header`, `gds-filter-bar`, `gds-page__section` cover it.
- Inside an app shell that already has a `<main>` (most Vue/React apps), use `<div class="gds-page">` and set `--page-padding: 0` if the shell already pads its content.
- Long menus and dropdowns (e.g. a list of models) scroll on their own; give the trigger a search field when there are more than about 10 options.
- One `<h1>` (the page title) and at most one primary button in the header.
- Sortable headers: `<button class="gds-table__sort-btn">` inside the `<th>`; the sorted one has `--sorted` (+ `--sorted-desc`) and `aria-sort`.
- Status cells: Published positive, Draft neutral, Scheduled warning, Archived neutral, Edited info, Unpublished neutral, Deleted critical; dot + label.
- Dates and metadata columns: `gds-table__cell--secondary`.
- Entry cells with a title and a second line (author, slug): add `gds-table--comfortable` (48px rows).
- Empty state: one row, one cell with `colspan` and `gds-table__empty`. Loading: `gds-table--loading` + `aria-busy="true"`.
