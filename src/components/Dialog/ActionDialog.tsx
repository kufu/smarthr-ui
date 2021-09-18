import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { ActionDialogContentInner, ActionDialogContentInnerProps } from './ActionDialogContentInner'

type Props = ActionDialogContentInnerProps & {
  onClickClose: () => void
  portalParent?: HTMLElement
} & Pick<
    DialogContentInnerProps,
    'isOpen' | 'onClickOverlay' | 'onPressEscape' | 'top' | 'right' | 'bottom' | 'left' | 'id'
  >
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
  portalParent,
  ...props
}) => {
  const portalContainer = useRef(document.createElement('div')).current

  useEffect(() => {
    // SSR を考慮し、useEffect 内で初期値 document.body を指定
    const pp = portalParent || document.body
    pp.appendChild(portalContainer)
    return () => {
      pp.removeChild(portalContainer)
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
