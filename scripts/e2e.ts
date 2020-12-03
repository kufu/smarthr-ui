import { spawn } from 'child_process'
import waitForLocalhost from 'wait-for-localhost'
;(async () => {
  const storybook = spawn('yarn', ['run', 'storybook'], { stdio: 'inherit' })
  await waitForLocalhost({ port: 6006, path: '/iframe.html' })
  // waiting for webpack compile
  await new Promise((r) => setTimeout(r, 60 * 1000))
  const browser = process.env.TESTCAFE_BROWSER || 'chrome'
  const testcafeArgs = 'e2e/**/*.test.ts --host localhost --skip-js-errors'
  const testcafe = spawn('yarn', ['run', 'testcafe', browser, ...testcafeArgs.split(' ')], {
    stdio: 'inherit',
  })
  testcafe.on('close', (code) => {
    storybook.kill()
    process.exit(code)
  })
})()
