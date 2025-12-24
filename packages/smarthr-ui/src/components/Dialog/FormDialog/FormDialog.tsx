'use client'

import { type ComponentProps, type FC, type FormEvent, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'

import {
  FormDialogContentInner,
  type FormDialogContentInnerProps,
  type FormDialogHelpers,
} from './FormDialogContentInner'

import type { DialogProps } from '../types'

type AbstractProps = Omit<FormDialogContentInnerProps, 'titleId'> & DialogProps
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

export const FormDialog: FC<Props> = ({
  children,
  title,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onSubmit,
  onClickClose,
  onPressEscape = onClickClose,
  responseStatus,
  actionDisabled,
  closeDisabled,
  subActionArea,
  className,
  portalParent,
  decorators,
  id,
  isOpen,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const actualOnSubmitAction = useCallback(
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
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={closeDisabled ? undefined : onPressEscape}
    >
      {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <FormDialogContentInner
        title={title}
        titleId={titleId}
        subtitle={subtitle}
        titleTag={titleTag}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionText={actionText}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        closeDisabled={closeDisabled}
        subActionArea={subActionArea}
        onClickClose={actualOnClickClose}
        onSubmit={actualOnSubmitAction}
        responseStatus={responseStatus}
        decorators={decorators}
      >
        {children}
      </FormDialogContentInner>
    </DialogContentInner>,
  )
}
