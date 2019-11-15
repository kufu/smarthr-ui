import { useContext } from 'react'

import { CreatedTheme } from '../themes/createTheme'
import { ThemeContext } from '../themes/ThemeProvider'

export type Theme = CreatedTheme

export const useTheme = () => {
  const theme = useContext(ThemeContext)
  return theme
}
