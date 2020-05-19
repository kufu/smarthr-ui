import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'

export const PrimaryButton: FC<ButtonProps> = (props) => {
  const theme = useTheme()
  return <PrimaryStyleButton themes={theme} {...props} />
}

// set the displayName explicit.
// This is for error message of BottomFixedArea component.
PrimaryButton.displayName = 'PrimaryButton'

export const PrimaryButtonAnchor: FC<AnchorProps> = (props) => {
  const theme = useTheme()
  return <PrimaryStyleButtonAnchor themes={theme} {...props} />
}

// set the displayName explicit.
// This is for error message of BottomFixedArea component.
PrimaryButtonAnchor.displayName = 'PrimaryButtonAnchor'

const primaryStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction } = themes

    return css`
      color: #fff;
      border: none;
      background-color: ${palette.MAIN};
      color: #fff;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.hover {
        background-color: ${palette.hoverColor(palette.MAIN)};
      }

      &[disabled] {
        background-color: ${palette.disableColor(palette.MAIN)};
        color: ${palette.disableColor('#fff')};
      }
    `
  }}
`
const PrimaryStyleButton = styled(BaseButton)`
  ${primaryStyle}
`
const PrimaryStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${primaryStyle}
`
