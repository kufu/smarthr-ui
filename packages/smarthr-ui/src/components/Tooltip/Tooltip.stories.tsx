import * as React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'

import { createTheme } from '../../styles/createTheme'
import { ThemeProvider } from '../../styles/ThemeProvider'
import Tooltip from './Tooltip'

const theme = createTheme()
const ThemeDecorator = (storyFn: any) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
addDecorator(ThemeDecorator)

const Wrapper = ({ children }: any) => <div style={{ padding: '70px 0 0 20px' }}>{children}</div>

storiesOf('Tooltip/size', module)
  .add('s', () => (
    <Wrapper>
      <Tooltip text="Hovered!!" size="s">
        Hover me.
      </Tooltip>
    </Wrapper>
  ))
  .add('m', () => (
    <Wrapper>
      <Tooltip text="Hovered!!" size="m">
        Hover me.
      </Tooltip>
    </Wrapper>
  ))
  .add('l', () => (
    <Wrapper>
      <Tooltip text="Hovered!!" size="l">
        Hover me.
      </Tooltip>
    </Wrapper>
  ))
