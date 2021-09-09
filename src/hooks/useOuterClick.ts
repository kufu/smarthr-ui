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

function isElementIncludedParent(target: Element | null, parent: Element | null): boolean {
  if (!target || !parent) return false
  return target === parent || isElementIncludedParent(getParent(target), parent)
}

function isEventIncludedParent(e: MouseEvent, parent: Element | null): boolean {
  const path = e.composedPath && e.composedPath()
  if (!path) {
    // IE11 では composedPath は使えないため、再帰的に親を辿る
    if (e.target instanceof Element) {
      return isElementIncludedParent(e.target, parent)
    }
    return false
  }
  if (path.length === 0 || !parent) return false
  return path.includes(parent)
}

function getParent(element: Element): HTMLElement | SVGElement | null {
  if (element.parentElement) {
    return element.parentElement
  }
  // IE11 では SVG 要素の parentElement が定義されていないため parentNode を参照する
  const node = element.parentNode
  if (node instanceof HTMLElement || node instanceof SVGElement) {
    return node
  }
  return null
}
