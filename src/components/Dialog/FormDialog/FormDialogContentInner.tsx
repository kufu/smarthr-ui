import React, { FC, PropsWithChildren, ReactNode, useCallback } from 'react'

import { Button } from '../../Button'
import { Heading, HeadingTagTypes } from '../../Heading'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { Text } from '../../Text'
import { useOffsetHeight } from '../dialogHelper'
import { useDialoginnerStyle } from '../useDialogInnerStyle'

import type { DecoratorsType, ResponseMessageType } from '../../../types'

export type BaseProps = PropsWithChildren<{
  /**
   * ダイアログのタイトル
   */
  title: ReactNode
  /**
   * ダイアログのサブタイトル
   */
  subtitle?: ReactNode
  /**
   * @deprecated SectioningContent(Article, Aside, Nav, Section)でDialog全体をラップして、ダイアログタイトルのHeadingレベルを設定してください
   */
  titleTag?: HeadingTagTypes
  /**
   * アクションボタンのラベル
   */
  actionText: ReactNode
  /**
   * アクションボタンのスタイル
   */
  actionTheme?: 'primary' | 'secondary' | 'danger'
  /**
   * アクションボタンをクリックした時に発火するコールバック関数
   * @param closeDialog - ダイアログを閉じる関数
   */
  onSubmit: (closeDialog: () => void) => void
  /**
   * アクションボタンを無効にするかどうか
   */
  actionDisabled?: boolean
  /**
   * 閉じるボタンを無効にするかどうか
   */
  closeDisabled?: boolean
  /** ダイアログフッターの左端操作領域 */
  subActionArea?: ReactNode
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'closeButtonLabel'>
}>

export type FormDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: ResponseMessageType
  titleId: string
}

const CLOSE_BUTTON_LABEL = 'キャンセル'

export const FormDialogContentInner: FC<FormDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag,
  actionText,
  actionTheme = 'primary',
  onSubmit,
  onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
  subActionArea,
  decorators,
}) => {
  const handleSubmitAction = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // HINT: React Potals などで擬似的にformがネストしている場合など、stopPropagationを実行しないと
      // 親formが意図せずsubmitされてしまう場合がある
      e.stopPropagation()
      onSubmit(onClickClose)
    },
    [onSubmit, onClickClose],
  )
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  const { titleAreaStyle, bodyStyleProps, actionAreaStyle, buttonAreaStyle, messageStyle } =
    useDialoginnerStyle(offsetHeight)

  return (
    <Section>
      <form onSubmit={handleSubmitAction}>
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <Heading tag={titleTag}>
          <Stack gap={0.25} as="span" ref={titleRef} className={titleAreaStyle}>
            {subtitle && (
              <Text
                size="S"
                leading="TIGHT"
                color="TEXT_GREY"
                className="smarthr-ui-Dialog-subtitle"
              >
                {subtitle}
              </Text>
            )}
            <Text id={titleId} size="L" leading="TIGHT" className="smarthr-ui-Dialog-title">
              {title}
            </Text>
          </Stack>
        </Heading>
        <div {...bodyStyleProps}>{children}</div>
        <Stack gap={0.5} ref={bottomRef} className={actionAreaStyle}>
          <Cluster justify="space-between">
            {subActionArea}
            <Cluster gap={{ row: 0.5, column: 1 }} className={buttonAreaStyle}>
              <Button
                onClick={onClickClose}
                disabled={closeDisabled || isRequestProcessing}
                className="smarthr-ui-Dialog-closeButton"
              >
                {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
              </Button>
              <Button
                type="submit"
                variant={actionTheme}
                disabled={actionDisabled}
                loading={isRequestProcessing}
                className="smarthr-ui-Dialog-actionButton"
              >
                {actionText}
              </Button>
            </Cluster>
          </Cluster>
          {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
            <div className={messageStyle}>
              <ResponseMessage type={responseMessage.status} role="alert">
                {responseMessage.text}
              </ResponseMessage>
            </div>
          )}
        </Stack>
      </form>
    </Section>
  )
}
