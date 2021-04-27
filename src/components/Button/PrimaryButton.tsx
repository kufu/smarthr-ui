import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'
import { useClassNames } from './useClassNames'

export const PrimaryButton: VFC<ButtonProps> = ({ type = 'button', className = '', ...props }) => {
  const theme = useTheme()
  const { primaryButton } = useClassNames()

  return (
    <PrimaryStyleButton
      {...props}
      themes={theme}
      type={type}
      className={`${className} ${primaryButton.wrapper}`}
    />
  )
}

// set the displayName explicit.
// This is for error message of BottomFixedArea component.
PrimaryButton.displayName = 'PrimaryButton'

export const PrimaryButtonAnchor: VFC<AnchorProps> = ({ className = '', ...props }) => {
  const theme = useTheme()
  const { primaryButtonAnchor } = useClassNames()

  return (
    <PrimaryStyleButtonAnchor
      themes={theme}
      className={`${className} ${primaryButtonAnchor.wrapper}`}
      {...props}
    />
  )
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
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.hover,
      &:focus {
        background-color: ${palette.hoverColor(palette.MAIN)};
        color: #fff;
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    background-color: ${color.disableColor(color.MAIN)};
    color: ${color.disableColor('#fff')};
  `}
`
const PrimaryStyleButton = styled(BaseButton)`
  ${primaryStyle}
  &[disabled] {
    ${disabledStyle}
  }
`
const PrimaryStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${primaryStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`
