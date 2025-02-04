import { useEffect } from 'react'

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
// Esc is a IE/Edge specific value
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

export const useHandleEscape = (cb: () => void) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (ESCAPE_KEY_REGEX.test(e.key)) {
        cb()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [cb])
}
