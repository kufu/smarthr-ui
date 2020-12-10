import { spawn, spawnSync } from 'child_process'
import waitForLocalhost from 'wait-for-localhost'
;(async () => {
  const PORT = 6006

  spawnSync('yarn', ['run', 'build-storybook', '--quiet'], {
    stdio: 'inherit',
    shell: true,
  })
  const httpServer = spawn(
    'yarn',
    ['http-server', 'storybook-static', '--port', `${PORT}`, '--silent'],
    {
      stdio: 'inherit',
      shell: true,
    },
  )

  await waitForLocalhost({ port: PORT, path: '/iframe.html' })

  const browser = process.env.TESTCAFE_BROWSER || 'chrome'
  const testcafeArgs = `e2e/**/*.test.ts --host localhost --skip-js-errors`
  const testcafe = spawn('yarn', ['run', 'testcafe', browser, ...testcafeArgs.split(' ')], {
    stdio: 'inherit',
    shell: true,
  })
  testcafe.on('close', (code) => {
    httpServer.kill()
    process.exit(code)
  })
})()
