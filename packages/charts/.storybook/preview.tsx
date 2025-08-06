import { ThemeProvider, createTheme } from 'smarthr-ui'
import 'smarthr-ui/smarthr-ui.css'
import '../src/styles/index.css'

import type { Preview } from '@storybook/react'

const theme = createTheme()

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <div style={{ padding: '16px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default preview
