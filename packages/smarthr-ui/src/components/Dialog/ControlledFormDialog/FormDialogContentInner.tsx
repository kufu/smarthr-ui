import {
  type ComponentPropsWithoutRef,
  type FC,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type FormDialogHelpers = {
  close: () => void
}

type ObjectActionButtonType = ComponentPropsWithoutRef<typeof Button>

type ObjectCloseButtonType = ComponentPropsWithoutRef<typeof Button>

export type AbstractProps = PropsWithChildren<
  DialogBodyProps & {
    /** ダイアログタイトル */
    heading: DialogHeadingProps
    /** アクションボタン */
    actionButton: ObjectActionButtonType
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param e フォームイベント
     * @param helpers ダイアログ操作のためのヘルパー関数
     */
    onSubmit: (e: FormEvent<HTMLFormElement>, helpers: FormDialogHelpers) => void
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
  const handleSubmitAction = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // HINT: React Portals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある
      e.stopPropagation()
      onSubmit(e, { close: onClickClose })
    },
    [onSubmit, onClickClose],
  )

  const calculatedResponseStatus = useResponseStatus(responseStatus)

  const styles = useMemo(() => {
    const { form, wrapper, actionArea, buttonArea, message } = formDialogContentInner()

    return {
      form: form(),
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  return (
    // eslint-disable-next-line smarthr/a11y-prohibit-sectioning-content-in-form
    <Section className={styles.wrapper}>
      <DialogHeading {...heading} />
      <form onSubmit={handleSubmitAction} className={styles.form}>
        <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
          {children}
        </DialogBody>
        <Stack gap={0.5} className={styles.actionArea}>
          <Cluster justify="space-between">
            {subActionArea}
            <ActionAreaCluster
              onClickClose={onClickClose}
              closeButton={closeButton}
              actionButton={actionButton}
              loading={calculatedResponseStatus.isProcessing}
              className={styles.buttonArea}
            />
          </Cluster>
          <DialogContentResponseStatusMessage
            responseStatus={calculatedResponseStatus}
            className={styles.message}
          />
        </Stack>
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
>(({ onClickClose, closeButton, actionButton, loading, className }) => {
  const { onClick: _closeButtonOnClick, ...closeButtonRest } = closeButton

  return (
    <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
      <CloseButton {...closeButtonRest} onClick={onClickClose} disabled={loading} />
      <ActionButton {...actionButton} loading={loading} />
    </Cluster>
  )
})

const ActionButton = memo<
  ObjectActionButtonType & {
    loading: boolean
  }
>(({ children, variant = 'primary', loading, ...rest }) => (
  <Button
    {...rest}
    type="submit"
    variant={variant}
    loading={loading}
    className="smarthr-ui-Dialog-actionButton"
  >
    {children}
  </Button>
))

const CloseButton = memo<
  ObjectCloseButtonType & {
    onClick: FormDialogContentInnerProps['onClickClose']
    disabled: boolean
  }
>(({ onClick, disabled, children, disabled: buttonDisabled, ...rest }) => {
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
    <Button
      {...rest}
      onClick={onClick}
      disabled={disabled || buttonDisabled}
      className="smarthr-ui-Dialog-closeButton"
    >
      {children ?? defaultText}
    </Button>
  )
})
