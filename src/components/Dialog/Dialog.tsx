import React, { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner } from './DialogContentInner'

type Props = {
  isOpen: boolean
  onClickOverlay?: () => void
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const Dialog: React.FC<Props> = ({
  isOpen,
  children,
  onClickOverlay = () => {},
  ...props
}) => {
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  if (!isOpen) return null

  return createPortal(
    <DialogContentInner onClickOverlay={onClickOverlay} {...props}>
      {children}
    </DialogContentInner>,
    element,
  )
}
