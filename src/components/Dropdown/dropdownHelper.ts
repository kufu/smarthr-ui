export type Rect = {
  top: number
  right: number
  bottom: number
  left: number
}

export function getRandomStr() {
  const str = 'abcdefghijklmnopqrstuvwxyz'
  const strLen = str.length
  let result = ''

  for (let i = 0; i < 8; i++) {
    result += str[Math.floor(Math.random() * strLen)]
  }

  return result
}

export function getParentElementByClassNameRecursively(
  element: HTMLElement | null,
  className: string = '',
): HTMLElement | null {
  if (!element) return null
  if (element.classList.contains(className)) return element
  if (element === document.body) return null
  return getParentElementByClassNameRecursively(element.parentElement, className)
}

type Size = { width: number; height: number }
export type Position = {
  top: string
  left: string
}

export function getContentPositionStyle(
  triggerRect: Rect,
  contentSize: Size,
  windowSize: Size,
  scroll: {
    top: number
    left: number
  },
) {
  const position: Position = {
    top: 'auto',
    left: 'auto',
  }

  if (triggerRect.bottom + contentSize.height <= windowSize.height) {
    position.top = `${scroll.top + triggerRect.bottom}px`
  } else {
    position.top = `${scroll.top + triggerRect.top - contentSize.height}px`
  }

  if (triggerRect.left + contentSize.width <= windowSize.width) {
    position.left = `${scroll.left + triggerRect.left}px`
  } else {
    position.left = `${scroll.left + triggerRect.right - contentSize.width}px`
  }

  return position
}
