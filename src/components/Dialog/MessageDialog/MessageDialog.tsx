import React, { HTMLAttributes, useCallback } from 'react'

import { useId } from '../../../hooks/useId'
import { DialogContentInner } from '../DialogContentInner'
import { DialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import {
  MessageDialogContentInner,
  MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

type Props = Omit<MessageDialogContentInnerProps, 'titleId'> & DialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialog: React.FC<Props & ElementProps> = ({
  title,
  subtitle,
  titleTag,
  description,
  onClickClose,
  onPressEscape = onClickClose,
  className = '',
  portalParent,
  decorators,
  id,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
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
        onClickClose={handleClickClose}
        decorators={decorators}
      />
    </DialogContentInner>,
  )
}
