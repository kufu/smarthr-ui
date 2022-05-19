import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { useOffsetHeight } from './dialogHelper'
import { Stack } from '../Layout'
import { SecondaryButton } from '../Button'
import { Text } from '../Text'

export type BaseProps = {
  /**
   * Title of the dialog.
   */
  title: React.ReactNode
  subtitle?: React.ReactNode
  titleId: string
  /**
   * Description of the dialog.
   */
  description: React.ReactNode
  /**
   * Label of close button.
   */
  closeText?: React.ReactNode
}

export type MessageDialogContentInnerProps = BaseProps & {
  /**
   * Handler function when clicking on close button.
   */
  onClickClose: () => void
}

export const MessageDialogContentInner: VFC<MessageDialogContentInnerProps> = ({
  title,
  subtitle,
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
      <TitleArea gap={0.25} themes={theme} ref={titleRef} className={classNames.titleArea}>
        {subtitle && (
          <Text as="p" size="S" leading="TIGHT" color="TEXT_GREY" className={classNames.subtitle}>
            {subtitle}
          </Text>
        )}
        <Text as="p" id={titleId} size="L" leading="TIGHT" className={classNames.title}>
          {title}
        </Text>
      </TitleArea>
      <Description themes={theme} offsetHeight={offsetHeight} className={classNames.description}>
        {description}
      </Description>
      <Bottom themes={theme} ref={bottomRef} className={classNames.buttonArea}>
        <SecondaryButton onClick={onClickClose} className={classNames.closeButton}>
          {closeText}
        </SecondaryButton>
      </Bottom>
    </>
  )
}

const TitleArea = styled(Stack)<{ themes: Theme }>(
  ({ themes: { border, spacing } }) => css`
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
