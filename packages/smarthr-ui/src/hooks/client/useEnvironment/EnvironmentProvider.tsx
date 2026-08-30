'use client'

import { type FC, type ReactNode, useContext, useMemo, useRef, useSyncExternalStore } from 'react'

import { shallowEqual } from '../../../libs/shallowEqual'
import { defaultMediaQuery } from '../../../themes'
import { useTheme } from '../../client/useTheme'

import { type Environment, EnvironmentContext } from './useEnvironment'

type Props = {
  children: ReactNode
  environment?: Partial<Environment>
}

type MediaQueryMatches<T> = {
  [K in keyof T]: boolean
}

export const EnvironmentProvider: FC<Props> = ({ children, environment }) => {
  const theme = useTheme()
  const inheritedEnvironment = useContext(EnvironmentContext)
  const matches = useMediaQueries(theme?.mediaQuery ?? defaultMediaQuery)

  const baseEnvironment = {
    ...inheritedEnvironment,
    ...environment,
  }

  const state: Environment = {
    ...baseEnvironment,
    mobile: baseEnvironment.mobile ?? matches.SCREEN_SMALL,
    matches: baseEnvironment.matches ?? matches,
  }

  return <EnvironmentContext.Provider value={state}>{children}</EnvironmentContext.Provider>
}

const useMediaQueries = <T extends { [key: string]: string }>(queries: T): MediaQueryMatches<T> => {
  const lastSnapshotRef = useRef<MediaQueryMatches<T> | null>(null)

  // useLatest を使わず queries を直接依存配列に指定することで、functions が再作成され、
  // useSyncExternalStore が subscribe を再実行して新しいメディアクエリを監視できる
  // queries自体はthemeから取得する想定なので殆どの場合stableだが安全策として依存配列に直接指定する
  const functions = useMemo(() => {
    const queryEntries = Object.entries(queries)
    const serverSnapshot = queryEntries.reduce(
      (acc, [key]) => {
        acc[key] = false
        return acc
      },
      {} as Record<string, boolean>,
    ) as MediaQueryMatches<T>

    return {
      getServerSnapshot: (() => serverSnapshot) satisfies () => MediaQueryMatches<T>,
      getSnapshot: (): MediaQueryMatches<T> => {
        if (typeof window === 'undefined' || !window.matchMedia) {
          return serverSnapshot
        }

        const ret = queryEntries.reduce(
          (acc, [key, query]) => {
            acc[key] = window.matchMedia(query).matches
            return acc
          },
          {} as Record<string, boolean>,
        ) as MediaQueryMatches<T>

        if (lastSnapshotRef.current && shallowEqual(lastSnapshotRef.current, ret)) {
          return lastSnapshotRef.current
        }

        lastSnapshotRef.current = ret

        return ret
      },
      subscribe: (f: () => void) => {
        if (typeof window === 'undefined' || !window.matchMedia) {
          return () => {}
        }

        const mediaQueryList = queryEntries.map(([, query]) => {
          const m = window.matchMedia(query)
          m.addEventListener('change', f)
          return m
        })

        return () => {
          mediaQueryList.forEach((m) => m.removeEventListener('change', f))
        }
      },
    }
  }, [queries])

  return useSyncExternalStore(
    functions.subscribe,
    functions.getSnapshot,
    functions.getServerSnapshot,
  )
}
