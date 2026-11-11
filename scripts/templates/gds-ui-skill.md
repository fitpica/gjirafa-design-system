---
name: gds-ui
description: Build UI with the Gjirafa Design System (GDS), a CSS-only system of gds-* classes and --gds-* tokens. Use whenever you write or edit Vue or HTML templates that use gds- classes, or build screens such as tables, lists, filters, forms or pagination for a Gjirafa product.
when_to_use: The user mentions GDS or the Gjirafa design system, a file contains gds- classes, or you are building UI in a Gjirafa Vue app.
---

# Building UI with GDS v{{version}}

GDS is CSS only: you write semantic HTML with `gds-*` classes. There are no GDS Vue components to import yet.

## Setup (once per app)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v{{version}}/docs/gjirafa-ds.css" />
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
{{components}}
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
