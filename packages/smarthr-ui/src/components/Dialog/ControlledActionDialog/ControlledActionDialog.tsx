'use client'

import { type ComponentProps, type FC, type ReactNode, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { DialogContentInner } from '../DialogContentInner'
import { useControlledMobile } from '../useControlledMobile'
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

type BaseProps = Omit<
  ActionDialogContentInnerProps,
  'heading' | 'actionButton' | 'closeButton' | 'handleClickAction' | 'handleClickClose' | 'mobile'
> &
  DialogProps & {
    heading: HeadingType
    actionButton: ReactNode | ObjectActionButtonType
    closeButton?: ReactNode | ObjectCloseButtonType
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     */
    onClickAction: (e: React.MouseEvent<Element>, helpers: ActionDialogHelpers) => void
    /**
     * 閉じるボタンをクリックした時に発火するコールバック関数
     */
    onClickClose: () => void
  }
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

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
  mobileType: orgMobileType,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  const { mobile, mobileType } = useControlledMobile(orgMobileType)

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

  const latest = useLatest({ onClickClose, onClickAction, isOpen })

  const functions = useMemo(
    () => ({
      handleClickClose: () => {
        if (latest.isOpen) {
          latest.onClickClose()
        }
      },
      handleClickAction: (e: React.MouseEvent<Element>, helpers: ActionDialogHelpers) => {
        if (latest.isOpen) {
          latest.onClickAction(e, helpers)
        }
      },
    }),
    [latest],
  )

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      mobileType={mobileType}
      className={className}
      ariaLabelledby={heading.id}
      onPressEscape={closeButton.disabled ? undefined : onPressEscape}
    >
      <ActionDialogContentInner
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        responseStatus={responseStatus}
        mobile={mobile}
        mobileType={mobileType}
        handleClickClose={functions.handleClickClose}
        handleClickAction={functions.handleClickAction}
        heading={heading}
        actionButton={actionButton}
        closeButton={closeButton}
        subActionArea={subActionArea}
      >
        {children}
      </ActionDialogContentInner>
    </DialogContentInner>,
  )
}
