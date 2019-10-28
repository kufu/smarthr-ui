import React, { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner } from './DialogContentInner'
import { ActionDialogContentInner } from './ActionDialogContentInner'

type Props = {
  isOpen: boolean
  children: React.ReactNode
  title: string
  closeText: string
  actionText: string
  actionTheme: 'primary' | 'secondary' | 'danger'
  onClickAction: (closeDialog: () => void) => void
  onClickClose: () => void
  actionDisabled?: boolean
  top?: number
  right?: number
  bottom?: number
  left?: number
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
    <DialogContentInner onClickOverlay={onClickClose} {...props}>
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
