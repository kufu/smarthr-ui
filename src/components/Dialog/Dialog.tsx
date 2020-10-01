import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner } from './DialogContentInner'

type Props = {
  isOpen: boolean
  onClickOverlay?: () => void
  onPressEscape?: () => void
  top?: number
  right?: number
  bottom?: number
  left?: number
  ariaLabel?: string
}

export const Dialog: React.FC<Props> = ({
  isOpen,
  children,
  onClickOverlay = () => {
    /* noop */
  },
  onPressEscape = () => {
    /* noop */
  },
  ariaLabel,
  ...props
}) => {
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  return createPortal(
    <DialogContentInner
      onClickOverlay={onClickOverlay}
      onPressEscape={onPressEscape}
      isOpen={isOpen}
      ariaLabel={ariaLabel}
      {...props}
    >
      {children}
    </DialogContentInner>,
    element,
  )
}
