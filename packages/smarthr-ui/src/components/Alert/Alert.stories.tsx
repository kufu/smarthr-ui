import * as React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'

import { createTheme } from '../../themes/createTheme'
import { ThemeProvider } from '../../themes/ThemeProvider'
import Alert from './Alert'

const theme = createTheme()
const ThemeDecorator = (storyFn: any) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(ThemeDecorator)

const dummyText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'

storiesOf('Alert', module).add('wide', () => (
  <Alert type="success" wide={true}>
    {dummyText}
  </Alert>
))

storiesOf('Alert/type', module)
  .add('success', () => <Alert type="success">success!!</Alert>)
  .add('info', () => <Alert type="info">info!!</Alert>)
  .add('warning', () => <Alert type="warning">warning!!</Alert>)
  .add('danger', () => <Alert type="danger">danger!!</Alert>)

storiesOf('Alert/size', module)
  .add('s', () => (
    <Alert type="success" size="s">
      {dummyText}
    </Alert>
  ))
  .add('m', () => (
    <Alert type="success" size="m">
      {dummyText}
    </Alert>
  ))
  .add('l', () => (
    <Alert type="success" size="l">
      {dummyText}
    </Alert>
  ))
