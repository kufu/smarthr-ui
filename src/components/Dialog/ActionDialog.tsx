import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { ActionDialogContentInner, ActionDialogContentInnerProps } from './ActionDialogContentInner'

type Props = ActionDialogContentInnerProps & {
  onClickClose: () => void
} & Pick<
    DialogContentInnerProps,
    'isOpen' | 'onClickOverlay' | 'onPressEscape' | 'top' | 'right' | 'bottom' | 'left' | 'id'
  >

export const ActionDialog: React.VFC<Props> = ({
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  actionDisabled = false,
  closeDisabled,
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
      <ActionDialogContentInner
        title={title}
        closeText={closeText}
        actionText={actionText}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        closeDisabled={closeDisabled}
        onClickClose={onClickClose}
        onClickAction={onClickAction}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
    element,
  )
}
