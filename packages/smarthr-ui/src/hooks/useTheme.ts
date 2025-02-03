import { useContext } from 'react'

import { ThemeContext } from '../themes/ThemeProvider'
import { CreatedTheme } from '../themes/createTheme'

export type Theme = CreatedTheme

export const useTheme = () => useContext(ThemeContext)
