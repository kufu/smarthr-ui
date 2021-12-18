import useEventListener from '../../hooks/useEventListener'

export function useGlobalKeyDown(callback: (e: KeyboardEvent) => void) {
  useEventListener(window, 'keydown', callback)
}
