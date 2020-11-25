import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner } from './DialogContentInner'
import { ActionDialogContentProps } from './ActionDialogContent'
import { ActionDialogContentInner } from './ActionDialogContentInner'

type Props = ActionDialogContentProps & {
  isOpen: boolean
  onClickClose: () => void
  onClickOverlay?: () => void
  onPressEscape?: () => void
}

export const ActionDialog: React.FC<Props> = ({
  isOpen,
  children,
  title,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  actionDisabled = false,
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
      <ActionDialogContentInner
        title={title}
        closeText={closeText}
        actionText={actionText}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        onClickClose={onClickClose}
        onClickAction={onClickAction}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
    element,
  )
}
