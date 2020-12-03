import { spawn } from 'child_process'
import waitForLocalhost from 'wait-for-localhost'
;(async () => {
  const storybook = spawn('yarn', ['run', 'storybook'], { stdio: 'inherit', shell: true })

  await waitForLocalhost({ port: 6006, path: '/iframe.html' })
  // storybook seems to have an additional build after serving iframe.html,
  // so we have to wait the build to avoid a timeout of testcafe.
  // 60s is a heuristic duration, so we have to add the duration in the future.
  await new Promise((r) => setTimeout(r, 60 * 1000))

  const browser = process.env.TESTCAFE_BROWSER || 'chrome'
  const testcafeArgs = 'e2e/**/*.test.ts --host localhost --skip-js-errors'
  const testcafe = spawn('yarn', ['run', 'testcafe', browser, ...testcafeArgs.split(' ')], {
    stdio: 'inherit',
    shell: true,
  })
  testcafe.on('close', (code) => {
    storybook.kill()
    process.exit(code)
  })
})()
