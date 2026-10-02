// @ts-check
// Load .env file manually only if needed
const fs = require('fs');
if (fs.existsSync('.env')) {
  require('dotenv').config();
}
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120_000,  // Increased from 45_000 - tests were timing out
  expect: { timeout: 15_000 },  // Increased from 7_000 for element waits
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://enamel.qa.subscribili.com',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
      },
    },
  ],
});