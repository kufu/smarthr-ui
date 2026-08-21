import { type RefObject, useEffect } from 'react'

import { useLatest } from './useLatest'

// TODO: useOuterClickと統合する
export function useClick(
  innerRefs: Array<RefObject<HTMLElement>>,
  innerCallback: (e: MouseEvent) => void,
  outerCallback: (e: MouseEvent) => void,
) {
  const latest = useLatest({ innerRefs, innerCallback, outerCallback })

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (latest.innerRefs.some((target) => isEventIncludedParent(e, target.current))) {
        latest.innerCallback(e)

        return
      }

      latest.outerCallback(e)
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [latest])
}

function isEventIncludedParent(e: MouseEvent, parent: Element | null): boolean {
  if (!parent) return false

  const path = e.composedPath()

  if (path.length === 0) return false

  return path.includes(parent)
}
