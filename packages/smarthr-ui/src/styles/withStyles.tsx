import * as React from 'react'

import { ThemeContext } from './ThemeProvider'
import { CreatedTheme } from './createTheme'

const Consumer: any = ThemeContext.Consumer

export interface InjectedProps {
  themeStyle: any
}

export function withStyles(styleCreator: (theme: CreatedTheme) => {}) {
  return <OriginalProps extends {}>(
    WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>,
  ) => (props: OriginalProps) => (
    <Consumer>
      {(theme: CreatedTheme) => <WrappedComponent themeStyle={styleCreator(theme)} {...props} />}
    </Consumer>
  )
}
