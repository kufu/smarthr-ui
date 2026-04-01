'use client'

import { type ComponentProps, type FC, type ReactNode, useCallback } from 'react'

import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  ActionDialogContentInner,
  type ActionDialogContentInnerProps,
  type ActionDialogHelpers,
} from './ActionDialogContentInner'

import type { DialogProps } from '../types'

type ObjectHeadingType = Omit<ActionDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType
type ObjectActionButtonType = ActionDialogContentInnerProps['actionButton']
type ObjectCloseButtonType = ActionDialogContentInnerProps['closeButton']

type AbstractProps = Omit<
  ActionDialogContentInnerProps,
  'heading' | 'actionButton' | 'closeButton'
> &
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

export const ControlledActionDialog: FC<Props> = ({
  children,
  heading: orgHeading,
  contentBgColor,
  contentPadding,
  actionButton: orgActionButton,
  onClickAction,
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
      ariaLabelledby={heading.id}
      className={className}
      onPressEscape={closeButton.disabled ? undefined : onPressEscape}
    >
      <ActionDialogContentInner
        heading={heading}
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        actionButton={actionButton}
        closeButton={closeButton}
        onClickClose={actualOnClickClose}
        onClickAction={actualOnClickAction}
        subActionArea={subActionArea}
        responseStatus={responseStatus}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
