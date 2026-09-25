import { useCallback } from 'react'

// TODO: React v18を切れたらclientから移動できるか確認
import { useCallbackRefCleanupForReact18 } from './useCallbackRefCleanupForReact18'

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
// Esc is a IE/Edge specific value
const ESCAPE_KEY_REGEX = /^Esc(ape)?$/

export const useEscapeCallbackRef = (memoizedCallback: () => void) =>
  useCallbackRefCleanupForReact18(
    useCallback(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (ESCAPE_KEY_REGEX.test(e.key)) {
          memoizedCallback()
        }
      }

      document.addEventListener('keydown', handleKeyPress)

      return () => document.removeEventListener('keydown', handleKeyPress)
    }, [memoizedCallback]),
  )
