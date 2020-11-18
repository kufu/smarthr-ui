import React from 'react'
import { configure, addDecorator, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withA11y } from '@storybook/addon-a11y'
import { addReadme } from 'storybook-readme'
import { Reset } from 'styled-reset'

import { createTheme } from '../src/themes/createTheme'
import { ThemeProvider } from '../src/themes/ThemeProvider'

const req = require.context('../src/components', true, /.stories.tsx$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

export const globalTypes = {
  reset: {
    name: 'Reset',
    toolbar: {
      items: [
        { value: 'styled-reset', title: 'styled-reset' },
        { value: null, title: 'off' },
      ],
    },
  },
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
addDecorator((Story, context) => {
  const shouldReset = context.globals.reset === 'styled-reset'
  return (
    <ThemeProvider theme={createTheme()}>
      {shouldReset && <Reset />}
      <Story />
    </ThemeProvider>
  )
})

configure(loadStories, module)
