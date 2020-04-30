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

  if (triggerRect.bottom + contentSize.height <= windowSize.height) {
    contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
  } else if (triggerRect.top - contentSize.height >= 0) {
    contentBox.top = `${scroll.top + triggerRect.top - contentSize.height + 5}px`
  } else {
    const padding = 10

    if (triggerRect.top + (triggerRect.bottom - triggerRect.top) / 2 < windowSize.height / 2) {
      contentBox.top = `${scroll.top + triggerRect.bottom}px`
      contentBox.maxHeight = `${windowSize.height - triggerRect.bottom - padding}px`
    } else {
      contentBox.top = `${scroll.top + padding}px`
      contentBox.maxHeight = `${triggerRect.top - padding}px`
    }
  }

  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerAlignCenter <= windowSize.width / 2) {
    contentBox.left = `${scroll.left + triggerRect.left - 5}px`
  } else if (triggerAlignCenter >= windowSize.width / 2) {
    contentBox.left = `${scroll.left + triggerRect.right - contentSize.width + 5}px`
  } else {
    contentBox.left = `${scroll.left + triggerRect.left}px`
  }

  return contentBox
}
