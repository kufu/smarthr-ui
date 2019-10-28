import React, { useContext } from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { SecondaryButton } from '../Button'
import { DialogContext } from './Dialog'
import { DialogContentInner } from './DialogContentInner'

type Props = {
  title: string
  description: React.ReactNode
  closeText: string
  top?: number
  right?: number
  bottom?: number
  left?: number
}

const MessageDialogContentComponent: React.FC<Props & InjectedProps> = ({
  title,
  description,
  closeText,
  theme,
  ...props
}) => {
  const { DialogContentRoot, onClickClose } = useContext(DialogContext)

  return (
    <DialogContentRoot>
      <DialogContentInner onClickBackground={onClickClose} {...props}>
        <Wrapper theme={theme}>
          <Title theme={theme}>{title}</Title>
          <Description theme={theme}>{description}</Description>
          <Bottom>
            <SecondaryButton onClick={onClickClose}>{closeText}</SecondaryButton>
          </Bottom>
        </Wrapper>
      </DialogContentInner>
    </DialogContentRoot>
  )
}

export const MessageDialogContent = withTheme(MessageDialogContentComponent)

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
