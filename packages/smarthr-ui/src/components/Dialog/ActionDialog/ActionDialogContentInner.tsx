'use client'

import React, { type FC, type PropsWithChildren, type ReactNode, useCallback } from 'react'

import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { DialogBody, type Props as DialogBodyProps } from '../DialogBody'
import { DialogHeader, type Props as DialogHeaderProps } from '../DialogHeader'
import { dialogContentInner } from '../dialogInnerStyle'

import type { DecoratorsType, ResponseMessageType } from '../../../types'

export type BaseProps = PropsWithChildren<
  DialogHeaderProps &
    DialogBodyProps & {
      /** アクションボタンのラベル */
      actionText: ReactNode
      /** アクションボタンのスタイル */
      actionTheme?: 'primary' | 'secondary' | 'danger'
      /**
       * アクションボタンをクリックした時に発火するコールバック関数
       * @param closeDialog - ダイアログを閉じる関数
       */
      onClickAction: (closeDialog: () => void) => void
      /** アクションボタンを無効にするかどうか */
      actionDisabled?: boolean
      /** 閉じるボタンを無効にするかどうか */
      closeDisabled?: boolean
      /** ダイアログフッターの左端操作領域 */
      subActionArea?: ReactNode
      /** コンポーネント内の文言を変更するための関数を設定 */
      decorators?: DecoratorsType<'closeButtonLabel'>
    }
>

export type ActionDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: ResponseMessageType
}

const CLOSE_BUTTON_LABEL = 'キャンセル'
const ACTION_AREA_CLUSTER_GAP = { row: 0.5, column: 1 } as const

export const ActionDialogContentInner: FC<ActionDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme,
  onClickAction,
  onClickClose,
  responseMessage,
  actionDisabled,
  closeDisabled,
  subActionArea,
  decorators,
}) => {
  const calcedResponseStatus = useMemo(() => {
    if (!responseMessage) {
      return {
        isProcessing: false,
        visibleMessage: false,
      }
    }

    if (responseMessage.status === 'processing') {
      return {
        isProcessing: true,
        visibleMessage: false,
      }
    }

    return {
      isProcessing: false,
      visibleMessage: true,
      // HINT: statusがprocessingではない === success or errorであることが確定する
      // success or error の場合、text属性も必ず存在する
      status: responseMessage.status as 'success' | 'error',
      message: (responseMessage as { text: string }).text,
    }
  }, [responseMessage])

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
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Section className={styles.wrapper}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      <Stack gap={0.5} className={styles.actionArea}>
        <Cluster justify="space-between">
          {subActionArea}
          <ActionAreaCluster
            onClickClose={onClickClose}
            onClickAction={onClickAction}
            closeDisabled={closeDisabled}
            actionDisabled={actionDisabled}
            loading={calcedResponseStatus.isProcessing}
            actionTheme={actionTheme}
            decorators={decorators}
            actionText={actionText}
            className={styles.buttonArea}
          />
        </Cluster>
        {calcedResponseStatus.visibleMessage && (
          <div className={styles.message}>
            <ResponseMessage type={calcedResponseStatus.status} role="alert">
              {calcedResponseStatus.message}
            </ResponseMessage>
          </div>
        )}
      </Stack>
    </Section>
  )
}

const ActionAreaCluster = React.memo<
  Pick<
    FormDialogContentInnerProps,
    | 'onClickClose'
    | 'onClickAction'
    | 'closeDisabled'
    | 'actionDisabled'
    | 'actionTheme'
    | 'decorators'
    | 'actionText'
  > & { loading: boolean; className: string }
>(
  ({
    onClickClose,
    onClickAction,
    closeDisabled,
    actionDisabled,
    loading,
    actionTheme,
    decorators,
    actionText,
    className,
  }) => {
    const handleClickAction = useCallback(() => {
      onClickAction(onClickClose)
    }, [onClickAction, onClickClose])

    return (
      <Cluster gap={ACTION_AREA_CLUSTER_GAP} className={className}>
        <CloseButton
          onClick={onClickClose}
          disabled={closeDisabled || loading}
          decorators={decorators}
        />
        <ActionButton
          variant={actionTheme}
          disabled={actionDisabled}
          loading={loading}
          onClick={handleClickAction}
        >
          {actionText}
        </ActionButton>
      </Cluster>
    )
  },
)

const ActionButton = React.memo<
  PropsWithChildren<{
    variant: ActionDialogContentInnerProps['actionTheme']
    disabled: ActionDialogContentInnerProps['actionDisabled']
    loading: boolean
    onClick: () => void
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

const CloseButton = React.memo<
  Pick<ActionDialogContentInnerProps, 'decorators'> & {
    onClick: ActionDialogContentInnerProps['onClickClose']
    disabled: boolean
  }
>(({ onClick, disabled, decorators }) => {
  const children = useMemo(
    () => decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL,
    [decorators],
  )

  return (
    <Button onClick={onClick} disabled={disabled} className="smarthr-ui-Dialog-closeButton">
      {children}
    </Button>
  )
})
