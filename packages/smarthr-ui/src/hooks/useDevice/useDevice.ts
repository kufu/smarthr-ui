'use client'
import { createContext, useContext } from 'react'

export const DeviceContext = createContext<boolean | null>(null)

export const useDevice = () => ({ isNarrowView: useContext(DeviceContext) })
