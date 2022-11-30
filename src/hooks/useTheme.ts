import { useContext } from 'react'

import { ThemeContext } from '../themes/ThemeProvider'
import { CreatedTheme } from '../themes/createTheme'

export type Theme = CreatedTheme

export const useTheme = () => {
  const theme = useContext(ThemeContext)
  return theme
}
