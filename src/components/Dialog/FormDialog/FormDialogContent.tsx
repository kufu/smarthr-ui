import React, { HTMLAttributes, useCallback, useContext } from 'react'

import { useId } from '../../../hooks/useId'
import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { UncontrolledDialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import { BaseProps, FormDialogContentInner } from './FormDialogContentInner'

type Props = BaseProps & UncontrolledDialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const FormDialogContent: React.FC<Props & ElementProps> = ({
  children,
  title,
  actionText,
  actionTheme,
  onSubmit,
  actionDisabled = false,
  portalParent,
  className = '',
  decorators,
  ...props
}) => {
  const { onClickClose, active } = useContext(DialogContext)
  const { createPortal } = useDialogPortal(portalParent)

  const handleClickClose = useCallback(() => {
    if (!active) {
      return
    }
    onClickClose()
  }, [active, onClickClose])

  const handleSubmitAction = useCallback(() => {
    if (!active) {
      return
    }
    onSubmit(onClickClose)
  }, [active, onSubmit, onClickClose])

  const titleId = useId()

  return createPortal(
    <DialogContentInner
      {...props}
      onPressEscape={onClickClose}
      isOpen={active}
      ariaLabelledby={titleId}
      className={className}
    >
      {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <FormDialogContentInner
        title={title}
        titleId={titleId}
        actionText={actionText}
        actionTheme={actionTheme}
        onSubmit={handleSubmitAction}
        onClickClose={handleClickClose}
        actionDisabled={actionDisabled}
        decorators={decorators}
      >
        {children}
      </FormDialogContentInner>
    </DialogContentInner>,
  )
}
