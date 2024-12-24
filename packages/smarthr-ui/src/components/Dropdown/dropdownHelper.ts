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
  left?: string
  right?: string
  maxHeight: string
}

export function isEventFromChild(e: Event, parent: Element | null): boolean {
  const path = e.composedPath()
  if (path.length === 0 || !parent) return false
  return path.includes(parent)
}

/**
 * dropdown menu buttonとdropdown menu contentの間にスペースがあくための10px分
 */
const DROPDOWN_MENU_GAP = 10

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
    maxHeight: '',
  }

  if (triggerRect.bottom + contentSize.height <= windowSize.height) {
    // ドロップダウンのサイズがトリガの下側の領域に収まる場合
    contentBox.top = `${scroll.top + triggerRect.bottom + DROPDOWN_MENU_GAP - 5}px`
    console.log('test 下側')
  } else if (triggerRect.top - contentSize.height >= 0) {
    // ドロップダウンのサイズがトリガの上側の領域に収まる場合
    contentBox.top = `${scroll.top + triggerRect.top - contentSize.height - DROPDOWN_MENU_GAP + 5}px`
    console.log('test 上側')
  } else {
    const padding = 10
    const triggerHeight = triggerRect.bottom - triggerRect.top

    if (triggerRect.top + triggerHeight / 2 < windowSize.height / 2) {
      // 下側の領域のほうが広い場合
      contentBox.top = `${scroll.top + triggerRect.bottom + DROPDOWN_MENU_GAP - 5}px`
      contentBox.maxHeight = `${windowSize.height - triggerRect.bottom - padding}px`
      console.log('test 下側が広い')
    } else {
      // 上側の領域のほうが広い場合
      contentBox.top = `${scroll.top + padding - DROPDOWN_MENU_GAP + 5}px`
      contentBox.maxHeight = `${triggerRect.top - padding}px`
      console.log('test 上側が広い')
    }
  }

  const triggerAlignCenter = triggerRect.left + (triggerRect.right - triggerRect.left) / 2

  if (triggerAlignCenter <= windowSize.width / 2) {
    // トリガが画面左寄りの場合
    contentBox.left = `${scroll.left + triggerRect.left - 5}px`
  } else {
    // トリガが画面右寄りの場合
    contentBox.right = `${windowSize.width - triggerRect.right - scroll.left - 5}px`
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
