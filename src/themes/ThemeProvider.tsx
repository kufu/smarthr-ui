import * as React from 'react'

import { CreatedTheme, createTheme } from '../themes/createTheme'

export const ThemeContext = React.createContext<CreatedTheme>(createTheme())
const { Provider } = ThemeContext

type Props = {
  theme: CreatedTheme
  children?: React.ReactNode
}

export const ThemeProvider: React.VFC<Props> = ({ theme, children }) => (
  <Provider value={theme}>{children}</Provider>
)
