import React from 'react'
import { addDecorator } from '@storybook/react'
import { create } from '@storybook/theming'
import addons from '@storybook/addons'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { addReadme } from 'storybook-readme'
import { Reset } from 'styled-reset'
import { ArgsTable, Title } from '@storybook/addon-docs'

import { createTheme } from '../src/themes/createTheme'
import { ThemeProvider } from '../src/themes/ThemeProvider'

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

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'smarthr-ui storybook',
    brandUrl: 'https://github.com/kufu/smarthr-ui',
  }),
})

export const parameters = {
  options: {
    isFullscreen: false,
    isToolshown: true,
  },
  viewport: { viewports: INITIAL_VIEWPORTS },
  readme: {
    // This setting is needed not to apply css of storybook-readme to DocsPage
    highlightContent: false,
  },
  controls: { disable: true },
  docs: {
    source: { type: 'dynamic' },
    page: () => (
      <>
        <Title />
        <ArgsTable />
      </>
    ),
  },
}

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
