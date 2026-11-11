---
name: gds-ui
description: Build UI with the Gjirafa Design System (GDS), a CSS-only system of gds-* classes and --gds-* tokens. Use whenever you write or edit Vue or HTML templates that use gds- classes, or build screens such as tables, lists, filters, forms or pagination for a Gjirafa product.
when_to_use: The user mentions GDS or the Gjirafa design system, a file contains gds- classes, or you are building UI in a Gjirafa Vue app.
---

# Building UI with GDS v2.6.2

GDS is CSS only: you write semantic HTML with `gds-*` classes. There are no GDS Vue components to import yet.

## Setup (once per app)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.6.2/docs/gjirafa-ds.css" />
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
   - `gds-badge`: Badge. A small label that shows the status or category of something.
   - `gds-checkbox`: Checkbox. Lets people turn one option on or off, or pick several options from a list.
   - `gds-dropdown`: Dropdown. A trigger that opens a panel of options: single select, multi-select, searchable lists.
   - `gds-input`: Input. A text field with optional label, icon, prefix/suffix, helper text and character count.
   - `gds-pagination`: Pagination. Moves through pages of a long list, with an optional summary and page-size control.
   - `gds-table`: Data table. Rows of records with optional selection, sorting, bulk actions and pagination.
3. Copy the structure from the contract's example and anatomy: same elements, same nesting, required children, required modifiers.
4. After you save a `.vue` or `.html` file, the **GDS lint hook** checks it. If it reports problems, fix every one, then continue. Its messages name the rule and often the correct class ("did you mean .gds-table?").
5. Missing pattern (page header, filter bar, page layout): layout-only CSS with the product prefix (e.g. `cx-page-header`), only `display`/flex/grid/`gap`/alignment/width/padding with `--gds-*` tokens, never colours, borders, type or shadows, never restyling a `gds-` class, marked `/* GDS gap: <pattern> */`. Tell the user which gap you hit.

Components without a contract yet (button, avatar, chip, menu, tabs, alert, toast, modal, side panel…): use the class names from the GDS AI guide (`brand.md` in the GDS repo or https://docs-phi-black.vercel.app) and flag anything you had to guess.

## Before you finish

- Every table has `aria-label`, every `<th>` has `scope="col"`, the sorted header has `aria-sort`.
- Checkboxes without visible text have `aria-label`.
- Content status badges: Published positive, Draft neutral, Scheduled warning, Archived neutral, always dot + label.
- Every `gds-input` has a size (`--md` next to filters).
- Pagination below a table is `gds-pagination-bar gds-pagination-bar--full`, buttons inside `<nav>`, never `<ul>/<li>`.
- No hex colours or px spacing: use `--gds-*` tokens.
