import React, { FC, PropsWithChildren, ReactNode, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../Button'
import { Heading, HeadingTagTypes } from '../../Heading'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { Text } from '../../Text'
import { useOffsetHeight } from '../dialogHelper'

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
   * @deprecated SectioningContent(Article, Aside, Nav, Section, SectioningFragment)でDialog全体をラップして、ダイアログタイトルのHeadingレベルを設定してください
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
  onClickAction: (closeDialog: () => void) => void
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

export type ActionDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: ResponseMessageType
  titleId: string
}

const CLOSE_BUTTON_LABEL = 'キャンセル'

const actionDialogContentInner = tv({
  slots: {
    headingArea: ['smarthr-ui-Dialog-titleArea', 'shr-border-b-shorthand shr-px-1.5 shr-py-1'],
    body: ['smarthr-ui-Dialog-body', 'shr-overflow-auto'],
    actionArea: ['smarthr-ui-Dialog-actionArea', 'shr-border-t-shorthand shr-px-1.5 shr-py-1'],
    buttonArea: ['smarthr-ui-Dialog-buttonArea', 'shr-ms-auto'],
    message: 'shr-text-right',
  },
})

export const ActionDialogContentInner: FC<ActionDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag,
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
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  const { headingStyle, bodyStyleProps, actionAreaStyle, buttonAreaStyle, messageStyle } =
    useMemo(() => {
      const { headingArea, body, actionArea, buttonArea, message } = actionDialogContentInner()
      return {
        headingStyle: headingArea(),
        bodyStyleProps: {
          className: body(),
          style: {
            maxHeight: `calc(100vh - ${offsetHeight}px)`,
          },
        },
        actionAreaStyle: actionArea(),
        buttonAreaStyle: buttonArea(),
        messageStyle: message(),
      }
    }, [offsetHeight])

  return (
    <Section>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading tag={titleTag}>
        <Stack gap={0.25} as="span" ref={titleRef} className={headingStyle}>
          {subtitle && (
            <Text size="S" leading="TIGHT" color="TEXT_GREY" className="smarthr-ui-Dialog-subtitle">
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
        <Cluster justify="space-between" className={buttonAreaStyle}>
          {subActionArea}
          <Cluster
            gap={{ row: 0.5, column: 1 }}
            justify="flex-end"
            className="smarthr-ui-Dialog-buttonArea"
          >
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
          <div className={messageStyle}>
            <ResponseMessage type={responseMessage.status} role="alert">
              {responseMessage.text}
            </ResponseMessage>
          </div>
        )}
      </Stack>
    </Section>
  )
}
