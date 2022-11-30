import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'
import { HeadingTagTypes } from '../Heading'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { useOffsetHeight } from './dialogHelper'
import { useClassNames } from './useClassNames'

export type BaseProps = {
  /**
   * ダイアログのタイトル
   */
  title: React.ReactNode
  /**
   * ダイアログのサブタイトル
   */
  subtitle?: React.ReactNode
  /**
   * ダイアログタイトルの HTML タグ
   */
  titleTag?: HeadingTagTypes
  /**
   * ダイアログの説明
   */
  description: React.ReactNode
  /**
   * 閉じるボタンのラベル
   */
  closeText?: React.ReactNode
}

export type MessageDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  titleId: string
}

export const MessageDialogContentInner: VFC<MessageDialogContentInnerProps> = ({
  title,
  subtitle,
  titleTag = 'h2',
  titleId,
  description,
  closeText = '閉じる',
  onClickClose,
}) => {
  const classNames = useClassNames().dialog
  const theme = useTheme()
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

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
      <Description themes={theme} offsetHeight={offsetHeight} className={classNames.description}>
        {description}
      </Description>
      <Bottom themes={theme} ref={bottomRef} className={classNames.buttonArea}>
        <Button onClick={onClickClose} className={classNames.closeButton}>
          {closeText}
        </Button>
      </Bottom>
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
const Description = styled.div<{ themes: Theme; offsetHeight: number }>`
  ${({ themes: { fontSize, spacingByChar }, offsetHeight }) => {
    return css`
      max-height: calc(100vh - ${offsetHeight}px);
      overflow: auto;
      padding: 0 ${spacingByChar(1.5)};
      font-size: ${fontSize.M};
      line-height: 1.5;
    `
  }}
`
const Bottom = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { spacingByChar, border } = themes
    return css`
      display: flex;
      justify-content: flex-end;
      padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
      border-top: ${border.shorthand};
    `
  }}
`
