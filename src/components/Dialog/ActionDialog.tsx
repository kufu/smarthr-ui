import React, { HTMLAttributes, useCallback } from 'react'

import { useId } from '../../hooks/useId'
import { DialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'
import { DialogContentInner } from './DialogContentInner'
import { ActionDialogContentInner, ActionDialogContentInnerProps } from './ActionDialogContentInner'

type Props = Omit<ActionDialogContentInnerProps, 'titleId'> & DialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const ActionDialog: React.VFC<Props & ElementProps> = ({
  children,
  title,
  subtitle,
  closeText,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  onPressEscape = onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  className = '',
  portalParent,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent)
  const titleId = useId()

  const handleClickClose = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, props.isOpen])

  const handleClickAction = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose, props.isOpen])

  return createPortal(
    <DialogContentInner
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={onPressEscape}
      {...props}
    >
      <ActionDialogContentInner
        title={title}
        titleId={titleId}
        subtitle={subtitle}
        closeText={closeText}
        actionText={actionText}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        closeDisabled={closeDisabled}
        onClickClose={handleClickClose}
        onClickAction={handleClickAction}
        responseMessage={responseMessage}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
