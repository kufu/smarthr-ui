import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

import { createTheme } from '../src/themes/createTheme'
import { ThemeProvider } from '../src/themes/ThemeProvider'

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
addParameters({ viewport: { viewports: INITIAL_VIEWPORTS } })

const req = require.context('../src/components', true, /.stories.tsx$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

addDecorator(storyFn => <ThemeProvider theme={createTheme()}>{storyFn()}</ThemeProvider>)
configure(loadStories, module)
