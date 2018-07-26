import * as React from 'react'

import { ThemeContext } from '../themes/ThemeProvider'
import { CreatedTheme } from '../themes/createTheme'

const Consumer: any = ThemeContext.Consumer

export interface InjectedProps {
  theme: CreatedTheme
}

export const withTheme = <OriginalProps extends {}>(
  WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>,
) => (props: OriginalProps) => (
  <Consumer>{(theme: CreatedTheme) => <WrappedComponent theme={theme} {...props} />}</Consumer>
)
