import { spawn } from 'child_process'
import waitForLocalhost from 'wait-for-localhost'
;(async () => {
  const storybook = spawn('yarn', ['run', 'storybook', '--quiet'], {
    stdio: 'inherit',
    shell: true,
  })
  await waitForLocalhost({ port: 6006, path: '/iframe.html' })

  const browser = process.env.TESTCAFE_BROWSER || 'chrome'
  // This timeout is to wait for the build of webpack because
  // storybook seems to have an additional build after serving iframe.html
  const timeoutMs = 5 * 60 * 1000
  const testcafeArgs = `e2e/**/*.test.ts --host localhost --skip-js-errors --page-load-timeout ${timeoutMs}`
  const testcafe = spawn('yarn', ['run', 'testcafe', browser, ...testcafeArgs.split(' ')], {
    stdio: 'inherit',
    shell: true,
  })
  testcafe.on('close', (code) => {
    storybook.kill()
    process.exit(code)
  })
})()
