'use client'
import { createContext, useContext } from 'react'

export const DeviceContext = createContext<boolean | null>(null)

export const useDevice = () => {
  const isNarrowView = useContext(DeviceContext)
  return { isNarrowView }
}
