import * as React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'

import { createTheme } from '../../themes/createTheme'
import { ThemeProvider } from '../../themes/ThemeProvider'
import Flash from './Flash'
import Alert from '../Alert/'

const theme = createTheme()
const ThemeDecorator = (storyFn: any) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(ThemeDecorator)

storiesOf('Flash', module).add('default', () => (
  <Flash>
    <Alert type="info">This is flash message.</Alert>
  </Flash>
))
