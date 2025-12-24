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

import '../src/styles/index.css'
import { IntlProvider } from '../src'
import * as locales from '../src/intl/locales'
import { backgroundColor } from '../src/themes'

import type { Preview } from '@storybook/react-webpack5'

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
          <Story />
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
