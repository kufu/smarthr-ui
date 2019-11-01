import * as React from 'react'
import styled, { css } from 'styled-components'

import { BaseButton, BaseButtonAnchor, ButtonProps, AnchorProps } from './BaseButton'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

const injectStyle = <T extends {}>(component: React.FC<T & InjectedProps>) => styled(component)`
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

export const DangerButton = withTheme(injectStyle<ButtonProps>(BaseButton))
export const DangerButtonAnchor = withTheme(injectStyle<AnchorProps>(BaseButtonAnchor))
