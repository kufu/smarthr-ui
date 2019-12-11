import React, { useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'
import { BaseProps, ActionDialogContentInner } from './ActionDialogContentInner'

export type ActionDialogContentProps = BaseProps & {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const ActionDialogContent: React.FC<ActionDialogContentProps> = ({
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
      <DialogContentInner onClickOverlay={onClickClose} onPressEscape={onClickClose} {...props}>
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
