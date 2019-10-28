import React, { useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'
import { ActionDialogContentInner } from './ActionDialogContentInner'

type Props = {
  children: React.ReactNode
  title: string
  closeText: string
  actionText: string
  actionTheme: 'primary' | 'secondary' | 'danger'
  onClickAction: (closeDialog: () => void) => void
  actionDisabled?: boolean
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const ActionDialogContent: React.FC<Props> = ({
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  actionDisabled = false,
  ...props
}) => {
  const { DialogContentRoot, onClickClose } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentInner onClickOverlay={onClickClose} {...props}>
        <ActionDialogContentInner
          title={title}
          closeText={closeText}
          actionText={actionText}
          actionTheme={actionTheme}
          onClickAction={onClickAction}
          onClickClose={onClickClose}
          actionDisabled={actionDisabled}
        >
          {children}
        </ActionDialogContentInner>
      </DialogContentInner>
    </DialogContentRoot>
  )
}
