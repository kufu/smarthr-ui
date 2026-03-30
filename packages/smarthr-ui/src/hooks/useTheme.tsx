'use client'

import { type FC, type ReactNode, createContext, useContext } from 'react'

import { type CreatedTheme, createTheme } from '../themes'

export type Theme = CreatedTheme

export const ThemeContext = createContext<CreatedTheme>(createTheme())

export const useTheme = () => useContext(ThemeContext)

type ThemeProviderProps = {
  theme: CreatedTheme
  children?: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ theme, children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
)
