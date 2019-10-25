import * as React from 'react'
import styled, { css } from 'styled-components'

import { BaseButton, BaseButtonAnchor, ButtonProps, AnchorProps } from './BaseButton'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

const injectStyle = <T extends {}>(component: React.FC<T & InjectedProps>) => styled(component)`
  ${({ theme }: InjectedProps) => {
    const { palette, interaction, frame } = theme

    return css`
      background-color: transparent;
      color: #fff;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.lineWidth} ${frame.border.lineStyle} #fff;

      &:hover,
      &:active {
        background-color: ${palette.OVERLAY};
      }

      &[disabled] {
        background-color: transparent;
        color: ${palette.disableColor('#fff')};
      }
    `
  }}
`

export const SkeletonButton = withTheme(injectStyle<ButtonProps>(BaseButton))
export const SkeletonButtonAnchor = withTheme(injectStyle<AnchorProps>(BaseButtonAnchor))
