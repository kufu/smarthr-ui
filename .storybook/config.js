import { configure } from '@storybook/react'

const req = require.context('../packages/smarthr-ui/src/', true, /stories.js$/)
const loadStories = req.keys().forEach(req)

configure(loadStories, module)
