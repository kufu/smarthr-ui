import { type PropsWithChildren, forwardRef, useRef } from 'react'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { useMergeRefs } from '../../hooks/useMergeRefs'
import { usePortal } from '../../hooks/usePortal'

import { getPortalPosition } from './datePickerHelper'

type Props = PropsWithChildren<{
  inputRect: DOMRect
}>

export const Portal = forwardRef<HTMLDivElement, Props>(({ inputRect, ...rest }, ref) => {
  const { portalRoot, createPortal } = usePortal()
  const containerRef = useRef<HTMLDivElement>(null)

  useEnhancedEffect(() => {
    if (containerRef.current) {
      const position = getPortalPosition(inputRect, containerRef.current.offsetHeight)

      containerRef.current.style.top = `${position.top}px`
      containerRef.current.style.left = `${position.left}px`
    }
  }, [inputRect, portalRoot])

  const mergedRef = useMergeRefs(containerRef, ref)

  return createPortal(
    <div
      {...rest}
      ref={mergedRef}
      className="smarthr-ui-DatePicker-calendarContainer shr-absolute shr-z-overlap shr-leading-none"
    />,
  )
})
