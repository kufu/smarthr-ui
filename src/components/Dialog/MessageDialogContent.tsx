import React, { HTMLAttributes, useCallback, useContext } from 'react'

import { useId } from '../../hooks/useId'

import { DialogContentInner } from './DialogContentInner'
import { DialogContext } from './DialogWrapper'
import { BaseProps, MessageDialogContentInner } from './MessageDialogContentInner'
import { UncontrolledDialogProps } from './types'
import { useDialogPortal } from './useDialogPortal'

type Props = BaseProps & UncontrolledDialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const MessageDialogContent: React.VFC<Props & ElementProps> = ({
  title,
  description,
  closeText,
  portalParent,
  className = '',
  decorators,
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
      {...props}
      onClickOverlay={onClickClose}
      onPressEscape={onClickClose}
      isOpen={active}
      className={className}
    >
      <MessageDialogContentInner
        title={title}
        titleId={titleId}
        description={description}
        closeText={closeText}
        onClickClose={handleClickClose}
        decorators={decorators}
      />
    </DialogContentInner>,
  )
}
