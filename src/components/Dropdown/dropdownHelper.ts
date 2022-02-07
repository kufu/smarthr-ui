import { RefObject } from 'react'
import { tabbable } from '../../libs/tabbable'

export type Rect = {
  top: number
  right: number
  bottom: number
  left: number
}

type Size = { width: number; height: number }
export type ContentBoxStyle = {
  top: string
  left: string
  maxHeight: string
}

export function isEventFromChild(e: Event, parent: Element | null): boolean {
  const path = e.composedPath()
  if (path.length === 0 || !parent) return false
  return path.includes(parent)
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
      contentBox.top = `${scroll.top + triggerRect.bottom - 5}px`
      contentBox.maxHeight = `${windowSize.height - triggerRect.bottom - padding}px`
    } else {
      contentBox.top = `${scroll.top + padding + 5}px`
      contentBox.maxHeight = `${triggerRect.top - padding}px`
    }
  }

  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerAlignCenter <= windowSize.width / 2) {
    contentBox.left = `${scroll.left + triggerRect.left - 5}px`
  } else {
    contentBox.left = `${scroll.left + triggerRect.right - contentSize.width + 5}px`
  }

  return contentBox
}

export function getFirstTabbable(ref: RefObject<HTMLElement>) {
  if (ref.current) {
    const tabbables = tabbable(ref.current)
    const firstTabbable = tabbables[0]
    return firstTabbable
  }
  return null
}
