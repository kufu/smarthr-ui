import { spawn, spawnSync } from 'child_process'

const PORT = 6006

const buildSpawn = spawnSync('pnpm', ['run', 'build-storybook', '--quiet'], {
  stdio: 'inherit',
  shell: true,
})
if (buildSpawn.status !== 0) {
  process.exit(1)
}
const httpServer = spawn(
  'pnpm',
  ['http-server', 'storybook-static', '--port', `${PORT}`, '--silent'],
  {
    stdio: 'inherit',
    shell: true,
  },
)

const browser = process.env.TESTCAFE_BROWSER || 'chrome'
const testcafeArgs = `"e2e/**/*.test.ts" --host localhost --skip-js-errors`
const testcafe = spawn('pnpm', ['run', 'testcafe', browser, ...testcafeArgs.split(' ')], {
  stdio: 'inherit',
  shell: true,
})
testcafe.on('close', (code) => {
  httpServer.kill()
  process.exit(code || undefined)
})
