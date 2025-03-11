import React, {
  PropsWithChildren,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useEnhancedEffect } from '../../hooks/useEnhancedEffect'
import { usePortal } from '../../hooks/usePortal'

import { getPortalPosition } from './datePickerHelper'

type Props = PropsWithChildren<{
  inputRect: DOMRect
}>

const classNameGenerator = tv({
  base: 'smarthr-ui-DatePicker-calendarContainer shr-absolute shr-z-overlap shr-leading-none',
})

const initialPosition = {
  top: '0px',
  left: '0px',
}

export const Portal = forwardRef<HTMLDivElement, Props>(({ inputRect, ...props }, ref) => {
  const { isPortalRootMounted, createPortal } = usePortal()
  const containerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => containerRef.current)

  const [style, setStyle] = useState(initialPosition)

  useEnhancedEffect(() => {
    if (containerRef.current) {
      const position = getPortalPosition(inputRect, containerRef.current.offsetHeight)

      setStyle({
        top: `${position.top}px`,
        left: `${position.left}px`,
      })
    }
  }, [inputRect, isPortalRootMounted])

  const className = useMemo(() => classNameGenerator(), [])

  return createPortal(<div {...props} ref={containerRef} className={className} style={style} />)
})
