import { useCallback, useEffect } from 'react'

const matchesDisabledState = (element: Element): boolean =>
  element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'

const isElementDisabled = (element: Element): boolean => {
  if (matchesDisabledState(element)) {
    return true
  }

  return Array.from(element.querySelectorAll('*')).some(matchesDisabledState)
}

const KEY_UP_REGEX = /^(Arrow)?(Up|Left)$/
const KEY_DOWN_REGEX = /^(Arrow)?(Down|Right)$/

const moveFocus = (element: Element, direction: 1 | -1) => {
  const { hoveredItem, tabbableItems, focusedIndex } = Array.from(
    element.querySelectorAll('li > *'),
  ).reduce(
    (
      acc: {
        hoveredItem: Element | null
        tabbableItems: Element[]
        focusedIndex: number
      },
      item,
    ) => {
      if (item.matches(':hover') && acc.hoveredItem === null) {
        acc.hoveredItem = item
      }

      if (!isElementDisabled(item)) {
        acc.tabbableItems.push(item)

        if (document.activeElement === item) {
          acc.focusedIndex = acc.tabbableItems.length - 1
        }
      }

      return acc
    },
    {
      hoveredItem: null,
      tabbableItems: [],
      focusedIndex: -1,
    },
  )

  let nextIndex = 0

  if (focusedIndex > -1) {
    // フォーカスされているアイテムが存在する場合
    nextIndex = (focusedIndex + direction + tabbableItems.length) % tabbableItems.length
  } else if (hoveredItem) {
    // ホバー状態のアイテムが存在する場合
    nextIndex =
      (tabbableItems.indexOf(hoveredItem) + direction + tabbableItems.length) % tabbableItems.length
  } else if (direction === -1) {
    nextIndex = tabbableItems.length - 1
  }

  const nextItem = tabbableItems[nextIndex]

  if (nextItem instanceof HTMLElement) {
    nextItem.focus()
  }
}

const useKeyboardNavigation = (containerRef: React.RefObject<HTMLElement>) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!containerRef.current || !document.activeElement) {
        return
      }

      if (KEY_UP_REGEX.test(e.key)) {
        moveFocus(containerRef.current, -1)
      } else if (KEY_DOWN_REGEX.test(e.key)) {
        moveFocus(containerRef.current, 1)
      }
    },
    [containerRef],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

export default useKeyboardNavigation
