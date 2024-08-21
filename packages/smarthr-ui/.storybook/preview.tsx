import React, { ReactNode, useEffect } from 'react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Title, Subtitle, Description, Primary, Stories, Controls } from '@storybook/blocks'
import ReactGA from 'react-ga4'

import { Preview } from '@storybook/react'

import { createTheme, CreatedTheme } from '../src/themes/createTheme'
import { ThemeProvider as ShrThemeProvider } from '../src/themes/ThemeProvider'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { ThemeProvider as TailwindProvider } from '../src/themes/tailwind/TailwindThemeProvider'

import tailwindConfig from '../tailwind.config'

import '../src/styles/index.css'

const isProduction = process.env.STORYBOOK_NODE_ENV === 'production'

if (isProduction) {
  ReactGA.initialize('G-65N1S3NF5R')
}

const preview: Preview = {
  parameters: {
    options: {
      isFullscreen: false,
      isToolshown: true,
      storySort: {
        // 並び替え方針がないためアルファベット順
        order: [
          'Buttons（ボタン）',
          'Data Display（データ表示）',
          'Dialog（ダイアログ）',
          'Forms（フォーム）',
          'Layouts（レイアウト）',
          'Media（メディア）',
          'Navigation（ナビゲーション）',
          'Page Templates（ページテンプレート）',
          'States（状態）',
          'Text（テキスト）',
          'Hooks',
          'Experimental（実験的）',
        ],
      },
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        vrtMobile: {
          name: 'VRT Mobile',
          styles: {
            // iPhone15 Pro、 iPhone15、 iPhone14 Proのサイズを想定
            width: '393px',
            height: '852px',
          },
        },
        vrtTablet: {
          name: 'VRT Tablet',
          styles: {
            // iPad 第10世代、iPad Air 第4世代〜のサイズを想定
            width: '820px',
            height: '1180px',
          },
        },
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories includePrimary={false} />
        </>
      ),
    },
    chromatic: {
      forcedColors: 'none',
    },
  },
  decorators: [
    (Story, context) => {
      const theme = createTheme()
      const ThemeProvider = callThemeProvider(context.parameters.withTheming, theme)

      useEffect(() => {
        if (isProduction) {
          ReactGA.send({ hitType: 'pageview', title: context.title })
        }
      }, [context.title])

      return (
        <ThemeProvider>
          <ShrThemeProvider theme={theme}>
            <TailwindProvider config={tailwindConfig}>
              <Story />
            </TailwindProvider>
          </ShrThemeProvider>
        </ThemeProvider>
      )
    },
  ],
}

export default preview

// Chromatic 用差分3

const callThemeProvider =
  (withThemeProvider: boolean, theme: CreatedTheme) =>
  ({ children }: { children: ReactNode }) => {
    if (withThemeProvider) {
      return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    }

    return <>{children}</>
  }
