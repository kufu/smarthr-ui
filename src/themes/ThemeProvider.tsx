import * as React from 'react'

import { CreatedTheme, createTheme } from '../themes/createTheme'

export const ThemeContext = React.createContext<CreatedTheme>(createTheme())
const { Provider } = ThemeContext

interface Props extends React.Props<Record<string, unknown>> {
  theme: CreatedTheme
}

export const ThemeProvider: React.FC<Props> = ({ theme, children }) => {
  return <Provider value={theme}>{children}</Provider>
}
