import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  maxFailures: 10,
  fullyParallel: true,
  workers: 4,
  reporter: [['list'], ['html']],
  use: {
    browserName: 'chromium',
    trace: 'on-all-retries',
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
  },
})
