# Changelog

All notable changes to GDS. Versions follow [Semantic Versioning](https://semver.org/): a minor or patch release never renames or removes a class or token.

To update, change the version in your CDN link:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.9.0/docs/gjirafa-ds.css" />
```

Full notes for each version are on the [Releases page](https://github.com/fitpica/gjirafa-design-system/releases).

## Unreleased

Table fixes from the first product pilot. No class or token was renamed or removed.

- **Fixed** a table wider than its space was clipped inside `.gds-table-scroll` instead of scrolling (on a phone only the first column was reachable). The frame now grows to the table's width inside the scroll wrapper, and clips its corners with `overflow: clip`, so sticky cells work too.
- **Fixed** loading skeletons (`.gds-table__skeleton`) rendered 0×0 because the `<span>` had no `display`; their width modifiers work now too.
- **Fixed** a `.gds-visually-hidden` label in a table header could widen the whole page on small screens; `.gds-table` is now its containing block.
- **Tests:** phone-width regression tests for all three.

## 2.9.0 (2026-11-13)

No class or token was renamed or removed.

More gaps from the first product pilot.

- **Added** `gds-table--comfortable`: 48px body rows (instead of 40px) for cells with two lines, such as an entry title and its author.
- **Changed** content-status badges cover three more statuses: Edited → `info`, Unpublished → `neutral`, Deleted → `critical`. The lint checks them.
- **Fixed (contracts)** a multi-select dropdown could not pass the lint: the dropdown contract put a `.gds-checkbox__control` in the item, the checkbox contract required it inside `.gds-checkbox` with an `<input>`. The control may now sit directly in a `.gds-dropdown__item` as a decorative element (`aria-hidden="true"`, state on `aria-selected`).

## 2.8.1 (2026-11-13)

No class or token was renamed or removed.

Fixes from the first product pilot (an All Entries page built with GDS inside an existing app).

- **Fixed** dropdown trigger text was centred; it now starts on the left.
- **Fixed** long `.gds-menu` lists ran off the screen; they now scroll past 360px (or 60% of the screen height). Override with `--menu-max-height`.
- **Docs (page contract):** inside an app shell that already has a `<main>`, use `<div class="gds-page">`, and remove the frame padding with `--page-padding: 0`.

## 2.8.0 (2026-11-13)

No class or token was renamed or removed. Three text colours get slightly darker.

- **Added** foundation colour `neutral-200` (`#6c6c7c`), with `--gds-color-neutral-200` and the `.gds-bg-` / `.gds-text-` / `.gds-border-neutral-200` utilities.
- **Changed (accessibility):** `text-tertiary`, `text-placeholder` and `text-helper` now use `neutral-200` and pass WCAG AA as text: 5.16:1 on white (were 2.96 / 2.96 / 3.59:1). They look slightly darker, and so do table sort and row-action icons.
- **Tokens:** every semantic token in `tokens/semantic.tokens.json` (and `dist/tokens.json`) now has a `$description` saying when to use it, with its contrast on white. `npm run test:tokens` fails if a semantic token has none.
- **Plugin README:** a 1-minute check that the Claude Code plugin is loaded (three questions with expected answers).
- **CI:** the workflow can be started by hand (`workflow_dispatch`).

## 2.7.0 (2026-11-11)

No class or token was renamed or removed.

- **Added** page patterns: `gds-page` (`--narrow`, `__section`), `gds-page-header` and `gds-filter-bar` (`__clear`).
- **Added** `gds-table__sort-btn`: sortable table headers work with the keyboard.
- **Added** `gds-visually-hidden`: text for screen readers only.
- **AI tools:** the Claude Code plugin has a contract skill for every component (29), a `gds-list-page` recipe, and lints 25 design rules on every Vue/HTML edit. `llms.txt` and one Markdown page per component are published with the docs.
- **Known issues** found while writing the contracts are recorded in them. Fixes are planned.

## 2.6.2 (2026-11-11)

No class or token was renamed or removed.

- **Changed (accessibility):** seven component tokens use darker text colours, so placeholders, input prefix/suffix, table empty state, card subtitle and checkbox/radio helper text now pass WCAG AA (6.96:1).
- **Fixed** `.gds-pagination-bar--full` overflowing its container by 34px.
- **Added** design tokens as W3C DTCG JSON in `tokens/`, and the first six component contracts in `components/`.

## 2.6.1 (2026-11-11)

- **Docs:** AI integration guide (`brand.md`) updated for 2.6 and four gaps fixed after an AI readiness test. README shows the CDN install.

## 2.6.0 (2026-11-10)

- **Changed (accessibility):** all component text meets WCAG AA (4.5:1), including data table headers, pagination, critical button, warning badge and chip, input helper, dropdown and menu.
- **Fixed** invisible data table toolbar divider and button hover (invalid CSS).
- **Tests:** data table covered by axe and screenshot tests.

## 2.4.0 (2026-04-22)

- **Added** card, tooltip and skeleton components.
- **Changed** Inter is self-hosted, with no Google Fonts dependency.

## 2.3.0 (2026-04-22)

- **Added** LICENSE, package metadata and the `exports` field.
