import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { create } from '@storybook/theming'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { withA11y } from '@storybook/addon-a11y'
import { addReadme } from 'storybook-readme'
import { Reset } from 'styled-reset'
import {
  ArgsTable,
  Description,
  Heading,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks'

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

export const parameters = {
  options: {
    theme: create({
      base: 'light',
      brandTitle: 'smarthr-ui storybook',
      brandUrl: 'https://github.com/kufu/smarthr-ui',
    }),
    isFullscreen: false,
    isToolshown: true,
  },
  viewport: { viewports: INITIAL_VIEWPORTS },
  readme: {
    // This setting is needed not to apply css of storybook-readme to DocsPage
    highlightContent: false,
  },
  controls: { disabled: true },
  docs: {
    source: { type: 'dynamic' },
    page: () => (
      <>
        <Title />
        <Subtitle />
        <Description />
        <Primary />
        <Stories title="Usage" />
        <Heading>Props</Heading>
        <ArgsTable />
      </>
    ),
  },
}

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
