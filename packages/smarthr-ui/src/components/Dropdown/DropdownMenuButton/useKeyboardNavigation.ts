import { type RefObject, useEffect } from 'react'

const TABBABLE_SELECTOR = 'li button,li a,li [tabindex]:not([tabindex="-1"])'
const DISABLED_SELECTOR = ':disabled,[aria-disabled="true"]'
const isElementEnabled = (element: Element): boolean =>
  !element.matches(DISABLED_SELECTOR) && !element.querySelector(DISABLED_SELECTOR)

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

  element.querySelectorAll(TABBABLE_SELECTOR).forEach((item) => {
    if (hoveredItem === null && item.matches(':hover')) {
      hoveredItem = item
    }

    if (isElementEnabled(item)) {
      pushTabbaleItem(item)
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
        // HINT: tbのデフォルトの挙動の場合のみ、preventDefaultが必要
        e.preventDefault()
        direction = e.shiftKey ? -1 : 1
      } else if (KEY_UP_REGEX.test(e.key)) {
        direction = -1
      } else if (KEY_DOWN_REGEX.test(e.key)) {
        direction = 1
      }

      if (direction !== 0) {
        moveFocus(containerRef.current, direction)
      }
    }

    const eventKey = 'keydown'

    document.addEventListener(eventKey, handleKeyDown)

    return () => {
      document.removeEventListener(eventKey, handleKeyDown)
    }
  }, [containerRef])
}

export default useKeyboardNavigation
