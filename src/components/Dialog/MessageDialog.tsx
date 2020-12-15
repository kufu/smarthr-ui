import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { MessageDialogContentProps } from './MessageDialogContent'
import { MessageDialogContentInner } from './MessageDialogContentInner'

type Props = MessageDialogContentProps & {
  onClickClose: () => void
} & Pick<DialogContentInnerProps, 'isOpen' | 'onClickOverlay' | 'onPressEscape'>

export const MessageDialog: React.FC<Props> = ({
  isOpen,
  title,
  description,
  closeText,
  onClickClose,
  onClickOverlay = () => {
    /* noop */
  },
  onPressEscape = () => {
    /* noop */
  },
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
      ariaLabel={title}
      {...props}
    >
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
