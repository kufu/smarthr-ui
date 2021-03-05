import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import {
  MessageDialogContentInner,
  MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

type Props = MessageDialogContentInnerProps &
  Pick<
    DialogContentInnerProps,
    'isOpen' | 'onClickOverlay' | 'onPressEscape' | 'top' | 'right' | 'bottom' | 'left' | 'id'
  >

export const MessageDialog: React.VFC<Props> = ({
  title,
  description,
  closeText,
  onClickClose,
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
    <DialogContentInner ariaLabel={title} {...props}>
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
