import { useContext } from 'react'

// eslint-disable-next-line smarthr/require-barrel-import
import { ThemeContext } from '../themes/ThemeProvider'

import type { CreatedTheme } from '../themes'

export type Theme = CreatedTheme

export const useTheme = () => useContext(ThemeContext)
