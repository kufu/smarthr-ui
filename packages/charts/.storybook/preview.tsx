import { IntlProvider, ThemeProvider, createTheme, locales } from 'smarthr-ui'
import 'smarthr-ui/smarthr-ui.css'
import '../src/styles/index.css'

import type { Preview } from '@storybook/react'

const theme = createTheme()

const preview: Preview = {
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
    (Story, context) => (
      <IntlProvider locale={context.globals?.locale ?? 'ja'}>
        <ThemeProvider theme={theme}>
          <div style={{ padding: '16px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </IntlProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default preview
