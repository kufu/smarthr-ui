import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { useTheme, Theme } from '../../hooks/useTheme'

import { BaseButton, BaseButtonAnchor, ButtonProps, AnchorProps } from './BaseButton'

export const DangerButton: FC<ButtonProps> = props => {
  const theme = useTheme()
  return <DangerStyleButton themes={theme} {...props} />
}

export const DangerButtonAnchor: FC<AnchorProps> = props => {
  const theme = useTheme()
  return <DangerStyleButtonAnchor themes={theme} {...props} />
}

const dangerStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction } = themes

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
const DangerStyleButton = styled(BaseButton)`
  ${dangerStyle}
`
const DangerStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${dangerStyle}
`
