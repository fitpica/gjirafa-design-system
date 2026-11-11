---
name: gds-pagination
description: "GDS Pagination contract: exact markup, anatomy, modifiers, accessibility and rules for gds-pagination*. Moves through pages of a long list, with an optional summary and page-size control. Load before writing or editing pagination markup with GDS."
---

# Pagination

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
