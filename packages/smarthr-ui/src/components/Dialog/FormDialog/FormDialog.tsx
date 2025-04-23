'use client'

import { type ComponentProps, type FC, type FormEvent, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'

import { FormDialogContentInner, type FormDialogContentInnerProps } from './FormDialogContentInner'

import type { DialogProps } from '../types'

type Props = Omit<FormDialogContentInnerProps, 'titleId'> & DialogProps
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const FormDialog: FC<Props & ElementProps> = ({
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
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()

  const handleClickClose = useCallback(() => {
    if (props.isOpen) {
      onClickClose()
    }
  }, [onClickClose, props.isOpen])

  const handleSubmitAction = useCallback(
    (close: () => void, e: FormEvent<HTMLFormElement>) => {
      if (props.isOpen) {
        onSubmit(close, e)
      }
    },
    [onSubmit, props.isOpen],
  )

  return createPortal(
    <DialogContentInner
      {...props}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={onPressEscape}
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
        onClickClose={handleClickClose}
        onSubmit={handleSubmitAction}
        responseStatus={responseStatus}
        decorators={decorators}
      >
        {children}
      </FormDialogContentInner>
    </DialogContentInner>,
  )
}
