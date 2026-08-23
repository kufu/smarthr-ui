import { type PropsWithChildren, forwardRef, useRef, useState } from 'react'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { useMergeRefs } from '../../hooks/useMergeRefs'
import { usePortal } from '../../hooks/usePortal'

import { getPortalPosition } from './datePickerHelper'

type Props = PropsWithChildren<{
  inputRect: DOMRect
}>

const initialPosition = {
  top: '0px',
  left: '0px',
}

export const Portal = forwardRef<HTMLDivElement, Props>(({ inputRect, ...rest }, ref) => {
  const { portalRoot, createPortal } = usePortal()
  const containerRef = useRef<HTMLDivElement>(null)

  const [style, setStyle] = useState(initialPosition)

  useEnhancedEffect(() => {
    if (containerRef.current) {
      const position = getPortalPosition(inputRect, containerRef.current.offsetHeight)

      setStyle({
        top: `${position.top}px`,
        left: `${position.left}px`,
      })
    }
  }, [inputRect, portalRoot])

  const mergedRef = useMergeRefs(containerRef, ref)

  return createPortal(
    <div
      {...rest}
      ref={mergedRef}
      className="smarthr-ui-DatePicker-calendarContainer shr-absolute shr-z-overlap shr-leading-none"
      style={style}
    />,
  )
})
