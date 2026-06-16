import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Automated, structural a11y only (axe-core). Real screen-reader testing
// (VoiceOver / NVDA) remains MANUAL — see tests/visual/README.md.
const FIXED = new Date('2026-06-16T12:00:00');
const BLOCKING = new Set(['serious', 'critical']);

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED);
});

async function ready(page: Page): Promise<void> {
  await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === '1');
  await expect(page.locator('.gds-calendar').first()).toBeVisible();
  // Wait for the popover's open fade to finish so axe measures final, opaque
  // colors — not a mid-transition blend (which yields false color-contrast hits).
  await page.waitForFunction(() => {
    const s = document.querySelector('.gds-datepicker__popover');
    return !!s && getComputedStyle(s).opacity === '1';
  });
}

const STATES = ['skin', 'date', 'datetime', 'time', 'presets', 'minmax'] as const;

for (const state of STATES) {
  test(`a11y: ${state}`, async ({ page }) => {
    await page.goto(`/tests/visual/fixtures/datepicker.html?state=${state}`);
    await ready(page);

    // Scan the trigger(s) + the portalled popover (both live in <body>).
    const results = await new AxeBuilder({ page }).include('body').analyze();

    if (results.violations.length) {
      // Surface moderate/minor noise without failing on it.
      // eslint-disable-next-line no-console
      console.log(
        `[a11y:${state}] ${results.violations.length} violation(s): ` +
          results.violations.map((v) => `${v.impact}:${v.id}`).join(', '),
      );
    }

    const blocking = results.violations.filter((v) => BLOCKING.has(v.impact ?? ''));
    expect(blocking, blocking.map((v) => `${v.id} — ${v.help}`).join('\n')).toEqual([]);
  });
}
