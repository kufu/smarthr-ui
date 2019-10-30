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
  maxHeight: string
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
    maxHeight: '',
  }
  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerRect.bottom + contentSize.height <= windowSize.height) {
    position.top = `${scroll.top + triggerRect.bottom}px`
  } else if (triggerRect.top - contentSize.height >= 0) {
    position.top = `${scroll.top + triggerRect.top - contentSize.height}px`
  } else {
    const paddingBottom = 10
    position.top = `${scroll.top + triggerRect.bottom}px`
    position.maxHeight = `${windowSize.height - triggerRect.bottom - paddingBottom}px`
  }

  if (triggerAlignCenter <= windowSize.width / 2) {
    position.left = `${scroll.left + triggerRect.left}px`
  } else if (triggerAlignCenter >= windowSize.width / 2) {
    position.left = `${scroll.left + triggerRect.right - contentSize.width}px`
  } else {
    position.left = `${scroll.left + triggerRect.left}px`
  }

  return position
}
