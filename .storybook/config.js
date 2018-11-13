import React from 'react'
import { configure, addDecorator } from '@storybook/react'

import { createTheme } from '../src/themes/createTheme'
import { ThemeProvider } from '../src/themes/ThemeProvider'

const req = require.context('../src/components', true, /.stories.tsx$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

const theme = createTheme()
const ThemeDecorator = storyFn => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(ThemeDecorator)

configure(loadStories, module)
