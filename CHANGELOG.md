# Changelog

All notable changes to GDS. Versions follow [Semantic Versioning](https://semver.org/): a minor or patch release never renames or removes a class or token.

To update, change the version in your CDN link:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fitpica/gjirafa-design-system@v2.7.0/docs/gjirafa-ds.css" />
```

Full notes for each version are on the [Releases page](https://github.com/fitpica/gjirafa-design-system/releases).

## Unreleased

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
