import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

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
  const theme = useTheme()
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  return (
    <>
      <Title themes={theme} ref={titleRef}>
        {title}
      </Title>
      <Description themes={theme} offsetHeight={offsetHeight}>
        {description}
      </Description>
      <Bottom themes={theme} ref={bottomRef}>
        <SecondaryButton onClick={onClickClose}>{closeText}</SecondaryButton>
      </Bottom>
    </>
  )
}

const Title = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame } = themes
    return css`
      margin: 0;
      padding: ${size.pxToRem(size.space.XS)} ${size.pxToRem(size.space.S)};
      border-bottom: ${frame.border.default};
      font-size: ${size.pxToRem(size.font.GRANDE)};
      line-height: 1;
    `
  }}
`
const Description = styled.div<{ themes: Theme; offsetHeight: number }>`
  ${({ themes, offsetHeight }) => {
    const { pxToRem, space, font } = themes.size
    return css`
      max-height: calc(100vh - ${offsetHeight}px);
      overflow: auto;
      padding: 0 ${pxToRem(space.S)};
      font-size: ${pxToRem(font.TALL)};
      line-height: 1.5;
    `
  }}
`
const Bottom = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame } = themes
    return css`
      display: flex;
      justify-content: flex-end;
      padding: ${size.pxToRem(size.space.XS)} ${size.pxToRem(size.space.S)};
      border-top: ${frame.border.default};
    `
  }}
`
