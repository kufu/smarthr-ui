import { type RefObject, useEffect } from 'react'

export function useOuterClick(
  targets: Array<RefObject<HTMLElement>>,
  callback: (e: MouseEvent) => void,
) {
  useEffect(() => {
    const handleOuterClick = (e: MouseEvent) => {
      if (targets.every((target) => isEventExcludedParent(e, target.current))) {
        callback(e)
      }
    }

    window.addEventListener('click', handleOuterClick)

    return () => {
      window.removeEventListener('click', handleOuterClick)
    }
  }, [callback, targets])
}

function isEventExcludedParent(e: MouseEvent, parent: Element | null): boolean {
  if (!parent) return false

  const path = e.composedPath()

  if (path.length === 0) return false

  return !path.includes(parent)
}
