import React, { HTMLAttributes, useCallback, useContext } from 'react'

import { UncontrolledDialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'
import { DialogContext } from './DialogWrapper'
import { DialogContentInner } from './DialogContentInner'
import { BaseProps, MessageDialogContentInner } from './MessageDialogContentInner'
import { useId } from '../../hooks/useId'

type Props = BaseProps & UncontrolledDialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialogContent: React.VFC<Props & ElementProps> = ({
  title,
  description,
  closeText,
  portalParent,
  className = '',
  ...props
}) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  const handleClickClose = useCallback(() => {
    if (!active) {
      return
    }
    onClickClose()
  }, [active, onClickClose])
  const titleId = useId()

  return createPortal(
    <DialogContentInner
      onClickOverlay={onClickClose}
      onPressEscape={onClickClose}
      isOpen={active}
      className={className}
      {...props}
    >
      <MessageDialogContentInner
        title={title}
        titleId={titleId}
        description={description}
        closeText={closeText}
        onClickClose={handleClickClose}
      />
    </DialogContentInner>,
  )
}
