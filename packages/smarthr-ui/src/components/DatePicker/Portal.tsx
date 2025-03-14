import React, {
  type PropsWithChildren,
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

const portal = tv({
  base: 'smarthr-ui-DatePicker-calendarContainer shr-absolute shr-z-overlap shr-leading-none',
})

export const Portal = forwardRef<HTMLDivElement, Props>(({ inputRect, ...props }, ref) => {
  const { isPortalRootMounted, createPortal } = usePortal()

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => containerRef.current)

  useEnhancedEffect(() => {
    if (containerRef.current) {
      setPosition(getPortalPosition(inputRect, containerRef.current.offsetHeight))
    }
  }, [inputRect, isPortalRootMounted])

  const style = useMemo(() => portal(), [])

  const styleAttr = useMemo(
    () => ({
      top: `${position.top}px`,
      left: `${position.left}px`,
    }),
    [position.left, position.top],
  )

  return createPortal(<div {...props} ref={containerRef} className={style} style={styleAttr} />)
})
