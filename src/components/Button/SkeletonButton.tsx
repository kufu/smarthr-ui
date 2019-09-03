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
      background-color: transparent;
      color: #fff;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.lineWidth} ${frame.border.lineStyle} #fff;

      &.hover {
        background-color: ${palette.OVERLAY};
      }

      &[disabled] {
        background-color: transparent;
        color: ${palette.disableColor('#fff')};
      }
    `
  }}
`

export const SkeletonButton: React.FC<ButtonProps> = withTheme(injectStyle(BaseButton))
export const SkeletonButtonAnchor: React.FC<AnchorProps> = withTheme(injectStyle(BaseButtonAnchor))
