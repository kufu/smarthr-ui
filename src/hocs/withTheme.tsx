import * as React from 'react'

import { CreatedTheme } from '../themes/createTheme'
import { ThemeContext } from '../themes/ThemeProvider'

const Consumer = ThemeContext.Consumer

export interface InjectedProps {
  theme: CreatedTheme
}

export const withTheme = <OriginalProps extends {}>(
  WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>,
) => (props: OriginalProps) => (
  <Consumer>{(theme: CreatedTheme) => <WrappedComponent theme={theme} {...props} />}</Consumer>
)
