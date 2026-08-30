'use client'

import { type FC, type ReactNode, createContext, useContext } from 'react'

import { type CreatedTheme, createTheme } from '../themes'

// TODO: リポジトリ内では利用していない。smarthr-design-systemからdeep importされている
// 可能性があるため残している。利用状況を確認し、使われていなければ削除する:
// import type { Theme } from 'smarthr-ui/lib/hooks/useTheme'
/** @public */
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
