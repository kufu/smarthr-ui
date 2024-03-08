import React, { ReactNode, useEffect } from 'react'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { Title, Subtitle, Description, Primary, ArgsTable, Stories } from '@storybook/blocks'
import ReactGA from 'react-ga4'

import { Reset } from 'styled-reset'
import { Preview } from '@storybook/react'

import { createTheme, CreatedTheme } from '../src/themes/createTheme'
import { ThemeProvider as ShrThemeProvider } from '../src/themes/ThemeProvider'
import { ThemeProvider as SCThemeProvider, createGlobalStyle } from 'styled-components'
import { ThemeProvider as TailwindProvider } from '../src/themes/tailwind/TailwindThemeProvider'
import CssBaseLine from 'smarthr-normalize-css'
import { defaultLeading, defaultColor } from '../src/'

import tailwindConfig from '../tailwind.config'

import '../src/styles/index.css'

ReactGA.initialize('G-65N1S3NF5R')

const preview: Preview = {
  globalTypes: {
    reset: {
      defaultValue: 'smarthr-normalize',
      toolbar: {
        title: 'CSS Reset',
        items: [
          { value: 'smarthr-normalize', title: 'smarthr-normalize' },
          { value: 'styled-reset', title: 'styled-reset' },
          { value: null, title: 'off' },
        ],
      },
    },
  },
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
      // ArgsTable は deprecated で、subcomponentsで複数コンポーネントの props を見せる機能は非推奨になった
      // ここでは、一旦v6.5->v7アップデート時に後方互換を保つために独自のpageを設定している
      // 参考: https://github.com/storybookjs/storybook/issues/20782#issuecomment-1482771013
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  decorators: [
    (Story, context) => {
      const resetStyle =
        context.globals.reset === 'smarthr-normalize' ? (
          <SmartHRGlobalStyle />
        ) : context.globals.reset === 'styled-reset' ? (
          <Reset />
        ) : undefined
      const theme = createTheme()
      const ThemeProvider = callThemeProvider(context.parameters.withTheming, theme)

      useEffect(() => {
        ReactGA.send({ hitType: 'pageview', title: context.title })
      }, [])

      return (
        <ThemeProvider>
          <ShrThemeProvider theme={theme}>
            <TailwindProvider config={tailwindConfig}>
              {resetStyle}
              <Story />
            </TailwindProvider>
          </ShrThemeProvider>
        </ThemeProvider>
      )
    },
  ],
}

export default preview

const callThemeProvider =
  (withThemeProvider: boolean, theme: CreatedTheme) =>
  ({ children }: { children: ReactNode }) => {
    if (withThemeProvider) {
      return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    }

    return <>{children}</>
  }

const SmartHRGlobalStyle = createGlobalStyle`
  ${CssBaseLine}

  body {
    line-height: ${defaultLeading.NORMAL};
    color: ${defaultColor.TEXT_BLACK};
  }
`
