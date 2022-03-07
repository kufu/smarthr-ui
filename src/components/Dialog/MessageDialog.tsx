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

  return createPortal(
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
    </DialogContentInner>,
    portalContainer,
  )
}
