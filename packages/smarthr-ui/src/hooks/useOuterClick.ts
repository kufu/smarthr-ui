import { type RefObject, useEffect } from 'react'

import { useLatest } from './useLatest'

export function useOuterClick(
  targets: Array<RefObject<HTMLElement>>,
  callback: (e: MouseEvent) => void,
) {
  const latest = useLatest({ targets, callback })

  useEffect(() => {
    const handleOuterClick = (e: MouseEvent) => {
      if (latest.targets.every((target) => isEventExcludedParent(e, target.current))) {
        latest.callback(e)
      }
    }

    window.addEventListener('click', handleOuterClick)

    return () => {
      window.removeEventListener('click', handleOuterClick)
    }
  }, [latest])
}

function isEventExcludedParent(e: MouseEvent, parent: Element | null): boolean {
  if (!parent) return false

  const path = e.composedPath()

  if (path.length === 0) return false

  return !path.includes(parent)
}
