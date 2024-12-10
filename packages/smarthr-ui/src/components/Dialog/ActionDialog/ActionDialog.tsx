'use client'

import React, { ComponentProps, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { DialogProps } from '../types'
import { useDialogPortal } from '../useDialogPortal'

import { ActionDialogContentInner, ActionDialogContentInnerProps } from './ActionDialogContentInner'

type Props = Omit<ActionDialogContentInnerProps, 'titleId'> & DialogProps
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const ActionDialog: React.FC<Props & ElementProps> = ({
  children,
  title,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  onPressEscape = onClickClose,
  responseMessage,
  actionDisabled = false,
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
    if (!props.isOpen) {
      return
    }
    onClickClose()
  }, [onClickClose, props.isOpen])

  const handleClickAction = useCallback(() => {
    if (!props.isOpen) {
      return
    }
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose, props.isOpen])

  return createPortal(
    <DialogContentInner
      {...props}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={onPressEscape}
    >
      <ActionDialogContentInner
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
        onClickClose={handleClickClose}
        onClickAction={handleClickAction}
        subActionArea={subActionArea}
        responseMessage={responseMessage}
        decorators={decorators}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
