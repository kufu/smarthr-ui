import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'
import { Button } from '../../Button'
import { Heading, HeadingTagTypes } from '../../Heading'
import { Stack } from '../../Layout'
import { Section } from '../../SectioningContent'
import { Text } from '../../Text'
import { useOffsetHeight } from '../dialogHelper'
import { useClassNames } from '../useClassNames'

import type { DecoratorsType } from '../../../types'

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
   * @deprecated SectioningContent(Article, Aside, Nav, Section, SectioningFragment)でDialog全体をラップして、ダイアログタイトルのHeadingレベルを設定してください
   */
  titleTag?: HeadingTagTypes
  /**
   * ダイアログの説明
   */
  description: React.ReactNode
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'closeButtonLabel'>
}

export type MessageDialogContentInnerProps = BaseProps & {
  onClickClose: () => void
  titleId: string
}

const CLOSE_BUTTON_LABEL = '閉じる'

export const MessageDialogContentInner: FC<MessageDialogContentInnerProps> = ({
  title,
  subtitle,
  titleTag,
  titleId,
  description,
  onClickClose,
  decorators,
}) => {
  const classNames = useClassNames().dialog
  const theme = useTheme()
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  return (
    <Section>
      {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
      <Heading tag={titleTag}>
        <TitleArea themes={theme} ref={titleRef} className={classNames.titleArea}>
          {subtitle && (
            <Text size="S" leading="TIGHT" color="TEXT_GREY" className={classNames.subtitle}>
              {subtitle}
            </Text>
          )}
          <Text id={titleId} size="L" leading="TIGHT" className={classNames.title}>
            {title}
          </Text>
        </TitleArea>
      </Heading>
      <Description themes={theme} offsetHeight={offsetHeight} className={classNames.description}>
        {description}
      </Description>
      <Bottom themes={theme} ref={bottomRef} className={classNames.buttonArea}>
        <Button onClick={onClickClose} className={classNames.closeButton}>
          {decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL}
        </Button>
      </Bottom>
    </Section>
  )
}

const TitleArea = styled(Stack).attrs(() => ({
  gap: 0.25,
  forwardedAs: 'span',
}))<{ themes: Theme }>(
  ({ themes: { border, spacing } }) => css`
    margin-block: unset;
    border-bottom: ${border.shorthand};
    padding: ${spacing.XS} ${spacing.S};
  `,
)
const Description = styled.div<{ themes: Theme; offsetHeight: number }>`
  ${({ themes: { fontSize, spacingByChar }, offsetHeight }) => css`
    max-height: calc(100vh - ${offsetHeight}px);
    overflow: auto;
    padding: 0 ${spacingByChar(1.5)};
    font-size: ${fontSize.M};
    line-height: 1.5;
  `}
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
