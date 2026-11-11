---
name: gds-table
description: "GDS Data table contract: exact markup, anatomy, modifiers, accessibility and rules for gds-table*. Rows of records with optional selection, sorting, bulk actions and pagination. Load before writing or editing data table markup with GDS."
---

# Data table

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
