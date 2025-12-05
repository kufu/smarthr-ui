import { useCallback, useMemo, useSyncExternalStore } from 'react'

export const useMediaQuery = (query: string) => {
  const mediaQueryList = useMemo(() => window?.matchMedia(query), [query])

  const subscribe = useCallback(
    (f: () => void) => {
      if (!mediaQueryList) {
        return () => undefined
      }
      mediaQueryList.addEventListener('change', f)
      return () => {
        mediaQueryList.removeEventListener('change', f)
      }
    },
    [mediaQueryList],
  )

  const getSnapshot = useCallback(() => mediaQueryList?.matches ?? false, [mediaQueryList])

  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
