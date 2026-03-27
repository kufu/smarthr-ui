'use client'

import { type FC, type ReactNode, createContext, useContext } from 'react'

import { type CreatedTheme, createTheme } from '../themes'

export type Theme = CreatedTheme

export const ThemeContext = createContext<CreatedTheme>(createTheme())
const { Provider } = ThemeContext

type ThemeProviderProps = {
  theme: CreatedTheme
  children?: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => (
  <Provider value={theme}>{children}</Provider>
)

export const useTheme = () => useContext(ThemeContext)
