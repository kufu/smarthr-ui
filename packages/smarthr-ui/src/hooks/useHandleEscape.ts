import { useEffect, useMemo } from 'react'

const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

export const useHandleEscape = (cb?: () => void) => {
  const handleKeyPress = useMemo(
    () =>
      cb
        ? (e: KeyboardEvent) => {
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
            // Esc is a IE/Edge specific value
            if (ESCAPE_KEY_REGEX.test(e.key)) {
              cb()
            }
          }
        : null,
    [cb],
  )

  useEffect(() => {
    if (!handleKeyPress) {
      return
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
}
