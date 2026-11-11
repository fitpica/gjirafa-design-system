# Dropdown

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
