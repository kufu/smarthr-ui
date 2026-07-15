import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { useIntl } from '../../../intl'
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
    onSubmit: (e: FormEvent<HTMLFormElement>) => void
    /** 閉じるボタン */
    closeButton: ObjectCloseButtonType
    /** ダイアログフッターの左端操作領域 */
    subActionArea?: ReactNode
  }
>

export type FormDialogContentInnerProps = AbstractProps & {
  onClickClose: () => void
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
  onSubmit,
  onClickClose,
  responseStatus,
  closeButton,
  subActionArea,
}) => {
  const calculatedResponseStatus = useResponseStatus(responseStatus)

  return (
    // eslint-disable-next-line smarthr/a11y-prohibit-sectioning-content-in-form
    <Section className={CLASS_NAMES.wrapper}>
      <DialogHeading {...heading} />
      <form onSubmit={onSubmit} className={CLASS_NAMES.form}>
        <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
          {children}
        </DialogBody>
        <div className={CLASS_NAMES.actionArea}>
          <Cluster justify="space-between">
            {subActionArea}
            <ActionAreaCluster
              onClickClose={onClickClose}
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
  Pick<FormDialogContentInnerProps, 'onClickClose'> & {
    actionButton: ObjectActionButtonType
    closeButton: ObjectCloseButtonType
    loading: boolean
    className: string
  }
>(({ onClickClose, closeButton, actionButton, loading, className }) => (
  <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
    <CloseButton
      onClick={onClickClose}
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
  onClick: FormDialogContentInnerProps['onClickClose']
  disabled: boolean
  text: ReactNode
}>(({ onClick, disabled, text }) => {
  const { localize } = useIntl()

  const defaultText = useMemo(
    () =>
      localize({
        id: 'smarthr-ui/FormDialog/closeButtonLabel',
        defaultText: 'キャンセル',
      }),
    [localize],
  )

  return (
    <Button onClick={onClick} disabled={disabled} className="smarthr-ui-Dialog-closeButton">
      {text ?? defaultText}
    </Button>
  )
})
