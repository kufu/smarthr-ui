'use client'

import { type ComponentProps, type FC, useCallback, useId } from 'react'

import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'

import {
  ActionDialogContentInner,
  type ActionDialogContentInnerProps,
  type ActionDialogHelpers,
} from './ActionDialogContentInner'

import type { DialogProps } from '../types'

type AbstractProps = Omit<ActionDialogContentInnerProps, 'titleId'> & DialogProps
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

export const ActionDialog: FC<Props> = ({
  children,
  title,
  subtitle,
  unrecommendedTitleTag,
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
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)
  const titleId = useId()

  const actualOnClickClose = useCallback(() => {
    if (isOpen) {
      onClickClose()
    }
  }, [isOpen, onClickClose])

  const actualOnClickAction = useCallback(
    (e: React.MouseEvent<Element>, helpers: ActionDialogHelpers) => {
      if (isOpen) {
        onClickAction(e, helpers)
      }
    },
    [isOpen, onClickAction],
  )

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      ariaLabelledby={titleId}
      className={className}
      onPressEscape={closeDisabled ? undefined : onPressEscape}
    >
      <ActionDialogContentInner
        title={title}
        titleId={titleId}
        subtitle={subtitle}
        unrecommendedTitleTag={unrecommendedTitleTag}
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
