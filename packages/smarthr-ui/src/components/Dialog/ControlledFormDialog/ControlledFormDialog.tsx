'use client'

import { type ComponentProps, type FC, type FormEvent, type ReactNode, useCallback } from 'react'

import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  FormDialogContentInner,
  type FormDialogContentInnerProps,
  type FormDialogHelpers,
} from './FormDialogContentInner'

import type { DialogProps } from '../types'

type ObjectHeadingType = Omit<FormDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType
type ObjectActionButtonType = FormDialogContentInnerProps['actionButton']
type ObjectCloseButtonType = FormDialogContentInnerProps['closeButton']

type AbstractProps = Omit<FormDialogContentInnerProps, 'heading' | 'actionButton' | 'closeButton'> &
  DialogProps & {
    heading: HeadingType
    actionButton: ReactNode | ObjectActionButtonType
    closeButton?: ReactNode | ObjectCloseButtonType
  }
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const headingObjectConverter = (text: ReactNode) => ({
  text,
})
const buttonObjectConverter = (text: ReactNode) => ({ text })

export const ControlledFormDialog: FC<Props> = ({
  children,
  heading: orgHeading,
  contentBgColor,
  contentPadding,
  actionButton: orgActionButton,
  onSubmit,
  onClickClose,
  onPressEscape = onClickClose,
  responseStatus,
  closeButton: orgCloseButton,
  subActionArea,
  className,
  portalParent,
  id,
  isOpen,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const heading = useObjectHeading<HeadingType, ObjectHeadingType>(
    orgHeading,
    headingObjectConverter,
  )
  const actionButton = useObjectAttributes<
    ReactNode | ObjectActionButtonType,
    ObjectActionButtonType
  >(orgActionButton, buttonObjectConverter)
  const closeButton = useObjectAttributes<ReactNode | ObjectCloseButtonType, ObjectCloseButtonType>(
    orgCloseButton,
    buttonObjectConverter,
  )

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const onDelegateSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>, helpers: FormDialogHelpers) => {
      if (isOpen) {
        onSubmit(e, helpers)
      }
    },
    [isOpen, onSubmit],
  )

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      ariaLabelledby={heading.id}
      className={className}
      onPressEscape={closeButton.disabled ? undefined : onPressEscape}
    >
      <FormDialogContentInner
        heading={heading}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionButton={actionButton}
        closeButton={closeButton}
        subActionArea={subActionArea}
        onClickClose={actualOnClickClose}
        onSubmit={onDelegateSubmit}
        responseStatus={responseStatus}
      >
        {children}
      </FormDialogContentInner>
    </DialogContentInner>,
  )
}
