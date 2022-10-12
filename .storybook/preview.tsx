import React from 'react'
import { addDecorator } from '@storybook/react'
import { create } from '@storybook/theming'
import addons from '@storybook/addons'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Reset } from 'styled-reset'
import { ArgsTable, Title } from '@storybook/addon-docs'
import { withScreenshot } from 'storycap'

import { createTheme, CreatedTheme } from '../src/themes/createTheme'
import { ThemeProvider as ShrThemeProvider } from '../src/themes/ThemeProvider'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { CssBaseLine } from 'smarthr-normalize-css'

export const globalTypes = {
  reset: {
    name: 'Reset',
    defaultValue: 'smarthr-normalize',
    toolbar: {
      items: [
        { value: 'smarthr-normalize', title: 'smarthr-normalize' },
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
          new Promise<void>((resolve) => {
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

              const head = document.querySelector('head')
              if (head) {
                head.appendChild(styles)
              }
            }
            resolve()
          }),
      },
    },
  },
}

const callThemeProvider =
  (withThemeProvider: boolean, theme: CreatedTheme) =>
  ({ children }) => {
    if (withThemeProvider) {
      return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    }

    return <>{children}</>
  }

addDecorator((Story, context) => {
  const resetStyle =
    context.globals.reset === 'smarthr-normalize' ? (
      <CssBaseLine />
    ) : context.globals.reset === 'styled-reset' ? (
      <Reset />
    ) : undefined
  const theme = createTheme()
  const ThemeProvider = callThemeProvider(context.parameters.withTheming, theme)
  return (
    <ThemeProvider>
      <ShrThemeProvider theme={theme}>
        {resetStyle}
        <Story />
      </ShrThemeProvider>
    </ThemeProvider>
  )
})
addDecorator(withScreenshot)
