import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import {
  AnchorProps as BaseAnchorProps,
  BaseButton,
  BaseButtonAnchor,
  ButtonProps as BaseButtonProps,
} from './BaseButton'

type ButtonProps = Omit<BaseButtonProps, 'square'>
type AnchorProps = Omit<BaseAnchorProps, 'square'>

export const TextButton: FC<ButtonProps> = ({ type = 'button', ...props }) => {
  const theme = useTheme()
  return <TextStyleButton {...props} themes={theme} type={type} />
}

export const TextButtonAnchor: FC<AnchorProps> = (props) => {
  const theme = useTheme()
  return <TextStyleButtonAnchor themes={theme} {...props} />
}

const textStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction, frame } = themes

    return css`
      background-color: transparent;
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.lineWidth} ${frame.border.lineStyle} transparent;

      &.hover,
      &:focus {
        background-color: ${palette.hoverColor('#fff')};
        color: ${palette.TEXT_BLACK};
      }

      &[disabled] {
        background-color: transparent;
        color: ${palette.disableColor(palette.TEXT_DISABLED)};
      }
    `
  }}
`
const TextStyleButton = styled(BaseButton)`
  ${textStyle}
`
const TextStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${textStyle}
`
