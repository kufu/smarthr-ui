import React, { type ComponentProps, useCallback, useContext, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { useDialogPortal } from '../useDialogPortal'

import { type BaseProps, MessageDialogContentInner } from './MessageDialogContentInner'

import type { UncontrolledDialogProps } from '../types'

type Props = Omit<BaseProps, 'titleId'> & UncontrolledDialogProps
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const MessageDialogContent: React.FC<Props & ElementProps> = ({
  title,
  description,
  portalParent,
  className,
  contentBgColor,
  contentPadding,
  decorators,
  ...props
}) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  const handleClickClose = useCallback(() => {
    if (active) {
      onClickClose()
    }
  }, [active, onClickClose])
  const titleId = useId()

  return createPortal(
    <DialogContentInner
      {...props}
      onPressEscape={onClickClose}
      isOpen={active}
      className={className}
      ariaLabelledby={titleId}
    >
      <MessageDialogContentInner
        title={title}
        titleId={titleId}
        description={description}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        onClickClose={handleClickClose}
        decorators={decorators}
      />
    </DialogContentInner>,
  )
}
