'use client'

import { type ComponentProps, type FC, type ReactNode, useCallback } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  MessageDialogContentInner,
  type MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

import type { DialogProps } from '../types'

type ObjectHeadingType = Omit<MessageDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type AbstractProps = Omit<MessageDialogContentInnerProps, 'heading'> &
  DialogProps & {
    heading: HeadingType
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const headingObjectConverter = (text: ReactNode) => ({
  text,
})

export const MessageDialog: FC<Props> = ({
  heading: orgHeading,
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
  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      ariaLabelledby={heading.id}
      className={className}
      onPressEscape={onPressEscape}
    >
      <MessageDialogContentInner
        heading={heading}
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
