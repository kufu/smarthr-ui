'use client'
import React, { FC, ReactNode, useSyncExternalStore } from 'react'

import { defaultBreakpoint } from '../../themes/createBreakpoint'

import { DeviceContext } from './useDevice'

const mediaQuery = {
  narrow: `(max-width: ${defaultBreakpoint.SP}px)`,
}

const subscribe = (onStoreChange: () => void) => {
  const matchQueryList = matchMedia(mediaQuery.narrow)
  matchQueryList.addEventListener('change', onStoreChange)

  return () => {
    matchQueryList.removeEventListener('change', onStoreChange)
  }
}

const getSnapshot = () => matchMedia(mediaQuery.narrow).matches

const getServerSnapshot = () => null

export const DeviceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const isNarrowView = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return <DeviceContext.Provider value={isNarrowView}>{children}</DeviceContext.Provider>
}
