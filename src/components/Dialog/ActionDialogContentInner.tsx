import React, { ReactNode, VFC, useCallback } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'
import { HeadingTagTypes } from '../Heading'
import { FaCheckCircleIcon, FaExclamationCircleIcon } from '../Icon'
import { Stack } from '../Layout'
import { Loader } from '../Loader'
import { Text } from '../Text'

import { useOffsetHeight } from './dialogHelper'
import { useClassNames } from './useClassNames'

export type BaseProps = {
  /**
   * ダイアログの内容
   */
  children: ReactNode
  /**
   * ダイアログのタイトル
   */
  title: ReactNode
  /**
   * ダイアログのサブタイトル
   */
  subtitle?: ReactNode
  /**
   * ダイアログタイトルの HTML タグ
   */
  titleTag?: HeadingTagTypes
  /**
   * 閉じるボタンのラベル
   */
  closeText?: ReactNode
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
}

type responseMessageType = {
  status: 'success' | 'error' | 'processing'
  text: string
}

export type ActionDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  responseMessage?: responseMessageType
  titleId: string
}

export const ActionDialogContentInner: VFC<ActionDialogContentInnerProps> = ({
  children,
  title,
  titleId,
  subtitle,
  titleTag = 'h2',
  closeText = 'キャンセル',
  actionText,
  actionTheme = 'primary',
  onClickAction,
  onClickClose,
  responseMessage,
  actionDisabled = false,
  closeDisabled,
}) => {
  const classNames = useClassNames().dialog
  const theme = useTheme()
  const handleClickAction = useCallback(() => {
    onClickAction(onClickClose)
  }, [onClickAction, onClickClose])
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  const isRequestProcessing = responseMessage && responseMessage.status === 'processing'

  return (
    <>
      <TitleArea
        gap={0.25}
        themes={theme}
        ref={titleRef}
        className={classNames.titleArea}
        as={titleTag}
      >
        {subtitle && (
          <Text size="S" leading="TIGHT" color="TEXT_GREY" className={classNames.subtitle}>
            {subtitle}
          </Text>
        )}
        <Text id={titleId} size="L" leading="TIGHT" className={classNames.title}>
          {title}
        </Text>
      </TitleArea>
      <Body offsetHeight={offsetHeight} className={classNames.body}>
        {children}
      </Body>
      <ActionArea themes={theme} ref={bottomRef} className={classNames.actionArea}>
        <ButtonArea themes={theme} className={classNames.buttonArea}>
          <Button
            onClick={onClickClose}
            disabled={closeDisabled || isRequestProcessing}
            className={classNames.closeButton}
          >
            {closeText}
          </Button>
          <Button
            variant={actionTheme}
            onClick={handleClickAction}
            disabled={actionDisabled || isRequestProcessing}
            className={classNames.actionButton}
          >
            {actionText}
          </Button>
        </ButtonArea>
        {responseMessage && (
          <MessageWrapper role="alert" className={classNames.alert} themes={theme}>
            {responseMessage.status === 'success' ? (
              <FaCheckCircleIcon color={theme.color.MAIN} />
            ) : responseMessage.status === 'error' ? (
              <FaExclamationCircleIcon color={theme.color.DANGER} />
            ) : (
              <Spinner size="s" themes={theme} />
            )}
            <Message themes={theme}>{responseMessage.text}</Message>
          </MessageWrapper>
        )}
      </ActionArea>
    </>
  )
}

const TitleArea = styled(Stack)<{ themes: Theme; as: HeadingTagTypes }>(
  ({ themes: { border, spacing } }) => css`
    margin-block: unset;
    border-bottom: ${border.shorthand};
    padding: ${spacing.XS} ${spacing.S};
  `,
)
const Body = styled.div<{ offsetHeight: number }>`
  ${({ offsetHeight }) => {
    return css`
      max-height: calc(100vh - ${offsetHeight}px);
      overflow: auto;
    `
  }}
`
const ActionArea = styled.div<{ themes: Theme }>(({ themes: { spacing, border } }) => {
  return css`
    display: flex;
    flex-direction: column;
    border-top: ${border.shorthand};
    padding: ${spacing.XS} ${spacing.S};

    &&& > * + * {
      margin-top: 0.5rem;
    }
  `
})
const ButtonArea = styled.div<{ themes: Theme }>(({ themes: { spacing } }) => {
  return css`
    display: flex;
    justify-content: flex-end;

    > * + * {
      margin-left: ${spacing.XS};
    }
  `
})
const MessageWrapper = styled.div<{ themes: Theme }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0;
  margin-bottom: 0;
  font-size: ${({ themes }) => themes.fontSize.M};
`
const Spinner = styled(Loader)<{ themes: Theme }>`
  &&& {
    > div {
      width: 18px;
      height: 18px;
    }

    > div > div {
      border-color: ${({ themes }) => themes.color.TEXT_GREY};
    }
  }
`
const Message = styled.span<{ themes: Theme }>`
  margin-left: ${({ themes }) => themes.spacingByChar(0.25)};
`
