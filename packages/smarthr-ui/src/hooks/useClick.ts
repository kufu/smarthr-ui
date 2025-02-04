import { RefObject, useCallback, useEffect } from 'react'

export function useClick(
  innerRefs: Array<RefObject<HTMLElement>>,
  innerCallback: (e: MouseEvent) => void,
  outerCallback: (e: MouseEvent) => void,
) {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (innerRefs.some((target) => isEventIncludedParent(e, target.current))) {
        innerCallback(e)

        return
      }

      outerCallback(e)
    },
    // spread innerRefs to compare deps one by one
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...innerRefs, innerCallback, outerCallback],
  )

  useEffect(() => {
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [handleClick])
}

function isEventIncludedParent(e: MouseEvent, parent: Element | null): boolean {
  if (!parent) return false

  const path = e.composedPath()

  if (path.length === 0) return false

  return path.includes(parent)
}
