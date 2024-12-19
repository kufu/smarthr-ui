import { useCallback, useMemo, useSyncExternalStore } from 'react'

export const mediaQuery = {
  desktop: 'min-width: 752px',
  mobile: 'max-width: 751px',
} as const

export const useMediaQuery = (query: string) => {
  const mediaQueryList = useMemo(
    () => (typeof window === 'undefined' ? null : matchMedia(`(${query})`)),
    [query],
  )

  const subscribe = useCallback(
    (callback: () => void) => {
      mediaQueryList?.addEventListener('change', callback)
      return () => {
        mediaQueryList?.removeEventListener('change', callback)
      }
    },
    [mediaQueryList],
  )

  return useSyncExternalStore(
    subscribe,
    () => mediaQueryList?.matches ?? false,
    () => false,
  )
}
