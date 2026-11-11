---
name: gds-filter-badge
description: "GDS Filter badge contract: exact markup, anatomy, modifiers, accessibility and rules for gds-filter-badge*. A compact pill with a filter icon and the number of applied filters; it opens the filter panel. Load before writing or editing filter badge markup with GDS."
---

# Filter badge

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
