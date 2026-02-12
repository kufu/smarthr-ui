'use client'

import { type ComponentProps, type FC, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'

import {
  MessageDialogContentInner,
  type MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

import type { DialogProps } from '../types'

type AbstractProps = Omit<MessageDialogContentInnerProps, 'titleId'> & DialogProps
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

export const MessageDialog: FC<Props> = ({
  title,
  subtitle,
  unrecommendedTitleTag,
  children,
  onClickClose,
  onPressEscape = onClickClose,
  contentBgColor,
  contentPadding,
  className,
  portalParent,
  decorators,
  id,
  isOpen,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const handleClickClose = useCallback(() => {
    if (isOpen) {
      onClickClose()
    }
  }, [isOpen, onClickClose])
  const titleId = useId()

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={onPressEscape}
    >
      <MessageDialogContentInner
        title={title}
        unrecommendedTitleTag={unrecommendedTitleTag}
        titleId={titleId}
        subtitle={subtitle}
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
