'use client'

import {
  type FC,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useCallback,
  useMemo,
} from 'react'

import { type ResponseStatus, useResponseStatus } from '../../../hooks/useResponseStatus'
import { useIntl } from '../../../intl'
import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogContentResponseStatusMessage } from '../DialogContentResponseStatusMessage'
import { DialogHeading, type Props as DialogHeadingProps } from '../DialogHeading'
import { dialogContentInner } from '../dialogInnerStyle'

export type ActionDialogHelpers = {
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
     * @param e マウスイベント
     * @param helpers ダイアログ操作のためのヘルパー関数
     */
    onClickAction: (e: MouseEvent<Element>, helpers: ActionDialogHelpers) => void
    /** 閉じるボタン */
    closeButton: ObjectCloseButtonType
    /** ダイアログフッターの左端操作領域 */
    subActionArea?: ReactNode
  }
>

export type ActionDialogContentInnerProps = AbstractProps & {
  onClickClose: () => void
  responseStatus?: ResponseStatus
}

const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

export const ActionDialogContentInner: FC<ActionDialogContentInnerProps> = ({
  children,
  heading,
  contentBgColor,
  contentPadding,
  actionButton,
  onClickAction,
  onClickClose,
  responseStatus,
  closeButton,
  subActionArea,
}) => {
  const calcedResponseStatus = useResponseStatus(responseStatus)

  const styles = useMemo(() => {
    const { wrapper, actionArea, buttonArea, message } = dialogContentInner()

    return {
      wrapper: wrapper(),
      actionArea: actionArea(),
      buttonArea: buttonArea(),
      message: message(),
    }
  }, [])

  return (
    <Section className={styles.wrapper}>
      <DialogHeading {...heading} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      <Stack gap={0.5} className={styles.actionArea}>
        <Cluster justify="space-between">
          {subActionArea}
          <ActionAreaCluster
            onClickClose={onClickClose}
            onClickAction={onClickAction}
            closeButton={closeButton}
            actionButton={actionButton}
            loading={calcedResponseStatus.isProcessing}
            className={styles.buttonArea}
          />
        </Cluster>
        <DialogContentResponseStatusMessage
          responseStatus={calcedResponseStatus}
          className={styles.message}
        />
      </Stack>
    </Section>
  )
}

const ActionAreaCluster = memo<
  Pick<ActionDialogContentInnerProps, 'onClickClose' | 'onClickAction'> & {
    actionButton: ObjectActionButtonType
    closeButton: ObjectCloseButtonType
    loading: boolean
    className: string
  }
>(({ onClickClose, onClickAction, closeButton, actionButton, loading, className }) => {
  const handleClickAction = useCallback(
    (e: MouseEvent<Element>) => {
      onClickAction(e, { close: onClickClose })
    },
    [onClickAction, onClickClose],
  )

  return (
    <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
      <CloseButton
        onClick={onClickClose}
        disabled={closeButton.disabled || loading}
        text={closeButton.text}
      />
      <ActionButton
        variant={actionButton.theme}
        disabled={actionButton.disabled}
        loading={loading}
        onClick={handleClickAction}
      >
        {actionButton.text}
      </ActionButton>
    </Cluster>
  )
})

const ActionButton = memo<
  PropsWithChildren<{
    variant: ObjectActionButtonType['theme']
    disabled: ObjectActionButtonType['disabled']
    loading: boolean
    onClick: (e: MouseEvent<HTMLButtonElement>) => void
  }>
>(({ variant = 'primary', disabled, loading, onClick, children }) => (
  <Button
    type="submit"
    variant={variant}
    disabled={disabled}
    loading={loading}
    onClick={onClick}
    className="smarthr-ui-Dialog-actionButton"
  >
    {children}
  </Button>
))

const CloseButton = memo<{
  onClick: ActionDialogContentInnerProps['onClickClose']
  disabled: boolean
  text: ReactNode
}>(({ onClick, disabled, text }) => {
  const { localize } = useIntl()

  const defaultText = useMemo(
    () =>
      localize({
        id: 'smarthr-ui/ActionDialog/closeButtonLabel',
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
