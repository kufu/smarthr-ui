const { execSync, spawn } = require('child_process')

function envSpawn(command: string) {
  const [c, ...args] = command.split(' ')

  if (process.platform.startsWith('win')) {
    return spawn('cmd', ['/s', '/c', c, ...args])
  } else {
    return spawn(c, args)
  }
}

const start = envSpawn('yarn storybook')
start.stdout.on('data', (data) => {
  console.log(`storybook.stdout: ${data}`)
})
start.stderr.on('data', (data) => {
  console.error(`storybook.stderr: ${data}`)
})
start.on('close', (code) => {
  console.log(`storybook exited with code ${code}`)
})

const testcafe = envSpawn(`yarn e2e ${process.env.CAFE_BROWSER} e2e/**/*.test.ts --host localhost`)
testcafe.stdout.on('data', (data) => {
  console.log(`testcafe.stdout: ${data}`)
})
testcafe.stderr.on('data', (data) => {
  console.error(`testcafe.stderr: ${data}`)
})
testcafe.on('close', (code) => {
  console.log(`testcafe process exited with code ${code}`)
  start.kill()
  process.exit(code)
})
