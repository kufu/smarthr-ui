import { type PropsWithChildren, forwardRef, useCallback } from 'react'

import { useMergeRefs } from '../../hooks/useMergeRefs'
import { usePortal } from '../../hooks/usePortal'

import { getPortalPosition } from './datePickerHelper'

type Props = PropsWithChildren<{
  inputRect: DOMRect
}>

export const Portal = forwardRef<HTMLDivElement, Props>(({ inputRect, ...rest }, ref) => {
  const { createPortal } = usePortal()

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

  const mergedRef = useMergeRefs(callbackRef, ref)

  return createPortal(
    <div
      {...rest}
      ref={mergedRef}
      className="smarthr-ui-DatePicker-calendarContainer shr-absolute shr-z-overlap shr-leading-none"
    />,
  )
})
