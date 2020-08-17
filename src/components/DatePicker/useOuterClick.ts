import { useCallback, useEffect } from 'react'

export function useOuterClick(
  targets: Array<HTMLElement | null>,
  callback: (e: MouseEvent) => void,
) {
  const handleOuterClick = useCallback(
    (e: MouseEvent) => {
      if (targets.some((target) => isEventIncludedParent(e, target))) {
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

function isElementIncludedParent(target: Element | null, parent: Element | null): boolean {
  if (!target || !parent) return false
  return target === parent || isElementIncludedParent(target.parentElement, parent)
}

function isEventIncludedParent(e: MouseEvent, parent: Element | null): boolean {
  const path = e.composedPath && e.composedPath()
  if (!path) {
    // fallback for IE
    if (e.target instanceof Element) {
      return isElementIncludedParent(e.target, parent)
    }
    return false
  }
  if (path.length === 0 || !parent) return false
  return path.includes(parent)
}
