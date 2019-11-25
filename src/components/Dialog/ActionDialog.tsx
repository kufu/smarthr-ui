import React, { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner } from './DialogContentInner'
import { ActionDialogContentProps } from './ActionDialogContent'
import { ActionDialogContentInner } from './ActionDialogContentInner'

type Props = ActionDialogContentProps & {
  isOpen: boolean
  onClickClose: () => void
  onClickOverlay?: () => void
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
  onClickOverlay = () => {},
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
    <DialogContentInner onClickOverlay={onClickOverlay} {...props}>
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
