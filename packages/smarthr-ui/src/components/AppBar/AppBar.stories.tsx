import * as React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'

import { createTheme } from '../../styles/createTheme'
import { ThemeProvider } from '../../styles/ThemeProvider'
import AppBar from './AppBar'

const theme = createTheme()
const ThemeDecorator = (storyFn: any) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(ThemeDecorator)

storiesOf('AppBar', module)
  .add('s', () => <AppBar size="s">Small</AppBar>)
  .add('m', () => <AppBar size="m">Medium</AppBar>)
  .add('l', () => <AppBar size="l">Large</AppBar>)
