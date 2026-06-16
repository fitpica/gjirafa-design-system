import { test, expect, type Page } from '@playwright/test';

// Freeze the clock so the today-ring and time-only "Now" are deterministic.
// setFixedTime fixes Date.now()/new Date() WITHOUT pausing timers, so Floating
// UI's positioning (rAF/timeouts) still runs.
const FIXED = new Date('2026-06-16T12:00:00');

const fixture = (state: string) => `/tests/visual/fixtures/datepicker.html?state=${state}`;

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED);
});

async function ready(page: Page): Promise<void> {
  await page.waitForFunction(() => document.documentElement.getAttribute('data-ready') === '1');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.gds-calendar').first()).toBeVisible();
  // Settle the popover fade before snapshotting / reading the DOM.
  await page.waitForFunction(() => {
    const s = document.querySelector('.gds-datepicker__popover');
    return !!s && getComputedStyle(s).opacity === '1';
  });
}

const STATES = ['skin', 'date', 'datetime', 'time', 'presets', 'minmax'] as const;

for (const state of STATES) {
  test(`visual: ${state}`, async ({ page }) => {
    await page.goto(fixture(state));
    await ready(page);
    await expect(page.locator('.gds-calendar').first()).toHaveScreenshot(`${state}.png`);
  });
}

test('visual: minmax disabled trigger input', async ({ page }) => {
  await page.goto(fixture('minmax'));
  await ready(page);
  await expect(page.locator('input.gds-input__field[disabled]')).toHaveScreenshot(
    'minmax-disabled-input.png',
  );
});

test('visual: keyboard-focused day', async ({ page }) => {
  await page.goto(fixture('keyboard'));
  await ready(page);
  // Move focus into the grid (roving tabindex) and step to a deterministic day.
  await page.locator('.gds-calendar__grid [tabindex="0"]').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.gds-calendar').first()).toHaveScreenshot('keyboard.png');
});

// Vue parity: the GdsDatePicker wrapper must render the SAME calendar DOM as the
// vanilla core (it just mounts createDatePicker). Stronger and flake-free vs a
// pixel screenshot; dynamic ids are normalized.
test('vue parity: GdsDatePicker renders the same calendar as ds-core', async ({ page }) => {
  const norm = (s: string) =>
    s.replace(/gds-dp-grid-\d+/g, 'GRID').replace(/\s+aria-controls="[^"]*"/g, '');

  await page.goto(fixture('date'));
  await ready(page);
  const coreHtml = await page
    .locator('.gds-calendar')
    .first()
    .evaluate((el) => el.outerHTML);

  await page.goto('/tests/visual/fixtures/vue.html');
  await ready(page);
  const vueHtml = await page
    .locator('.gds-calendar')
    .first()
    .evaluate((el) => el.outerHTML);

  expect(norm(vueHtml)).toBe(norm(coreHtml));
});
