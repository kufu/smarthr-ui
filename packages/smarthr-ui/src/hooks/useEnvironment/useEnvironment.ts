'use client'

import { createContext, useContext } from 'react'

import type { CreatedMediaQueryTheme } from '../../themes/createMediaQuery'

export type Environment = {
  mobile: boolean
  matches: Record<keyof CreatedMediaQueryTheme, boolean>
}

const defaultEnvironment: Environment = {
  mobile: false,
  matches: {
    SCREEN_SMALL: false,
    COLOR_MODE_FORCED: false,
    COLOR_SCHEME_LIGHT: true,
    COLOR_SCHEME_DARK: false,
    MOTION_REDUCED: false,
  },
}

export const EnvironmentContext = createContext<Environment | null>(null)

export const useEnvironment = () => {
  const environment = useContext(EnvironmentContext)
  return environment || defaultEnvironment
}
