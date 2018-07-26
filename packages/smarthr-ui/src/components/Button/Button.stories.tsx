import * as React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { createTheme } from '../../themes/createTheme'
import { ThemeProvider } from '../../themes/ThemeProvider'
import Button from './Button'

const theme = createTheme()
const ThemeDecorator = (storyFn: any) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(ThemeDecorator)

const onClick = action('click!')

storiesOf('Button/size', module)
  .add('s', () => (
    <Button element="a" to="#" size="s">
      Small
    </Button>
  ))
  .add('m', () => (
    <Button element="a" to="#" size="m">
      Medium
    </Button>
  ))
  .add('l', () => (
    <Button element="a" to="#" size="l">
      Large
    </Button>
  ))

storiesOf('Button/element', module)
  .add('button', () => (
    <Button element="button" size="m" onClick={onClick}>
      Button
    </Button>
  ))
  .add('input', () => (
    <Button element="input" size="m">
      input
    </Button>
  ))
  .add('a', () => (
    <Button element="a" to="#" size="m">
      a
    </Button>
  ))

storiesOf('Button/disabled', module)
  .add('true', () => (
    <Button element="button" size="m" disabled={true} onClick={onClick}>
      Button
    </Button>
  ))
  .add('false', () => (
    <Button element="button" size="m" disabled={false} onClick={onClick}>
      input
    </Button>
  ))
