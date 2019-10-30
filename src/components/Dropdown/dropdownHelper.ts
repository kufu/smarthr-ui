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
export type ContentBoxStyle = {
  top: string
  left: string
  maxHeight: string
}

export function getContentBoxStyle(
  triggerRect: Rect,
  contentSize: Size,
  windowSize: Size,
  scroll: {
    top: number
    left: number
  },
) {
  const contentBox: ContentBoxStyle = {
    top: 'auto',
    left: 'auto',
    maxHeight: '',
  }
  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerRect.bottom + contentSize.height <= windowSize.height) {
    contentBox.top = `${scroll.top + triggerRect.bottom}px`
  } else if (triggerRect.top - contentSize.height >= 0) {
    contentBox.top = `${scroll.top + triggerRect.top - contentSize.height}px`
  } else {
    const paddingBottom = 10
    contentBox.top = `${scroll.top + triggerRect.bottom}px`
    contentBox.maxHeight = `${windowSize.height - triggerRect.bottom - paddingBottom}px`
  }

  if (triggerAlignCenter <= windowSize.width / 2) {
    contentBox.left = `${scroll.left + triggerRect.left}px`
  } else if (triggerAlignCenter >= windowSize.width / 2) {
    contentBox.left = `${scroll.left + triggerRect.right - contentSize.width}px`
  } else {
    contentBox.left = `${scroll.left + triggerRect.left}px`
  }

  return contentBox
}
