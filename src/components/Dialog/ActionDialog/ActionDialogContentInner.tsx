import React, { FC, PropsWithChildren, ReactNode, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Button } from '../../Button'
import { Heading, HeadingTagTypes } from '../../Heading'
import { Cluster, Stack } from '../../Layout'
import { ResponseMessage } from '../../ResponseMessage'
import { Section } from '../../SectioningContent'
import { Text } from '../../Text'
import { useOffsetHeight } from '../dialogHelper'
import { useClassNames } from '../useClassNames'

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
  /**
   * コンポーネントに適用するクラス名
   */
  className?: string
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'closeButtonLabel'>
}>

export type ActionDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: ResponseMessageType
  titleId: string
}

const CLOSE_BUTTON_LABEL = 'キャンセル'

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
  decorators,
}) => {
  const classNames = useClassNames().dialog
  const theme = useTheme()
  const handleClickAction = useCallback(() => {
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose])
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  return (
    <Section>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading tag={titleTag}>
        <TitleAreaStack $themes={theme} ref={titleRef} className={classNames.titleArea}>
          {subtitle && (
            <Text size="S" leading="TIGHT" color="TEXT_GREY" className={classNames.subtitle}>
              {subtitle}
            </Text>
          )}
          <Text id={titleId} size="L" leading="TIGHT" className={classNames.title}>
            {title}
          </Text>
        </TitleAreaStack>
      </Heading>
      <Body offsetHeight={offsetHeight} className={classNames.body}>
        {children}
      </Body>
      <ActionAreaStack $themes={theme} ref={bottomRef} className={classNames.actionArea}>
        <ButtonArea className={classNames.buttonArea}>
          <Button
            onClick={onClickClose}
            disabled={closeDisabled || isRequestProcessing}
            className={classNames.closeButton}
          >
            {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
          </Button>
          <Button
            variant={actionTheme}
            onClick={handleClickAction}
            disabled={actionDisabled}
            loading={isRequestProcessing}
            className={classNames.actionButton}
          >
            {actionText}
          </Button>
        </ButtonArea>
        {(responseMessage?.status === 'success' || responseMessage?.status === 'error') && (
          <Message>
            <ResponseMessage type={responseMessage.status} role="alert">
              {responseMessage.text}
            </ResponseMessage>
          </Message>
        )}
      </ActionAreaStack>
    </Section>
  )
}

const TitleAreaStack = styled(Stack).attrs(() => ({
  gap: 0.25,
  forwardedAs: 'span',
}))<{ $themes: Theme }>`
  ${({ $themes: { border, space } }) => css`
    margin-block: unset;
    border-bottom: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`
const Body = styled.div<{ offsetHeight: number }>`
  ${({ offsetHeight }) => css`
    max-height: calc(100vh - ${offsetHeight}px);
    overflow: auto;
  `}
`
const ActionAreaStack = styled(Stack).attrs({ gap: 0.5 })<{ $themes: Theme }>`
  ${({ $themes: { space, border } }) => css`
    border-top: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`
const ButtonArea = styled(Cluster).attrs({ gap: { row: 0.5, column: 1 }, justify: 'flex-end' })``
const Message = styled.div`
  text-align: right;
`
