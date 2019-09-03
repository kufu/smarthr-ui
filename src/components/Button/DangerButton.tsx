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
    const { palette, interaction } = theme

    return css`
      color: #fff;
      border: none;
      background-color: ${palette.DANGER};
      color: #fff;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.hover {
        background-color: ${palette.hoverColor(palette.DANGER)};
      }

      &[disabled] {
        background-color: ${palette.disableColor(palette.DANGER)};
        color: ${palette.disableColor('#fff')};
      }
    `
  }}
`

export const DangerButton: React.FC<ButtonProps> = withTheme(injectStyle(BaseButton))
export const DangerButtonAnchor: React.FC<AnchorProps> = withTheme(injectStyle(BaseButtonAnchor))
