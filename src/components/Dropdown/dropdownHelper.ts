export type Rect = {
  top: number
  right: number
  bottom: number
  left: number
}

export function hasParentElement(element: HTMLElement | null, parent: HTMLElement | null): boolean {
  if (!element) return false
  return element === parent || hasParentElement(element.parentElement, parent)
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

  if (triggerRect.left + (triggerRect.right - triggerRect.left) / 2 <= windowSize.width / 2) {
    position.left = `${scroll.left + triggerRect.left}px`
  } else {
    position.left = `${scroll.left + triggerRect.right - contentSize.width}px`
  }

  return position
}
