import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

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

  return (
    <Wrapper themes={theme}>
      <Title themes={theme}>{title}</Title>
      <Description themes={theme}>{description}</Description>
      <Bottom>
        <SecondaryButton onClick={onClickClose}>{closeText}</SecondaryButton>
      </Bottom>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      padding: ${pxToRem(space.XS)} ${pxToRem(space.S)};
    `
  }}
`
const Title = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space, font } = themes.size
    return css`
      margin: 0 0 ${pxToRem(space.S)} 0;
      font-size: ${pxToRem(font.GRANDE)};
      line-height: 1;
    `
  }}
`
const Description = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space, font } = themes.size
    return css`
      margin: 0 0 ${pxToRem(space.S)} 0;
      font-size: ${pxToRem(font.TALL)};
      line-height: 1.5;
    `
  }}
`
const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
`
