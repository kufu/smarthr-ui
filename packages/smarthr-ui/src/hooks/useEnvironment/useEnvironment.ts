'use client'
import { createContext, useContext } from 'react'

export const EnvironmentContext = createContext<{
  isMobile: boolean
} | null>(null)

export const useEnvironment = () => {
  const context = useContext(EnvironmentContext)
  return {
    isMobile: context?.isMobile ?? false,
  }
}
