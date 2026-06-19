import { useEffect, useRef } from 'react'

export function useGlobalKeyDown(callback: (e: KeyboardEvent) => void) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      callbackRef.current(e)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
