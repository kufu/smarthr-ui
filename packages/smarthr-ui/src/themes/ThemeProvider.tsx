'use client'

import { type FC, type ReactNode, createContext } from 'react'

import { type CreatedTheme, createTheme } from '../themes/createTheme'

export const ThemeContext = createContext<CreatedTheme>(createTheme())
const { Provider } = ThemeContext

type Props = {
  theme: CreatedTheme
  children?: ReactNode
}

export const ThemeProvider: FC<Props> = ({ theme, children }) => (
  <Provider value={theme}>{children}</Provider>
)
