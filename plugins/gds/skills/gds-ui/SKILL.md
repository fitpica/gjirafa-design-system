---
name: gds-ui
description: Build UI with the Gjirafa Design System (GDS), a CSS-only system of gds-* classes and --gds-* tokens. Use whenever you write or edit Vue or HTML templates that use gds- classes, or build screens such as tables, lists, filters, forms or pagination for a Gjirafa product.
when_to_use: The user mentions GDS or the Gjirafa design system, a file contains gds- classes, or you are building UI in a Gjirafa Vue app.
---

# Building UI with GDS v2.9.1

GDS is CSS only: you write semantic HTML with `gds-*` classes. There are no GDS Vue components to import yet.

## Setup (once per app)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.9.1/docs/gjirafa-ds.css" />
```

GDS has no reset, so set the base font yourself:

```css
body { font-family: var(--gds-font-family-base); color: var(--gds-color-text-primary); margin: 0; }
```

Icons are Lucide (`<i data-lucide="check"></i>`).

## Principles

1. **Accessible by default.** Text uses only text-primary, text-secondary, text-label or the `*-text` feedback tokens. Never show status by colour alone.
2. **Reuse before you create.** If GDS has it, use it exactly. If it does not, say it is missing; never invent a `gds-` class, variant or token.
3. **Obvious over documented.** Follow the anatomy exactly; the DOM structure is the API.

## Workflow

1. List the GDS components the screen needs.
2. **Load the contract skill for each one before writing markup** (one skill per component, so you read only what you need):
   - `gds-alert`: Alert. A persistent message inside the page that explains a state or problem and stays until the cause is gone or the user dismisses it.
   - `gds-avatar`: Avatar. A photo, initials or icon that represents a person or an organisation, alone, stacked in a group or paired with a name.
   - `gds-badge`: Badge. A small label that shows the status or category of something.
   - `gds-button`: Button. Triggers an action: text buttons, icon-only buttons and joined button groups.
   - `gds-calendar`: Calendar / Date picker. A month grid for picking a date (and optionally a time), shown inline or in a popover under a date field.
   - `gds-card`: Card. A container that groups related content and actions, with optional media, header, body and footer.
   - `gds-checkbox`: Checkbox. Lets people turn one option on or off, or pick several options from a list.
   - `gds-chip`: Chip. A compact token for a tag, a selected value or a toggleable filter, optionally removable, alone, in a group or inside a tag field.
   - `gds-dropdown`: Dropdown. A trigger that opens a panel of options: single select, multi-select, searchable lists.
   - `gds-filter-badge`: Filter badge. A compact pill with a filter icon and the number of applied filters; it opens the filter panel.
   - `gds-filter-bar`: Filter bar. A row above a list with a search field and filter dropdowns; active filters show inside each dropdown trigger.
   - `gds-input`: Input. A text field with optional label, icon, prefix/suffix, helper text and character count.
   - `gds-menu`: Menu. A list of actions on demand: overflow ("more") menus, context menus, row actions.
   - `gds-modal`: Modal. A centred dialog over a dimmed page that blocks everything else until the user confirms, decides or cancels.
   - `gds-page`: Page layout and page header. The frame of a product screen: page background, padding and spacing, and the header with the page title and its main actions.
   - `gds-pagination`: Pagination. Moves through pages of a long list, with an optional summary and page-size control.
   - `gds-pct-badge`: Percentage badge. A pill that shows how much a metric changed, with an arrow for the direction and a colour for good or bad.
   - `gds-pill`: Pill (number count). A small circle with a number: unread counts, items in a tab, or the number of a step.
   - `gds-popover`: Popover. A generic floating surface anchored to a trigger, for interactive content such as a small form, a calendar or a menu.
   - `gds-radio`: Radio. Lets people pick exactly one option from a short, visible list.
   - `gds-sidepanel`: Side panel. A full-height panel that slides in from the right over a dimmed page, for editing or viewing details while the underlying list stays visible.
   - `gds-skeleton`: Skeleton. Grey shimmering shapes that stand in for content while it loads, so the layout does not jump.
   - `gds-status-dot`: Status dot. A small coloured dot that shows someone's presence (online, away, busy, offline), always next to text or with a label.
   - `gds-table`: Data table. Rows of records with optional selection, sorting, bulk actions and pagination.
   - `gds-tabs`: Tabs. A row (or column) of tabs that switches between panels of related content on the same page.
   - `gds-toast`: Toast. A short, single-line floating message that confirms something just happened and goes away on its own.
   - `gds-toggle`: Toggle. An on/off switch for a setting that takes effect immediately.
   - `gds-tooltip`: Tooltip. A small dark label that appears on hover or keyboard focus of a control, CSS only.
   - `gds-visually-hidden`: Visually hidden. Hides text visually while keeping it for screen readers.
3. Copy the structure from the contract's example and anatomy: same elements, same nesting, required children, required modifiers.
4. After you save a `.vue` or `.html` file, the **GDS lint hook** checks it. If it reports problems, fix every one, then continue. Its messages name the rule and often the correct class ("did you mean .gds-table?").
5. Page layout: `gds-page` > `gds-page-header` > `gds-filter-bar` > content (load `gds-page`, `gds-filter-bar`; for a list screen load the `gds-list-page` recipe). For a layout GDS still lacks: layout-only CSS with the product prefix (e.g. `cx-…`), only `display`/flex/grid/`gap`/alignment/width/padding with `--gds-*` tokens, never colours, borders, type or shadows, never restyling a `gds-` class, marked `/* GDS gap: <pattern> */`. Tell the user which gap you hit.

Every GDS component has a contract skill. If the screen needs something none of them covers, it is a GDS gap: follow step 5 and tell the user.

## Before you finish

- Every table has `aria-label`, every `<th>` has `scope="col"`, the sorted header has `aria-sort`.
- Checkboxes without visible text have `aria-label`.
- Content status badges: Published positive, Draft neutral, Scheduled warning, Archived neutral, always dot + label.
- Every `gds-input` has a size (`--md` next to filters).
- Pagination below a table is `gds-pagination-bar gds-pagination-bar--full`, buttons inside `<nav>`, never `<ul>/<li>`.
- No hex colours or px spacing: use `--gds-*` tokens.
