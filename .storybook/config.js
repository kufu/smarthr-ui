import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'

import { createTheme } from '../src/themes/createTheme'
import { ThemeProvider } from '../src/themes/ThemeProvider'
import { withA11y } from '@storybook/addon-a11y'

addParameters({
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'smarthr-ui storybook',
      brandUrl: 'https://github.com/kufu/smarthr-ui',
    }),
    isFullscreen: false,
    isToolshown: true,
  },
})

const req = require.context('../src/components', true, /.stories.tsx$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

addDecorator(storyFn => <ThemeProvider theme={createTheme()}>{storyFn()}</ThemeProvider>)
configure(loadStories, module)

addDecorator(withA11y)
