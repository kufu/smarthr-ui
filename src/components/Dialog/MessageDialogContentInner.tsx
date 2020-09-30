import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useOffsetHeight } from './dialogHelper'
import { SecondaryButton } from '../Button'

export type BaseProps = {
  title: string
  description: React.ReactNode
  closeText: string
}

type Props = BaseProps & {
  onClickClose: () => void
}

export const MessageDialogContentInner: FC<Props> = ({
  title,
  description,
  closeText,
  onClickClose,
}) => {
  const theme = useTheme()
  const { offsetHeight, titleRef, bottomRef } = useOffsetHeight()

  return (
    <>
      <Title themes={theme} ref={titleRef} id="dialogTitle">
        {title}
      </Title>
      <Description themes={theme} offsetHeight={offsetHeight} id="dialogDesc">
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
    const { pxToRem, space, font } = themes.size
    return css`
      margin: 0;
      padding: ${pxToRem(space.XS)} ${pxToRem(space.S)} ${pxToRem(space.S)};
      font-size: ${pxToRem(font.GRANDE)};
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
    const { pxToRem, space } = themes.size
    return css`
      display: flex;
      justify-content: flex-end;
      padding: ${pxToRem(space.S)} ${pxToRem(space.S)} ${pxToRem(space.XS)};
    `
  }}
`
