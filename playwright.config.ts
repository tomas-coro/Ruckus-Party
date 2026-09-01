import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173/Ruckus-Party/';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: [['list']],
  use: {
    baseURL,
    serviceWorkers: 'allow',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node scripts/build-update-fixtures.mjs && npm run build -- --mode test && npm run preview -- --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'mobile-chromium-375',
      use: { ...devices['iPhone 13 Mini'], browserName: 'chromium', viewport: { width: 375, height: 812 } },
    },
    {
      name: 'mobile-chromium-430',
      testIgnore: 'updates.spec.ts',
      use: { ...devices['iPhone 14 Pro Max'], browserName: 'chromium', viewport: { width: 430, height: 932 } },
    },
    {
      name: 'mobile-webkit-390',
      testIgnore: 'updates.spec.ts',
      use: { ...devices['iPhone 13'], browserName: 'webkit', viewport: { width: 390, height: 844 } },
    },
    {
      name: 'landscape-chromium-844',
      testIgnore: 'updates.spec.ts',
      use: { ...devices['iPhone 13'], browserName: 'chromium', viewport: { width: 844, height: 390 } },
    },
  ],
});
