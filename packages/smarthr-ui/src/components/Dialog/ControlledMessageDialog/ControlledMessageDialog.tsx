'use client'

import { type ComponentProps, type FC, type ReactNode, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { DialogContentInner } from '../DialogContentInner'
import { useControlledMobile } from '../useControlledMobile'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  MessageDialogContentInner,
  type MessageDialogContentInnerProps,
} from './MessageDialogContentInner'

import type { DialogProps } from '../types'

type ObjectHeadingType = Omit<MessageDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType

type BaseProps = Omit<MessageDialogContentInnerProps, 'heading' | 'handleClickClose' | 'mobile'> &
  DialogProps & {
    heading: HeadingType
    onClickClose: MessageDialogContentInnerProps['handleClickClose']
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
  mobileType: orgMobileType,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  const { mobile, mobileType } = useControlledMobile(orgMobileType)

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
      mobileType={mobileType}
      className={className}
      ariaLabelledby={heading.id}
      onPressEscape={onPressEscape}
    >
      <MessageDialogContentInner
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        mobile={mobile}
        mobileType={mobileType}
        handleClickClose={functions.handleClickClose}
        heading={heading}
        closeButton={closeButton}
      >
        {children}
      </MessageDialogContentInner>
    </DialogContentInner>,
  )
}
