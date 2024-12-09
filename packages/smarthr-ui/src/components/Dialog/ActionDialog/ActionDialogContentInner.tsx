'use client'

import React, { type FC, type PropsWithChildren, type ReactNode, useCallback } from 'react'

import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
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
export const ActionDialogContentInner: FC<ActionDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag,
  contentBgColor,
  contentPadding,
  actionText,
  actionTheme = 'primary',
  onClickAction,
  onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  subActionArea,
  decorators,
}) => {
  const handleClickAction = useCallback(() => {
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose])
  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  const { wrapper, actionArea, buttonArea, message } = dialogContentInner()

  return (
    // eslint-disable-next-line smarthr/best-practice-for-layouts, smarthr/a11y-heading-in-sectioning-content
    <Stack gap={0} as="section" className={wrapper()}>
      <DialogHeader title={title} subtitle={subtitle} titleTag={titleTag} titleId={titleId} />
      <DialogBody contentPadding={contentPadding} contentBgColor={contentBgColor}>
        {children}
      </DialogBody>
      <Stack gap={0.5} className={actionArea()}>
        <Cluster justify="space-between">
          {subActionArea}
          <Cluster gap={{ row: 0.5, column: 1 }} className={buttonArea()}>
            <Button
              onClick={onClickClose}
              disabled={closeDisabled || isRequestProcessing}
              className="smarthr-ui-Dialog-closeButton"
            >
              {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
            </Button>
            <Button
              variant={actionTheme}
              onClick={handleClickAction}
              disabled={actionDisabled}
              loading={isRequestProcessing}
              className="smarthr-ui-Dialog-actionButton"
            >
              {actionText}
            </Button>
          </Cluster>
        </Cluster>
        {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
          <div className={message()}>
            <ResponseMessage type={responseMessage.status} role="alert">
              {responseMessage.text}
            </ResponseMessage>
          </div>
        )}
      </Stack>
    </Stack>
  )
}
