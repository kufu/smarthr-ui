import React, { HTMLAttributes, RefObject, useCallback } from 'react'

import { useId } from '../../hooks/useId'
import { useDialogPortal } from './useDialogPortal'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import { ActionDialogContentInner, ActionDialogContentInnerProps } from './ActionDialogContentInner'

type Props = Omit<ActionDialogContentInnerProps, 'titleId'> & {
  onClickClose: () => void
  portalParent?: HTMLElement | RefObject<HTMLElement>
} & Pick<
    DialogContentInnerProps,
    | 'isOpen'
    | 'onClickOverlay'
    | 'onPressEscape'
    | 'width'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'id'
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
  const { Portal } = useDialogPortal(portalParent)
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

  return (
    <Portal>
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
      </DialogContentInner>
    </Portal>
  )
}
