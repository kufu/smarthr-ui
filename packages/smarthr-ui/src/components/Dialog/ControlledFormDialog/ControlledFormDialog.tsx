'use client'

import { type ComponentProps, type FC, type FormEvent, type ReactNode, useMemo } from 'react'

import { useEnvironment } from '../../../hooks/client/useEnvironment'
import { useLatest } from '../../../hooks/useLatest'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { DialogContentInner } from '../DialogContentInner'
import { useDialogPortal } from '../useDialogPortal'
import { useObjectHeading } from '../useObjectHeading'

import {
  FormDialogContentInner,
  type FormDialogContentInnerProps,
  type FormDialogHelpers,
} from './FormDialogContentInner'

import type { DialogProps } from '../types'

type ObjectHeadingType = Omit<FormDialogContentInnerProps['heading'], 'id'>
type HeadingType = ReactNode | ObjectHeadingType
type ObjectActionButtonType = FormDialogContentInnerProps['actionButton']
type ObjectCloseButtonType = FormDialogContentInnerProps['closeButton']

type BaseProps = Omit<
  FormDialogContentInnerProps,
  'heading' | 'actionButton' | 'closeButton' | 'handleClickClose' | 'handleSubmit' | 'mobile'
> &
  DialogProps & {
    heading: HeadingType
    actionButton: ReactNode | ObjectActionButtonType
    closeButton?: ReactNode | ObjectCloseButtonType
    /**
     * フォーム送信時に発火するコールバック関数
     */
    onSubmit: (e: FormEvent<HTMLFormElement>, helpers: FormDialogHelpers) => void
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

export const ControlledFormDialog: FC<Props> = ({
  children,
  heading: orgHeading,
  contentBgColor,
  contentPadding,
  actionButton: orgActionButton,
  onSubmit,
  onClickClose,
  onPressEscape = onClickClose,
  responseStatus,
  closeButton: orgCloseButton,
  subActionArea,
  className,
  portalParent,
  id,
  isOpen,
  mobileType,
  ...rest
}) => {
  const { createPortal } = useDialogPortal(portalParent, id)

  // TODO: カスタムhook化する
  const { mobile } = useEnvironment()
  // mobile 環境でないときは mobileType='sheet' を無視してボトムシート化しない
  const actualMobileType = mobile ? mobileType : undefined

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

  const latest = useLatest({ onClickClose, onSubmit, isOpen })

  const functions = useMemo(() => {
    const handleClickClose = () => {
      if (latest.isOpen) {
        latest.onClickClose()
      }
    }

    return {
      handleClickClose,
      handleSubmit: (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // HINT: React Portals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
        // 親formが意図せずsubmitされてしまう場合がある
        e.stopPropagation()
        if (latest.isOpen) {
          latest.onSubmit(e, { close: handleClickClose })
        }
      },
    }
  }, [latest])

  return createPortal(
    <DialogContentInner
      {...rest}
      isOpen={isOpen}
      mobileType={actualMobileType}
      className={className}
      ariaLabelledby={heading.id}
      onPressEscape={closeButton.disabled ? undefined : onPressEscape}
    >
      <FormDialogContentInner
        contentBgColor={contentBgColor}
        contentPadding={contentPadding}
        responseStatus={responseStatus}
        mobile={mobile}
        mobileType={actualMobileType}
        handleClickClose={functions.handleClickClose}
        handleSubmit={functions.handleSubmit}
        heading={heading}
        actionButton={actionButton}
        closeButton={closeButton}
        subActionArea={subActionArea}
      >
        {children}
      </FormDialogContentInner>
    </DialogContentInner>,
  )
}
