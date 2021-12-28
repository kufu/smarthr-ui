import { RefObject, useCallback, useEffect } from 'react'

export function useOuterClick(
  targets: Array<RefObject<HTMLElement>>,
  callback: (e: MouseEvent) => void,
) {
  const handleOuterClick = useCallback(
    (e: MouseEvent) => {
      if (targets.some((target) => isEventIncludedParent(e, target.current))) {
        return
      }
      callback(e)
    },
    // spread targets to compare deps one by one
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...targets, callback],
  )

  useEffect(() => {
    window.addEventListener('click', handleOuterClick)
    return () => {
      window.removeEventListener('click', handleOuterClick)
    }
  }, [handleOuterClick])
}

function isEventIncludedParent(e: MouseEvent, parent: Element | null): boolean {
  const path = e.composedPath()
  if (path.length === 0 || !parent) return false
  return path.includes(parent)
}
