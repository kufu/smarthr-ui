import { useEffect } from 'react'

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
// Esc is a IE/Edge specific value
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

export const useHandleEscape = (callback?: () => void) => {
  useEffect(() => {
    if (!callback) {
      return
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (ESCAPE_KEY_REGEX.test(e.key)) {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [callback])
}
