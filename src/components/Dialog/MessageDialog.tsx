import React, { HTMLAttributes, useCallback } from 'react'

import { DialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'
import { DialogContentInner } from './DialogContentInner'
import {
  MessageDialogContentInner,
  MessageDialogContentInnerProps,
} from './MessageDialogContentInner'
import { useId } from '../../hooks/useId'

type Props = Omit<MessageDialogContentInnerProps, 'titleId'> & DialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialog: React.VFC<Props & ElementProps> = ({
  title,
  subtitle,
  description,
  closeText,
  onClickClose,
  onPressEscape = onClickClose,
  className = '',
  portalParent,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent)
  const handleClickClose = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, props.isOpen])
  const titleId = useId()

  return createPortal(
    <DialogContentInner
      {...props}
      aria-labelledby={titleId}
      className={className}
      onPressEscape={onPressEscape}
    >
      <MessageDialogContentInner
        title={title}
        titleId={titleId}
        subtitle={subtitle}
        description={description}
        closeText={closeText}
        onClickClose={handleClickClose}
      />
    </DialogContentInner>,
  )
}
