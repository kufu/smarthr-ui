'use client'

import React, { HTMLAttributes, useCallback, useContext, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogContext } from '../DialogWrapper'
import { UncontrolledDialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import { ActionDialogContentInner, BaseProps } from './ActionDialogContentInner'

type Props = Omit<BaseProps, 'titleId'> & UncontrolledDialogProps
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const ActionDialogContent: React.FC<Props & ElementProps> = ({
  children,
  title,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onClickAction,
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

  const handleClickAction = useCallback(() => {
    if (!active) {
      return
    }
    onClickAction(onClickClose)
  }, [active, onClickAction, onClickClose])

  const titleId = useId()

  return createPortal(
    <DialogContentInner
      {...props}
      onPressEscape={onClickClose}
      isOpen={active}
      ariaLabelledby={titleId}
      className={className}
    >
      <ActionDialogContentInner
        title={title}
        titleId={titleId}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionText={actionText}
        actionTheme={actionTheme}
        onClickAction={handleClickAction}
        onClickClose={handleClickClose}
        actionDisabled={actionDisabled}
        decorators={decorators}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
