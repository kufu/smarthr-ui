'use client'

import { type ComponentProps, type FC, type ReactNode, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
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

export const ControlledMessageDialog: FC<Props> = ({
  heading: orgHeading,
  children,
  onClickClose,
  onPressEscape = onClickClose,
  contentBgColor,
  contentPadding,
  className,
  portalParent,
  closeButton,
  id,
  isOpen,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )

  const latest = useLatest({ onClickClose, isOpen })

  const functions = useMemo(
    () => ({
      handleClickClose: () => {
        if (latest.isOpen) {
          latest.onClickClose()
        }
      },
    }),
    [latest],
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
        onClickClose={functions.handleClickClose}
        closeButton={closeButton}
      >
        {children}
      </MessageDialogContentInner>
    </DialogContentInner>,
  )
}
