'use client'
// HINT: このhookは外部公開されているため、安全のため use clientを残す

import { createContext, useContext } from 'react'

import type { CreatedMediaQueryTheme } from '../../../themes'

export type Environment = {
  mobile: boolean
  matches: Record<keyof CreatedMediaQueryTheme, boolean>
}

export const EnvironmentContext = createContext<Environment | null>(null)

export const useEnvironment = () => {
  const environment = useContext(EnvironmentContext)

  if (environment === null) {
    throw new Error('useEnvironment は EnvironmentProvider の内側で使用してください')
  }

  return environment
}
