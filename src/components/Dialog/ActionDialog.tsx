import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useId } from '../../hooks/useId'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { ActionDialogContentInner, ActionDialogContentInnerProps } from './ActionDialogContentInner'

type Props = Omit<ActionDialogContentInnerProps, 'titleId'> & {
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
  const titleId = useId()

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
    <DialogContentInner ariaLabelledby={titleId} className={className} {...props}>
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
    portalContainer,
  )
}
