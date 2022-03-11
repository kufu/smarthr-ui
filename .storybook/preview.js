import React from 'react'
import { addDecorator } from '@storybook/react'
import { create } from '@storybook/theming'
import addons from '@storybook/addons'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { addReadme } from 'storybook-readme'
import { Reset } from 'styled-reset'
import { ArgsTable, Title } from '@storybook/addon-docs'
import { withScreenshot } from 'storycap'

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
  docs: {
    source: { type: 'dynamic' },
    page: () => (
      <>
        <Title />
        <ArgsTable />
      </>
    ),
  },
  screenshot: {
    variants: {
      mobile: {
        viewport: 'iPhone 5',
        /**
         * storycap にて、初回以降の variants で CSS アニメーションを無効にするスタイルが効かないバグが存在するようなので、
         * キャプチャ前に DOM にスタイルを差し込む処理を追加
         * 参考: https://github.com/reg-viz/storycap/issues/327
         */
        waitFor: () =>
          new Promise((resolve) => {
            const stylesId = 'smarthr-ui-storycap-disable-css-animation'
            if (!document.getElementById(stylesId)) {
              const styles = document.createElement('style')
              styles.setAttribute('id', stylesId)
              styles.appendChild(
                document.createTextNode(`
                  *,
                  *::before,
                  *::after {
                    transition: none !important;
                    animation: none !important;
                  }
                  input {
                    caret-color: transparent !important;
                  }
                `),
              )
              document.querySelector('head').appendChild(styles)
            }
            resolve()
          }),
      },
    },
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
addDecorator(withScreenshot)
