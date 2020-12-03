import waitForLocalhost from 'wait-for-localhost'
;(async () => {
  await waitForLocalhost({ port: 6006, path: '/iframe.html' })
  console.log('Server is ready')
})()
