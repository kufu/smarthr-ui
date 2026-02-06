import { type ComponentProps, type FC, useCallback, useContext, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { useDialogPortal } from '../useDialogPortal'

import {
  type AbstractProps as ContentInnerProps,
  MessageDialogContentInner,
} from './MessageDialogContentInner'

import type { UncontrolledDialogProps } from '../types'

type AbstractProps = Omit<ContentInnerProps, 'titleId'> & UncontrolledDialogProps
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

/** @deprecated */
export const MessageDialogContent: FC<Props> = ({
  title,
  children,
  portalParent,
  className,
  contentBgColor,
  contentPadding,
  decorators,
  ...rest
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
      {...rest}
      onPressEscape={onClickClose}
      isOpen={active}
      className={className}
      ariaLabelledby={titleId}
    >
      <MessageDialogContentInner
        title={title}
        titleId={titleId}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        onClickClose={handleClickClose}
        decorators={decorators}
      >
        {children}
      </MessageDialogContentInner>
    </DialogContentInner>,
  )
}
