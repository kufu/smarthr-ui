import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner } from './DialogContentInner'
import { MessageDialogContentProps } from './MessageDialogContent'
import { MessageDialogContentInner } from './MessageDialogContentInner'

type Props = MessageDialogContentProps & {
  isOpen: boolean
  onClickClose: () => void
  onClickOverlay?: () => void
  onPressEscape?: () => void
}

export const MessageDialog: React.FC<Props> = ({
  isOpen,
  title,
  description,
  closeText,
  onClickClose,
  onClickOverlay = () => undefined,
  onPressEscape = () => undefined,
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
    <DialogContentInner onClickOverlay={onClickOverlay} onPressEscape={onPressEscape} {...props}>
      <MessageDialogContentInner
        title={title}
        description={description}
        closeText={closeText}
        onClickClose={onClickClose}
      />
    </DialogContentInner>,
    element,
  )
}
