'use client'

import { type FC, type PropsWithChildren, useCallback } from 'react'

import { usePortal } from '../../hooks/client/usePortal'

type Props = PropsWithChildren<{
  inputRect: DOMRect
}>

export const Portal: FC<Props> = ({ inputRect, children }) => {
  const { createPortal } = usePortal()

  // HINT: cleanup functionをreturnしていないためuseCallbackRefCleanupForReact18は不要。
  // React v18の対応を切ったらこのコメントも削除する
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        const position = getPortalPosition(inputRect, node.offsetHeight)

        node.style.top = `${position.top}px`
        node.style.left = `${position.left}px`
      }
    },
    [inputRect],
  )

  return createPortal(
    <div
      ref={callbackRef}
      // HINT: shr-flex は子(Calendar)のinline-block由来の余白を消すために必要。
      // 余白があるとPortal要素の下端がCalendarの外側になり、
      // 外側クリック判定(useOuterClick)が意図せず発火する
      className="smarthr-ui-DatePicker-calendarContainer shr-absolute shr-z-overlap shr-flex shr-leading-none"
    >
      {children}
    </div>,
  )
}

// HINT: 上方向表示はcontentHeightを引いて位置を決めるため、
// Portalとinputの重なりが下方向表示と同じになるよう小さい値にしている
const PORTAL_POSITION_MARGIN_FOR_TOP = 2
const PORTAL_POSITION_MARGIN_FOR_BOTTOM = 4

function getPortalPosition(inputRect: DOMRect, contentHeight: number) {
  const { innerHeight, pageYOffset } = window
  const top =
    // has no space on bottom side
    inputRect.bottom + contentHeight > innerHeight &&
    // top side space bigger than bottom side
    inputRect.top > innerHeight - inputRect.bottom
      ? // display on top side
        pageYOffset + inputRect.top - contentHeight + PORTAL_POSITION_MARGIN_FOR_TOP
      : // display on bottom side
        pageYOffset + inputRect.bottom - PORTAL_POSITION_MARGIN_FOR_BOTTOM
  const left = pageXOffset + inputRect.left

  return {
    top,
    left,
  }
}
