import { useCallback, useEffect } from 'react'

const matchesDisabledState = (element: Element): boolean =>
  element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true'

const isElementDisabled = (element: Element): boolean => {
  if (matchesDisabledState(element)) return true
  return Array.from(element.querySelectorAll('*')).some((child) => matchesDisabledState(child))
}

const moveFocus = (
  direction: number,
  enabledItems: Element[],
  focusedIndex: number,
  hoveredItem: Element | null,
) => {
  const calculateNextIndex = () => {
    if (focusedIndex > -1) {
      // フォーカスされているアイテムが存在する場合
      return (focusedIndex + direction + enabledItems.length) % enabledItems.length
    }

    if (hoveredItem) {
      // ホバー状態のアイテムが存在する場合
      return (
        (enabledItems.indexOf(hoveredItem) + direction + enabledItems.length) % enabledItems.length
      )
    }

    // どちらもない場合は最初のアイテムからスタート
    return direction > 0 ? 0 : enabledItems.length - 1
  }

  const nextIndex = calculateNextIndex()
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

          const isDisabled = isElementDisabled(item)

          if (isDisabled) {
            return acc
          }

          acc.tabbableItems.push(item)
          if (document.activeElement === item) {
            acc.focusedIndex = acc.tabbableItems.length - 1
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
