import { useContext } from 'react'

import { ThemeContext } from '../themes/ThemeProvider'

import type { CreatedTheme } from '../themes'

export type Theme = CreatedTheme

export const useTheme = () => useContext(ThemeContext)
