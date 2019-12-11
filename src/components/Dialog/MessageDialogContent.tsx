import React, { useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'
import { BaseProps, MessageDialogContentInner } from './MessageDialogContentInner'

export type MessageDialogContentProps = BaseProps & {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const MessageDialogContent: React.FC<MessageDialogContentProps> = ({
  title,
  description,
  closeText,
  ...props
}) => {
  const { DialogContentRoot, onClickClose } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentInner onClickOverlay={onClickClose} onPressEscape={onClickClose} {...props}>
        <MessageDialogContentInner
          title={title}
          description={description}
          closeText={closeText}
          onClickClose={onClickClose}
        />
      </DialogContentInner>
    </DialogContentRoot>
  )
}
