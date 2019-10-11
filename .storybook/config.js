import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withA11y } from '@storybook/addon-a11y'
import { addReadme } from 'storybook-readme'

import { ThemeProvider } from '../src/themes/ThemeProvider'

const req = require.context('../src/components', true, /.stories.tsx$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

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

addDecorator(withA11y)
addDecorator(addReadme)
addDecorator(Story => <ThemeProvider><Story /></ThemeProvider>)

configure(loadStories, module)

