import * as React from 'react'

import { ThemeProperty, CreatedTheme, createTheme } from '../themes/createTheme'

export const ThemeContext = React.createContext<CreatedTheme>(createTheme())
const { Provider } = ThemeContext

interface Props extends React.Props<{}> {
  theme?: ThemeProperty
}

export const ThemeProvider: React.FC<Props> = ({ theme = {}, children }) => {
  return <Provider value={createTheme(theme)}>{children}</Provider>
}
