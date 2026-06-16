import { defineConfig, devices } from '@playwright/test';

// Local-only QA harness for the Calendar/DatePicker (no CI). Visual-regression
// + automated a11y against deterministic fixtures served from the repo root.
const PORT = Number(process.env.QA_PORT) || 4317;

export default defineConfig({
  testDir: './tests/visual',
  // Clean, single-machine baseline names (no platform suffix). Baselines are
  // macOS-Chromium artifacts — see tests/visual/README.md.
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', scale: 'css' },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1000, height: 800 } },
    },
  ],
  webServer: {
    command: 'node tests/visual/serve.mjs',
    url: `http://localhost:${PORT}/tests/visual/fixtures/datepicker.html?state=date`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
