# Calendar / DatePicker QA — visual regression + automated a11y

A lean, **local-only** harness (no CI yet) that guards the Calendar/DatePicker's
rendered output and accessibility. Built on [Playwright](https://playwright.dev)
+ [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm). It drives
deterministic fixtures that mount the **real** `createDatePicker` (and the Vue
`GdsDatePicker`), reusing the committed `docs/gjirafa-ds.css` and the pre-bundled
`docs/vendor/ds-core-datepicker.js` — no Storybook, no new bundling.

## One-time setup

```sh
npm install                 # installs @playwright/test + @axe-core/playwright (root devDeps)
npx playwright install chromium
```

Fixtures also need the built packages (the Vue parity fixture imports them):

```sh
npm --prefix packages/ds-core run build
npm --prefix packages/ds-vue  run build
```

## Commands (run from repo root)

| Command | What it does |
| --- | --- |
| `npm run test:visual` | Run visual-regression checks against committed baselines. |
| `npm run test:visual:update` | Re-generate/refresh the screenshot baselines (after an intended visual change). |
| `npm run test:a11y` | Run axe accessibility checks. |

Playwright starts a tiny static server (`tests/visual/serve.mjs`, port 4317)
automatically.

## What is covered

**Visual regression** (element-scoped screenshots of `.gds-calendar`, frozen clock):
`skin` · `date` · `datetime` · `time` · `presets` · `minmax` (disabled cells) ·
a disabled trigger input · a keyboard-focused day · **Vue parity** (asserts the
`GdsDatePicker` wrapper renders the same calendar DOM as the core).

**Automated a11y** (axe): the same open states + the trigger. **Fails only on
`serious`/`critical` violations**; `moderate`/`minor` are logged, not failed.

## What remains MANUAL

- **Real screen-reader testing** (VoiceOver, NVDA, JAWS). axe is structural only;
  it does not exercise an actual AT. This has **not** been run — do not treat the
  automated pass as screen-reader coverage.
- Cross-browser / cross-OS rendering (only Chromium here).

## Determinism & baselines

- The clock is frozen to `2026-06-16T12:00:00` (`page.clock.setFixedTime`) and
  all fixtures use fixed `defaultValue`/`baseDate`, so months, today-ring, and
  the time-only "Now" are stable.
- Animations are disabled; viewport is fixed at 1000×800 @1×.
- Baselines in `__screenshots__/` were generated on **macOS + Chromium**. On a
  different OS or a different Chromium version, sub-pixel/font AA differences may
  cause diffs — regenerate with `npm run test:visual:update` on that platform.
  (A future CI step would standardize on a Linux baseline set.)
