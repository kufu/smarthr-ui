import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { useOffsetHeight } from './dialogHelper'
import { SecondaryButton } from '../Button'

export type BaseProps = {
  /**
   * Title of the dialog.
   */
  title: string
  /**
   * Description of the dialog.
   */
  description: React.ReactNode
  /**
   * Label of close button.
   */
  closeText: string
}

export type MessageDialogContentInnerProps = BaseProps & {
  /**
   * Handler function when clicking on close button.
   */
  onClickClose: () => void
}

export const MessageDialogContentInner: VFC<MessageDialogContentInnerProps> = ({
  title,
  description,
  closeText,
  onClickClose,
}) => {
  const classNames = useClassNames()
  const theme = useTheme()
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  return (
    <>
      <Title themes={theme} ref={titleRef} className={classNames.title}>
        {title}
      </Title>
      <Description themes={theme} offsetHeight={offsetHeight} className={classNames.description}>
        {description}
      </Description>
      <Bottom themes={theme} ref={bottomRef} className={classNames.buttonArea}>
        <SecondaryButton onClick={onClickClose} className={classNames.secondaryButton}>
          {closeText}
        </SecondaryButton>
      </Bottom>
    </>
  )
}

const Title = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacingByChar, frame } = themes
    return css`
      margin: 0;
      padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
      border-bottom: ${frame.border.default};
      font-size: ${fontSize.L};
      line-height: 1;
    `
  }}
`
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
    const { spacingByChar, frame } = themes
    return css`
      display: flex;
      justify-content: flex-end;
      padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
      border-top: ${frame.border.default};
    `
  }}
`
