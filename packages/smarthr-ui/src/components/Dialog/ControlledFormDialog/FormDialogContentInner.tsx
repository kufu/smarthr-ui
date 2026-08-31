import {
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../../hooks/client/useEnvironment'
import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { Localizer } from '../../../intl'
import { Button } from '../../Button'
import { Cluster } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeader } from '../DialogHeader'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type FormDialogHelpers = {
  close: () => void
}

type SubActionAreaHelpers = {
  /**
   * モバイル時の表示形式（'sheet' でボトムシート表示になる）
   */
  mobileType?: 'sheet'
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
  text?: ReactNode
  /** 閉じるボタンを無効にするかどうか */
  disabled?: boolean
}

export type BaseProps = PropsWithChildren<
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
    subActionArea?: ReactNode | ((helpers: SubActionAreaHelpers) => ReactNode)
    /**
     * モバイル時の表示形式（'sheet' でボトムシート表示になる）
     */
    mobileType?: 'sheet'
  }
>

export type FormDialogContentInnerProps = BaseProps & {
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
  mobileType,
}) => {
  const calculatedResponseStatus = useResponseStatus(responseStatus)
  const { mobile } = useEnvironment()
  // mobile 環境でないときは mobileType='sheet' を無視してボトムシート化しない
  const actualMobileType = mobile ? mobileType : undefined
  const actualSubActionArea =
    typeof subActionArea === 'function'
      ? subActionArea({ mobileType: actualMobileType })
      : subActionArea

  const classNames = useMemo(() => {
    const { form, wrapper, actionArea, actionAreaInner, buttonArea, message } =
      formDialogContentInner()
    const commonAttrs = { mobileType: actualMobileType }

    return {
      form: form(),
      wrapper: wrapper(commonAttrs),
      actionArea: actionArea({ mobile, mobileType: actualMobileType }),
      actionAreaInner: actionAreaInner(commonAttrs),
      buttonArea: buttonArea(commonAttrs),
      message: message(commonAttrs),
    }
  }, [mobile, actualMobileType])

  return (
    // eslint-disable-next-line smarthr/a11y-prohibit-sectioning-content-in-form
    <Section className={classNames.wrapper}>
      <DialogHeader mobileType={actualMobileType}>
        <DialogHeading {...heading} />
      </DialogHeader>
      <form className={classNames.form} onSubmit={handleSubmit}>
        <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
          {children}
        </DialogBody>
        <div className={classNames.actionArea}>
          <Cluster
            gap={ACTION_AREA_CLUSTER_GAP}
            justify="space-between"
            className={classNames.actionAreaInner}
          >
            {actualSubActionArea}
            <ActionAreaCluster
              loading={calculatedResponseStatus.isProcessing}
              className={classNames.buttonArea}
              handleClickClose={handleClickClose}
              closeButton={closeButton}
              actionButton={actionButton}
            />
          </Cluster>
          <DialogContentResponseStatusMessage
            responseStatus={calculatedResponseStatus}
            className={classNames.message}
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
      disabled={closeButton.disabled || loading}
      text={closeButton.text}
      handleClick={handleClickClose}
    />
    <ActionButton disabled={actionButton.disabled} loading={loading} variant={actionButton.theme}>
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
    disabled={disabled}
    loading={loading}
    variant={variant}
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
  <Button disabled={disabled} className="smarthr-ui-Dialog-closeButton" onClick={handleClick}>
    {text ?? <Localizer id="smarthr-ui/FormDialog/closeButtonLabel" defaultText="キャンセル" />}
  </Button>
))
