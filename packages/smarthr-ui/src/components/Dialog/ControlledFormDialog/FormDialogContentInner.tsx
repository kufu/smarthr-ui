import { type FC, type FormEvent, type PropsWithChildren, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Localizer } from '../../../intl'
import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type FormDialogHelpers = {
  close: () => void
}

type ObjectActionButtonType = {
  /** アクションボタンのラベル */
  text: ReactNode
  /** アクションボタンのスタイル */
  theme?: 'primary' | 'secondary' | 'danger'
  /** アクションボタンを無効にするかどうか */
  disabled?: boolean
}

type ObjectCloseButtonType = {
  /** 閉じるボタンのラベル */
  text: ReactNode
  /** 閉じるボタンを無効にするかどうか */
  disabled?: boolean
}

export type AbstractProps = PropsWithChildren<
  DialogBodyProps & {
    /** ダイアログタイトル */
    heading: DialogHeadingProps
    /** アクションボタン */
    actionButton: ObjectActionButtonType
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param e フォームイベント
     */
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void
    /** 閉じるボタン */
    closeButton: ObjectCloseButtonType
    /** ダイアログフッターの左端操作領域 */
    subActionArea?: ReactNode
  }
>

export type FormDialogContentInnerProps = AbstractProps & {
  handleClickClose: () => void
  responseStatus?: ResponseStatus
}

const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

const formDialogContentInner = tv({
  extend: dialogContentInner,
  slots: {
    form: 'shr-contents',
  },
})

const CLASS_NAMES = (() => {
  const { form, wrapper, actionArea, buttonArea, message } = formDialogContentInner()

  return {
    form: form(),
    wrapper: wrapper(),
    actionArea: actionArea(),
    buttonArea: buttonArea(),
    message: message(),
  }
})()

export const FormDialogContentInner: FC<FormDialogContentInnerProps> = ({
  children,
  heading,
  contentBgColor,
  contentPadding,
  actionButton,
  handleSubmit,
  handleClickClose,
  responseStatus,
  closeButton,
  subActionArea,
}) => {
  const calculatedResponseStatus = useResponseStatus(responseStatus)

  return (
    // eslint-disable-next-line smarthr/a11y-prohibit-sectioning-content-in-form
    <Section className={CLASS_NAMES.wrapper}>
      <DialogHeading {...heading} />
      <form onSubmit={handleSubmit} className={CLASS_NAMES.form}>
        <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
          {children}
        </DialogBody>
        <div className={CLASS_NAMES.actionArea}>
          <Cluster justify="space-between">
            {subActionArea}
            <ActionAreaCluster
              handleClickClose={handleClickClose}
              closeButton={closeButton}
              actionButton={actionButton}
              loading={calculatedResponseStatus.isProcessing}
              className={CLASS_NAMES.buttonArea}
            />
          </Cluster>
          <DialogContentResponseStatusMessage
            responseStatus={calculatedResponseStatus}
            className={CLASS_NAMES.message}
          />
        </div>
      </form>
    </Section>
  )
}

const ActionAreaCluster = memo<
  Pick<FormDialogContentInnerProps, 'handleClickClose'> & {
    actionButton: ObjectActionButtonType
    closeButton: ObjectCloseButtonType
    loading: boolean
    className: string
  }
>(({ handleClickClose, closeButton, actionButton, loading, className }) => (
  <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
    <CloseButton
      handleClick={handleClickClose}
      disabled={closeButton.disabled || loading}
      text={closeButton.text}
    />
    <ActionButton variant={actionButton.theme} disabled={actionButton.disabled} loading={loading}>
      {actionButton.text}
    </ActionButton>
  </Cluster>
))

const ActionButton = memo<
  PropsWithChildren<{
    variant: ObjectActionButtonType['theme']
    disabled: ObjectActionButtonType['disabled']
    loading: boolean
  }>
>(({ variant = 'primary', disabled, loading, children }) => (
  <Button
    type="submit"
    variant={variant}
    disabled={disabled}
    loading={loading}
    className="smarthr-ui-Dialog-actionButton"
  >
    {children}
  </Button>
))

const CloseButton = memo<{
  handleClick: FormDialogContentInnerProps['handleClickClose']
  disabled: boolean
  text: ReactNode
}>(({ handleClick, disabled, text }) => (
  <Button onClick={handleClick} disabled={disabled} className="smarthr-ui-Dialog-closeButton">
    {text ?? <Localizer id="smarthr-ui/FormDialog/closeButtonLabel" defaultText="キャンセル" />}
  </Button>
))
