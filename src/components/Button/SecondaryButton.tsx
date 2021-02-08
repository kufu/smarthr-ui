import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'

export const SecondaryButton: FC<ButtonProps> = ({ type = 'button', ...props }) => {
  const theme = useTheme()
  return <SecondaryStyleButton {...props} themes={theme} type={type} />
}
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButton.displayName = 'SecondaryButton'

export const SecondaryButtonAnchor: FC<AnchorProps> = (props) => {
  const theme = useTheme()
  return <SecondaryStyleButtonAnchor themes={theme} {...props} />
}
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButtonAnchor.displayName = 'SecondaryButtonAnchor'

const secondaryStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction, frame } = themes

    return css`
      background-color: #fff;
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.default};

      &.hover,
      &:focus {
        background-color: ${palette.hoverColor('#fff')};
        color: ${palette.TEXT_BLACK};
      }

      &[disabled] {
        background-color: ${palette.COLUMN};
        color: ${palette.TEXT_DISABLED};
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
