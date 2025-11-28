'use client'

import { type FC, type ReactNode, useMemo, useSyncExternalStore } from 'react'

import { defaultBreakpoint } from '../../themes/createBreakpoint'
import { defaultMediaQuery } from '../../themes/createMediaQuery'
import { useTheme } from '../useTheme'

import { EnvironmentContext } from './useEnvironment'

type Props = {
  children: ReactNode
  config?: {
    mobile?: string
  }
}

export const EnvironmentProvider: FC<Props> = ({ children, config }) => {
  const theme = useTheme()
  const mobileQuery =
    config?.mobile ?? theme.mediaQuery?.SCREEN_SMALL ?? defaultMediaQuery.SCREEN_SMALL
  const narrowQuery = `(max-width: ${defaultBreakpoint.SP}px)`

  const queries = useMemo(
    () => ({
      mobile: mobileQuery,
      narrow: narrowQuery,
    }),
    [mobileQuery, narrowQuery],
  )

  const subscribe = useMemo(
    () => (onStoreChange: () => void) => {
      const mobileMql = matchMedia(queries.mobile)
      const narrowMql = matchMedia(queries.narrow)

      mobileMql.addEventListener('change', onStoreChange)
      narrowMql.addEventListener('change', onStoreChange)

      return () => {
        mobileMql.removeEventListener('change', onStoreChange)
        narrowMql.removeEventListener('change', onStoreChange)
      }
    },
    [queries],
  )

  const getSnapshot = useMemo(
    () => () => ({
      isMobile: matchMedia(queries.mobile).matches,
      isNarrowView: matchMedia(queries.narrow).matches,
    }),
    [queries],
  )

  const getServerSnapshot = () => ({
    isMobile: false,
    isNarrowView: false,
  })

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return <EnvironmentContext.Provider value={state}>{children}</EnvironmentContext.Provider>
}
