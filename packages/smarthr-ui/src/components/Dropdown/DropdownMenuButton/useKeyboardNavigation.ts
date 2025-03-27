import { type RefObject, useEffect } from 'react'

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
  let hoveredItem: Element | null = null
  const tabbableItems: Element[] = []
  let focusedIndex: number = -1

  const pushTabbaleItem = (item: Element) => {
    tabbableItems.push(item)

    if (document.activeElement === item) {
      focusedIndex = tabbableItems.length - 1
    }
  }

  Array.from(element.querySelectorAll('li > *')).forEach((item) => {
    if (hoveredItem === null && item.matches(':hover')) {
      hoveredItem = item
    }

    if (!isElementDisabled(item)) {
      pushTabbaleItem(item)
    }

    // HINT: disabled理由のtooltipなどが存在する場合があるため、focus対象にする
    const tooltip = item.querySelector('.smarthr-ui-Tooltip[tabindex="0"]')

    if (tooltip) {
      pushTabbaleItem(tooltip)
    }
  })

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

const useKeyboardNavigation = (containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current || !document.activeElement) {
        return
      }

      let direction: -1 | 0 | 1 = 0

      // HINT: tabとarrow keyで挙動を揃えるため、tabもhandling対象にする
      if (e.key === 'Tab') {
        direction = e.shiftKey ? -1 : 1
      } else if (KEY_UP_REGEX.test(e.key)) {
        direction = -1
      } else if (KEY_DOWN_REGEX.test(e.key)) {
        direction = 1
      }

      if (direction !== 0) {
        e.preventDefault()
        moveFocus(containerRef.current, direction)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef])
}

export default useKeyboardNavigation
