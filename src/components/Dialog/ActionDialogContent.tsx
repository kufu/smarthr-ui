import React, { useContext } from 'react'

import { DialogContext } from './DialogWrapper'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { ActionDialogContentInner, BaseProps } from './ActionDialogContentInner'

export type ActionDialogContentProps = BaseProps &
  Pick<DialogContentInnerProps, 'top' | 'right' | 'bottom' | 'left'>

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
  const { DialogContentRoot, onClickClose, active } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentInner
        onClickOverlay={onClickClose}
        onPressEscape={onClickClose}
        isOpen={active}
        ariaLabel={title}
        {...props}
      >
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
