'use client'

import { type ComponentProps, type FC, type MouseEvent, type ReactNode, useMemo } from 'react'

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

type BaseProps = Omit<MessageDialogContentInnerProps, 'heading' | 'handleClickClose'> &
  DialogProps & {
    heading: HeadingType
    onClickClose: (e?: MouseEvent<HTMLButtonElement>) => void
  }
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

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
      handleClickClose: (e: MouseEvent<HTMLButtonElement>) => {
        if (latest.isOpen) {
          latest.onClickClose(e)
        }
      },
    }),
    [latest],
  )

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      className={className}
      ariaLabelledby={heading.id}
      onPressEscape={onPressEscape}
    >
      <MessageDialogContentInner
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        handleClickClose={functions.handleClickClose}
        heading={heading}
        closeButton={closeButton}
      >
        {children}
      </MessageDialogContentInner>
    </DialogContentInner>,
  )
}
