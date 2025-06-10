'use client'

import { type ComponentProps, type FC, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'

import {
  ActionDialogContentInner,
  type ActionDialogContentInnerProps,
} from './ActionDialogContentInner'

import type { DialogProps } from '../types'

type Props = Omit<ActionDialogContentInnerProps, 'titleId'> & DialogProps
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

export const ActionDialog: FC<Props & ElementProps> = ({
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
  responseStatus,
  actionDisabled,
  closeDisabled,
  subActionArea,
  className,
  portalParent,
  decorators,
  id,
  isOpen,
  ...props
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const actualOnClickAction = useCallback(() => {
    if (isOpen) {
      onClickAction(onClickClose)
    }
  }, [isOpen, onClickAction, onClickClose])

  return createPortal(
    <DialogContentInner
      {...props}
      isOpen={isOpen}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={closeDisabled ? undefined : onPressEscape}
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
        onClickClose={actualOnClickClose}
        onClickAction={actualOnClickAction}
        subActionArea={subActionArea}
        responseStatus={responseStatus}
        decorators={decorators}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
