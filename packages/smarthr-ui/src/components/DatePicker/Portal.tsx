import { type FC, type PropsWithChildren, useCallback } from 'react'

import { usePortal } from '../../hooks/usePortal'

import { getPortalPosition } from './datePickerHelper'

type Props = PropsWithChildren<{
  inputRect: DOMRect
}>

export const Portal: FC<Props> = ({ inputRect, ...rest }) => {
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
      {...rest}
      ref={callbackRef}
      // HINT: shr-flex は子(Calendar)のinline-block由来の余白を消すために必要。
      // 余白があるとPortal要素の下端がCalendarの外側になり、
      // 外側クリック判定(useOuterClick)が意図せず発火する
      className="smarthr-ui-DatePicker-calendarContainer shr-absolute shr-z-overlap shr-flex shr-leading-none"
    />,
  )
}
