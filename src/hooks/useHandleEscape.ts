import { useCallback } from 'react'
import useEventListener from './useEventListener'

export const useHandleEscape = (cb: () => void) => {
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
      // Esc is a IE/Edge specific value
      if (e.key === 'Escape' || e.key === 'Esc') {
        cb()
      }
    },
    [cb],
  )

  useEventListener(document, 'keydown', handleKeyPress)
}
