import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react'

import { entries, fromEntries } from '../../libs/object'
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
      fromEntries(entries(queries).map(([key]) => [key, false] as const)) as MediaQueryMatches<T>,
    [queries],
  )

  const latest = useLatest({ queries, serverSnapshot })

  const functions = useMemo(() => {
    const getMatchMediaList = () =>
      entries(latest.queries).map(([key, query]) => [key, window.matchMedia(query)] as const)

    return {
      getMatchMediaList,
      getServerSnapshot: (() => latest.serverSnapshot) satisfies () => MediaQueryMatches<T>,
    }
  }, [latest])

  const getSnapshot = useCallback((): MediaQueryMatches<T> => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return serverSnapshot
    }

    const ret = fromEntries(
      functions.getMatchMediaList().map(([key, m]) => [key, m.matches] as const),
    )
    if (lastSnapshotRef.current && shallowEqual(lastSnapshotRef.current, ret)) {
      return lastSnapshotRef.current
    }
    lastSnapshotRef.current = ret
    return ret
  }, [serverSnapshot, functions])
  const subscribe = useCallback(
    (f: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {}
      }
      const matchMediaList = functions.getMatchMediaList()
      matchMediaList.forEach(([, m]) => {
        m.addEventListener('change', f)
      })
      return () => {
        matchMediaList.forEach(([, m]) => {
          m.removeEventListener('change', f)
        })
      }
    },
    [functions],
  )

  return useSyncExternalStore(subscribe, getSnapshot, functions.getServerSnapshot)
}
