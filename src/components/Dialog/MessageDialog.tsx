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
    | 'isOpen'
    | 'onClickOverlay'
    | 'onPressEscape'
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'id'
    | 'portalParent'
  >
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialog: React.VFC<Props & ElementProps> = ({
  title,
  subtitle,
  description,
  closeText,
  onClickClose,
  className = '',
  portalParent = document.body,
  ...props
}) => {
  const portalContainer = useRef(document.createElement('div')).current

  useEffect(() => {
    if (!portalParent) {
      return
    }

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

  return createPortal(
    <DialogContentInner ariaLabel={`${subtitle} ${title}`} className={className} {...props}>
      <MessageDialogContentInner
        title={title}
        subtitle={subtitle}
        description={description}
        closeText={closeText}
        onClickClose={handleClickClose}
      />
    </DialogContentInner>,
    portalContainer,
  )
}
