import { useMemo, useSyncExternalStore } from 'react'

export const mediaQuery = {
  desktop: '(min-width: 752px)',
} as const

const NOOP = () => undefined
const RETURN_FALSE = () => false

export const useMediaQuery = (query: string) => {
  const mediaQueryList = useMemo(
    () => (typeof window === 'undefined' ? null : matchMedia(query)),
    [query],
  )

  const syncArgs = useMemo(
    () => ({
      subscribe: (callback: () => void) => {
        if (!mediaQueryList) {
          return NOOP
        }

        mediaQueryList.addEventListener('change', callback)

        return () => {
          mediaQueryList.removeEventListener('change', callback)
        }
      },
      getSnapshot: () => mediaQueryList?.matches ?? false,
    }),
    [mediaQueryList],
  )

  return useSyncExternalStore(syncArgs.subscribe, syncArgs.getSnapshot, RETURN_FALSE)
}
