import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { useTheme, Theme } from '../../hooks/useTheme'

import { BaseButton, BaseButtonAnchor, ButtonProps, AnchorProps } from './BaseButton'

export const SecondaryButton: FC<ButtonProps> = props => {
  const theme = useTheme()
  return <SecondaryStyleButton themes={theme} {...props} />
}

export const SecondaryButtonAnchor: FC<AnchorProps> = props => {
  const theme = useTheme()
  return <SecondaryStyleButtonAnchor themes={theme} {...props} />
}

const secondaryStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction, frame } = themes

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
const SecondaryStyleButton = styled(BaseButton)`
  ${secondaryStyle}
`
const SecondaryStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${secondaryStyle}
`
