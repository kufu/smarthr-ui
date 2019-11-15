import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { SecondaryButton } from '../Button'

export type BaseProps = {
  title: string
  description: React.ReactNode
  closeText: string
}

type Props = BaseProps & {
  onClickClose: () => void
}

const MessageDialogContentInnerComponent: React.FC<Props & InjectedProps> = ({
  title,
  description,
  closeText,
  onClickClose,
  theme,
}) => (
  <Wrapper theme={theme}>
    <Title theme={theme}>{title}</Title>
    <Description theme={theme}>{description}</Description>
    <Bottom>
      <SecondaryButton onClick={onClickClose}>{closeText}</SecondaryButton>
    </Bottom>
  </Wrapper>
)

export const MessageDialogContentInner = withTheme(MessageDialogContentInnerComponent)

const Wrapper = styled.div`
  ${({ theme }: InjectedProps) => {
    const { pxToRem, space } = theme.size
    return css`
      padding: ${pxToRem(space.XS)} ${pxToRem(space.S)};
    `
  }}
`
const Title = styled.p`
  ${({ theme }: InjectedProps) => {
    const { pxToRem, space, font } = theme.size
    return css`
      margin: 0 0 ${pxToRem(space.S)} 0;
      font-size: ${pxToRem(font.GRANDE)};
      line-height: 1;
    `
  }}
`
const Description = styled.div`
  ${({ theme }: InjectedProps) => {
    const { pxToRem, space, font } = theme.size
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
