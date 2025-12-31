import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react'

import { entries, fromEntries } from '../../libs/object'
import { shallowEqual } from '../../libs/shallowEqual'

type MediaQueryListMap = {
  [key: string]: string
}

type MediaQueryMatches<T> = {
  [K in keyof T]: boolean
}

export const useMediaQueries = <T extends MediaQueryListMap>(queries: T): MediaQueryMatches<T> => {
  const matchMediaList = useMemo(
    () => entries(queries).map(([key, query]) => [key, window.matchMedia(query)] as const),
    [queries],
  )
  const lastSnapshotRef = useRef<MediaQueryMatches<T> | null>(null)

  const getServerSnapshot = useCallback(
    (): MediaQueryMatches<T> => fromEntries(matchMediaList.map(([key]) => [key, false] as const)),
    [matchMediaList],
  ) satisfies () => MediaQueryMatches<T>

  const getSnapshot = useCallback((): MediaQueryMatches<T> => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return getServerSnapshot()
    }

    const ret = fromEntries(matchMediaList.map(([key, m]) => [key, m.matches] as const))
    if (lastSnapshotRef.current && shallowEqual(lastSnapshotRef.current, ret)) {
      return lastSnapshotRef.current
    }
    lastSnapshotRef.current = ret
    return ret
  }, [matchMediaList, getServerSnapshot])

  const subscribe = useCallback(
    (f: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {}
      }
      matchMediaList.forEach(([, m]) => {
        m.addEventListener('change', f)
      })
      return () => {
        matchMediaList.forEach(([, m]) => {
          m.removeEventListener('change', f)
        })
      }
    },
    [matchMediaList],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
