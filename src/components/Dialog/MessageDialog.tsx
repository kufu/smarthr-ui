import React, { HTMLAttributes, useCallback } from 'react'

import { useDialogPortal } from './useDialogPortal'
import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import {
  MessageDialogContentInner,
  MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

type Props = MessageDialogContentInnerProps &
  Pick<
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
  > & { portalParent?: HTMLElement }
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialog: React.VFC<Props & ElementProps> = ({
  title,
  subtitle,
  description,
  closeText,
  onClickClose,
  className = '',
  portalParent,
  ...props
}) => {
  const { Portal } = useDialogPortal(portalParent)
  const handleClickClose = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, props.isOpen])

  return (
    <Portal>
      <DialogContentInner
        ariaLabel={subtitle ? `${subtitle} ${title}` : title}
        className={className}
        {...props}
      >
        <MessageDialogContentInner
          title={title}
          subtitle={subtitle}
          description={description}
          closeText={closeText}
          onClickClose={handleClickClose}
        />
      </DialogContentInner>
    </Portal>
  )
}
