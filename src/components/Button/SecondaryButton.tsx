import * as React from 'react'
import styled, { css } from 'styled-components'

import {
  BaseButton,
  BaseButtonAnchor,
  MargedButtonProps,
  MargedAnchorProps,
  ButtonProps,
  AnchorProps,
} from './BaseButton'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

const injectStyle = (
  component: React.FC<MargedButtonProps> | React.FC<MargedAnchorProps>,
) => styled(component)`
  ${({ theme }: InjectedProps) => {
    const { palette, interaction, frame } = theme

    return css`
      background-color: #fff;
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.default};

      &.hover {
        background-color: ${palette.hoverColor('#fff')};
      }

      &[disabled] {
        background-color: ${palette.disableColor('#fff')};
        color: ${palette.disableColor(palette.TEXT_BLACK)};
      }
    `
  }}
`

export const SecondaryButton: React.FC<ButtonProps> = withTheme(injectStyle(BaseButton))
export const SecondaryButtonAnchor: React.FC<AnchorProps> = withTheme(injectStyle(BaseButtonAnchor))
