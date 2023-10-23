import { useContext, useMemo } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'

import { ThemeContext } from '../themes/tailwind/TailwindThemeProvider'

export const useTheme = () => {
  const { config } = useContext(ThemeContext)

  return useMemo(() => {
    const { theme } = resolveConfig(config)
    return theme
  }, [config])
}
