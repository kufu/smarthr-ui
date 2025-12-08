import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react'

import { entries, fromEntries } from '../../libs/object'
import { shallowEquali } from '../../libs/shallowEqual'

type MediaQueryListMap = {
  [key: string]: string
}

type MediaQueryMatches<T> = {
  [K in keyof T]: boolean
}

export const useMediaQueries = <T extends MediaQueryListMap>(queries: T): MediaQueryMatches<T> => {
  const mediaQueryLists = useMemo(
    () =>
      fromEntries(entries(queries).map(([key, query]) => [key, window.matchMedia(query)] as const)),
    [queries],
  )
  const lastSnapshotRef = useRef<MediaQueryMatches<T> | null>(null)

  const getServerSnapshot = useCallback(
    (): MediaQueryMatches<T> => fromEntries(entries(queries).map(([key]) => [key, false] as const)),
    [queries],
  ) satisfies () => MediaQueryMatches<T>

  const getSnapshot = useCallback((): MediaQueryMatches<T> => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return getServerSnapshot()
    }

    if (lastSnapshotRef.current && shallowEquali(lastSnapshotRef.current, mediaQueryLists)) {
      return lastSnapshotRef.current
    }

    lastSnapshotRef.current = mediaQueryLists
    return mediaQueryLists
  }, [mediaQueryLists, getServerSnapshot])

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {}
      }

      // const matchMediaList = Object.values(queries).map((query) => window.matchMedia(query))

      entries(mediaQueryLists).forEach(([, v]) => {
        v.addEventListener('change', callback)
      })

      return () => {
        entries(mediaQueryLists).forEach(([, mql]) => {
          mql.removeEventListener('change', callback)
        })
      }
    },
    [mediaQueryLists],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
