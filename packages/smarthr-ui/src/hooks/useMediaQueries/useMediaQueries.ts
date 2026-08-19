import { useMemo, useRef, useSyncExternalStore } from 'react'

import { shallowEqual } from '../../libs/shallowEqual'
import { useLatest } from '../useLatest'

type MediaQueryListMap = {
  [key: string]: string
}

type MediaQueryMatches<T> = {
  [K in keyof T]: boolean
}

export const useMediaQueries = <T extends MediaQueryListMap>(queries: T): MediaQueryMatches<T> => {
  const lastSnapshotRef = useRef<MediaQueryMatches<T> | null>(null)

  const serverSnapshot = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(queries).map(([key]) => [key, false] as const),
      ) as MediaQueryMatches<T>,
    [queries],
  )

  const latest = useLatest({ queries, serverSnapshot })

  const functions = useMemo(() => {
    const getMatchMediaList = () =>
      Object.entries(latest.queries).map(([key, query]) => [key, window.matchMedia(query)] as const)

    return {
      getServerSnapshot: (() => latest.serverSnapshot) satisfies () => MediaQueryMatches<T>,
      getSnapshot: (): MediaQueryMatches<T> => {
        if (typeof window === 'undefined' || !window.matchMedia) {
          return latest.serverSnapshot
        }

        const ret = Object.fromEntries(
          getMatchMediaList().map(([key, m]) => [key, m.matches] as const),
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

        const matchMediaList = getMatchMediaList()

        matchMediaList.forEach(([, m]) => {
          m.addEventListener('change', f)
        })

        return () => {
          matchMediaList.forEach(([, m]) => {
            m.removeEventListener('change', f)
          })
        }
      },
    }
  }, [latest])

  return useSyncExternalStore(
    functions.subscribe,
    functions.getSnapshot,
    functions.getServerSnapshot,
  )
}
