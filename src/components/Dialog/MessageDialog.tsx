import React, { HTMLAttributes, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { DialogContentInner, DialogContentInnerProps } from './DialogContentInner'
import {
  MessageDialogContentInner,
  MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

type Props = MessageDialogContentInnerProps &
  Pick<
    DialogContentInnerProps,
    'isOpen' | 'onClickOverlay' | 'onPressEscape' | 'top' | 'right' | 'bottom' | 'left' | 'id'
  >
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialog: React.VFC<Props & ElementProps> = ({
  title,
  description,
  closeText,
  onClickClose,
  className = '',
  ...props
}) => {
  const element = useRef(document.createElement('div')).current

  useEffect(() => {
    document.body.appendChild(element)

    return () => {
      document.body.removeChild(element)
    }
  }, [element])

  const handleClickClose = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, props.isOpen])

  return createPortal(
    <DialogContentInner ariaLabel={title} className={className} {...props}>
      <MessageDialogContentInner
        title={title}
        description={description}
        closeText={closeText}
        onClickClose={handleClickClose}
      />
    </DialogContentInner>,
    element,
  )
}
