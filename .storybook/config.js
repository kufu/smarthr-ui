import { configure } from '@storybook/react'

function loadStories() {
  const req = require.context(
    '../packages/smarthr-ui/src/components/',
    true,
    /.stories.tsx?/,
  )
  req.keys().forEach(req)
}

configure(loadStories, module)
