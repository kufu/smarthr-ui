import { type RefObject, useEffect, useRef } from 'react'

export function useOuterClick(
  targets: Array<RefObject<HTMLElement>>,
  callback: (e: MouseEvent) => void,
) {
  // callbackをrefに保存（毎レンダリング時に最新の値を設定）
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const handleOuterClick = (e: MouseEvent) => {
      if (targets.every((target) => isEventExcludedParent(e, target.current))) {
        callbackRef.current(e)
      }
    }

    window.addEventListener('click', handleOuterClick)

    return () => {
      window.removeEventListener('click', handleOuterClick)
    }
  }, [targets])
}

function isEventExcludedParent(e: MouseEvent, parent: Element | null): boolean {
  if (!parent) return false

  const path = e.composedPath()

  if (path.length === 0) return false

  return !path.includes(parent)
}
