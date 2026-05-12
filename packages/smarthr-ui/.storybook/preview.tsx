import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks'
import { useEffect } from 'react'
import ReactGA from 'react-ga4'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'
import resolveConfig from 'tailwindcss/resolveConfig'

// tv() が shr- プレフィックスを認識するために必要。
// パッケージ利用側では package.json の sideEffects 宣言により index.js 経由で自動実行されるが、
// プロジェクト内の Storybook はソース（../src）を直接参照するため sideEffects が適用されず、
// build-storybook（Rollup）の tree-shaking で除去されてしまう。
// eslint-disable-next-line smarthr/require-barrel-import
import '../src/configureTwMerge'
// eslint-disable-next-line smarthr/require-barrel-import
import '../src/styles/index.css'
import { EnvironmentProvider, IntlProvider, locales } from '../src'
// eslint-disable-next-line smarthr/require-barrel-import
import presetConfig from '../src/smarthr-ui-preset'

import type { Preview } from '@storybook/react-vite'

const { backgroundColor } = resolveConfig(presetConfig).theme

const isProduction = process.env.STORYBOOK_NODE_ENV === 'production'

if (isProduction) {
  ReactGA.initialize('G-65N1S3NF5R')
}

const preview: Preview = {
  parameters: {
    options: {
      isFullscreen: false,
      isToolshown: true,
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
      canvas: {
        sourceState: 'shown',
      },
    },
    chromatic: {
      forcedColors: 'none',
    },
    backgrounds: {
      default: 'light',
      values: [{ name: 'light', value: backgroundColor.background }],
    },
  },
  globalTypes: {
    locale: {
      description: 'Locale',
      defaultValue: 'ja',
      toolbar: {
        icon: 'globe',
        dynamicTitle: true,
        items: Object.entries(locales).map(([locale, values]) => ({
          value: locale,
          title: values['smarthr-ui/common/language'],
        })),
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = context.globals?.locale
      return (
        <IntlProvider locale={locale}>
          <EnvironmentProvider>
            <Story />
          </EnvironmentProvider>
        </IntlProvider>
      )
    },
    (Story, context) => {
      useEffect(() => {
        if (isProduction) {
          ReactGA.send({ hitType: 'pageview', title: context.title })
        }
      }, [context.title])

      return <Story />
    },
  ],
  tags: ['autodocs'],
}

export default preview
