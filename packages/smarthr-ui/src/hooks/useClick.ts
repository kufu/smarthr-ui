import { RefObject, useCallback, useEffect } from 'react'

export function useClick(
  innerRefs: Array<RefObject<HTMLElement>>,
  innerCallback: (e: MouseEvent) => void,
  outerCallback: (e: MouseEvent) => void,
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (innerRefs.some((target) => isEventIncludedParent(e, target.current))) {
        innerCallback(e)

        return
      }

      outerCallback(e)
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [innerRefs, innerCallback, outerCallback])
}

function isEventIncludedParent(e: MouseEvent, parent: Element | null): boolean {
  if (!parent) return false

  const path = e.composedPath()

  if (path.length === 0) return false

  return path.includes(parent)
}
