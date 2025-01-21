import { useCallback, useEffect } from 'react'

const matchesDisabledState = (element: Element): boolean =>
  element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'

const isElementDisabled = (element: Element): boolean => {
  if (matchesDisabledState(element)) {
    return true
  }

  return Array.from(element.querySelectorAll('*')).some(matchesDisabledState)
}

const moveFocus = (
  direction: 1 | -1,
  enabledItems: Element[],
  focusedIndex: number,
  hoveredItem: Element | null,
) => {
  let nextIndex = 0

  if (focusedIndex > -1) {
    // フォーカスされているアイテムが存在する場合
    nextIndex = (focusedIndex + direction + enabledItems.length) % enabledItems.length
  } else if (hoveredItem) {
    // ホバー状態のアイテムが存在する場合
    nextIndex =
      (enabledItems.indexOf(hoveredItem) + direction + enabledItems.length) % enabledItems.length
  } else if (direction === -1) {
    nextIndex = enabledItems.length - 1
  }

  const nextItem = enabledItems[nextIndex]

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

      const allItems = Array.from(containerRef.current.querySelectorAll('li > *'))
      const {
        hoveredItem,
        tabbableItems: enabledItems,
        focusedIndex,
      } = allItems.reduce(
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

      if (['Up', 'ArrowUp', 'Left', 'ArrowLeft'].includes(e.key)) {
        moveFocus(-1, enabledItems, focusedIndex, hoveredItem)
      }

      if (['Down', 'ArrowDown', 'Right', 'ArrowRight'].includes(e.key)) {
        moveFocus(1, enabledItems, focusedIndex, hoveredItem)
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
