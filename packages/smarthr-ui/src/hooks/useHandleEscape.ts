import { useEffect } from 'react'

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
// Esc is a IE/Edge specific value
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

export const useHandleEscape = (memoizedCallback?: () => void) => {
  useEffect(() => {
    if (!memoizedCallback) {
      return
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (ESCAPE_KEY_REGEX.test(e.key)) {
        memoizedCallback()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [memoizedCallback])
}
