import React, { HTMLAttributes, useCallback } from 'react'

import { useId } from '../../../hooks/useId'
import { DialogContentInner } from '../DialogContentInner'
import { DialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import { FormDialogContentInner, FormDialogContentInnerProps } from './FormDialogContentInner'

type Props = Omit<FormDialogContentInnerProps, 'titleId'> & DialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const FormDialog: React.FC<Props & ElementProps> = ({
  children,
  title,
  subtitle,
  titleTag,
  actionText,
  actionTheme,
  onSubmit,
  onClickClose,
  onPressEscape = onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  className = '',
  portalParent,
  decorators,
  id,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()

  const handleClickClose = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, props.isOpen])

  const handleSubmitAction = useCallback(() => {
    if (!props.isOpen) {
      return
    }

    onSubmit(onClickClose)
  }, [onSubmit, onClickClose, props.isOpen])

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
        actionText={actionText}
        actionTheme={actionTheme}
        actionDisabled={actionDisabled}
        closeDisabled={closeDisabled}
        onClickClose={handleClickClose}
        onSubmit={handleSubmitAction}
        responseMessage={responseMessage}
        decorators={decorators}
      >
        {children}
      </FormDialogContentInner>
    </DialogContentInner>,
  )
}
