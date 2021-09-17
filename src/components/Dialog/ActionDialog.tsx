import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { ActionDialogContentInner, ActionDialogContentInnerProps } from './ActionDialogContentInner'

type Props = ActionDialogContentInnerProps & {
  onClickClose: () => void
} & Pick<
    DialogContentInnerProps,
    'isOpen' | 'onClickOverlay' | 'onPressEscape' | 'top' | 'right' | 'bottom' | 'left' | 'id'
  > & { portalParent?: HTMLElement }
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
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  className = '',
  portalParent = document.body,
  ...props
}) => {
  const portalContainer = useRef(document.createElement('div')).current

  useEffect(() => {
    portalParent.appendChild(portalContainer)

    return () => {
      portalParent.removeChild(portalContainer)
    }
  }, [portalContainer, portalParent])

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
    <DialogContentInner ariaLabel={`${subtitle} ${title}`} className={className} {...props}>
      <ActionDialogContentInner
        title={title}
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
    portalContainer,
  )
}
