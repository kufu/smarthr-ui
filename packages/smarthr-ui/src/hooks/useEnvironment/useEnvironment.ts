'use client'

import { createContext, useContext } from 'react'

export type Environment = {
  mobile: boolean
  matches: {
    SCREEN_SMALL: boolean
    SCREEN_INFINITY: boolean
    COLOR_MODE_FORCED: boolean
    COLOR_SCHEME_LIGHT: boolean
    COLOR_SCHEME_DARK: boolean
    MOTION_REDUCED: boolean
  }
}

const defaultEnvironment: Environment = {
  mobile: false,
  matches: {
    SCREEN_SMALL: false,
    SCREEN_INFINITY: true,
    COLOR_MODE_FORCED: false,
    COLOR_SCHEME_LIGHT: true,
    COLOR_SCHEME_DARK: false,
    MOTION_REDUCED: false,
  },
}

export const EnvironmentContext = createContext<Environment>(defaultEnvironment)

export const useEnvironment = () => useContext(EnvironmentContext)
