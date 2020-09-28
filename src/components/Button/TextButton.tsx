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

export const TextButton: FC<ButtonProps> = (props) => {
  const theme = useTheme()
  return <TextStyleButton themes={theme} {...props} />
}

export const TextButtonAnchor: FC<AnchorProps> = (props) => {
  const theme = useTheme()
  return <TextStyleButtonAnchor role="button" themes={theme} {...props} />
}

const textStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction, frame } = themes

    return css`
      background-color: transparent;
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.lineWidth} ${frame.border.lineStyle} transparent;

      &.hover {
        background-color: ${palette.hoverColor('#fff')};
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
