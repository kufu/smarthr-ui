import * as React from 'react'
import styled, { css } from 'styled-components'

import {
  BaseButton,
  BaseButtonAnchor,
  ButtonProps as BaseButtonProps,
  AnchorProps as BaseAnchorProps,
} from './BaseButton'

type ButtonProps = Omit<BaseButtonProps, 'square'>
type AnchorProps = Omit<BaseAnchorProps, 'square'>

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

const injectStyle = <T extends {}>(component: React.FC<T & InjectedProps>) => styled(component)`
  ${({ theme }: InjectedProps) => {
    const { palette, interaction, frame } = theme

    return css`
      background-color: transparent;
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.lineWidth} ${frame.border.lineStyle} #fff;

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

export const TextButton = withTheme(injectStyle<ButtonProps>(BaseButton))
export const TextButtonAnchor = withTheme(injectStyle<AnchorProps>(BaseButtonAnchor))
