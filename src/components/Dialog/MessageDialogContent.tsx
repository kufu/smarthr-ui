import React, { useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'
import { MessageDialogContentInner } from './MessageDialogContentInner'

type Props = {
  title: string
  description: React.ReactNode
  closeText: string
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const MessageDialogContent: React.FC<Props> = ({
  title,
  description,
  closeText,
  ...props
}) => {
  const { DialogContentRoot, onClickClose } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentInner onClickOverlay={onClickClose} {...props}>
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
