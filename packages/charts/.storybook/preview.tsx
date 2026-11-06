import { IntlProvider, ThemeProvider, createTheme } from 'smarthr-ui'
import 'smarthr-ui/smarthr-ui.css'
import '../src/styles/index.css'

import type { Preview } from '@storybook/react'

const theme = createTheme()

const preview: Preview = {
  decorators: [
    (Story) => (
      <IntlProvider locale="ja">
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
