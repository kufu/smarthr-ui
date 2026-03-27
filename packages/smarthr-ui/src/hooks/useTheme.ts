import { useContext } from 'react'

import { ThemeContext } from '../themes'

import type { CreatedTheme } from '../themes'

export type Theme = CreatedTheme

export const useTheme = () => useContext(ThemeContext)
