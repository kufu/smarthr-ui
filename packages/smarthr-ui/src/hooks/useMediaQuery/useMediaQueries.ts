import { useCallback, useMemo, useRef, useSyncExternalStore } from 'react'

type MediaQueryListMap = {
  [key: string]: string
}

type MediaQueryMatches<T> = {
  [K in keyof T]: boolean
}

// 浅い比較（Shallow Compare）を行い、値が変わっているか判定するヘルパー
function shallowEqual(objA: any, objB: any) {
  if (Object.is(objA, objB)) return true
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is(objA[key], objB[key])) {
      return false
    }
  }
  return true
}

export const useMediaQueries = <T extends MediaQueryListMap>(queries: T): MediaQueryMatches<T> => {
  // クエリの変更検知を安定化させる
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableQueries = useMemo(() => queries, [JSON.stringify(queries)])

  const getServerSnapshot = useCallback(
    (): MediaQueryMatches<T> =>
      Object.keys(stableQueries).reduce((acc, key) => {
        acc[key as keyof T] = false
        return acc
      }, {} as MediaQueryMatches<T>),
    [stableQueries],
  )

  const lastSnapshotRef = useRef<MediaQueryMatches<T> | null>(null)

  const getSnapshot = useCallback((): MediaQueryMatches<T> => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return getServerSnapshot()
    }

    // 現在の最新のステータスを計算
    const nextSnapshot = Object.keys(stableQueries).reduce((acc, key) => {
      acc[key as keyof T] = window.matchMedia(stableQueries[key]).matches
      return acc
    }, {} as MediaQueryMatches<T>)

    // 前回と値が同じなら、前回のオブジェクト参照を返す（重要：再レンダリング抑制）
    if (lastSnapshotRef.current && shallowEqual(lastSnapshotRef.current, nextSnapshot)) {
      return lastSnapshotRef.current
    }

    // 値が変わっていれば、新しいオブジェクトを保存して返す
    lastSnapshotRef.current = nextSnapshot
    return nextSnapshot
  }, [stableQueries, getServerSnapshot])

  // 3. 購読（Subscribe）ロジック
  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined' || !window.matchMedia) {
        return () => {}
      }

      const matchMediaList = Object.values(stableQueries).map((query) => window.matchMedia(query))

      // どれか1つでも変更があったらReactに通知(callback)する
      matchMediaList.forEach((mql) => {
        mql.addEventListener('change', callback)
      })

      return () => {
        matchMediaList.forEach((mql) => {
          mql.removeEventListener('change', callback)
        })
      }
    },
    [stableQueries],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
