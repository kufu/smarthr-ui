import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  maxFailures: 1000,
  retries: 2,
  fullyParallel: true,
  workers: 3,
  reporter: [['list'], ['html']],
  use: {
    browserName: 'chromium',
    trace: 'on-all-retries',
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  },
})
