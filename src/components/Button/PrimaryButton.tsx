import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

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
    const { color } = themes

    return css`
      border-color: ${color.MAIN};
      background-color: ${color.MAIN};
      color: ${color.TEXT_WHITE};

      &:focus-visible,
      &:hover {
        border-color: ${color.hoverColor(color.MAIN)};
        background-color: ${color.hoverColor(color.MAIN)};
        color: ${color.TEXT_WHITE};
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    border-color: ${color.disableColor(color.MAIN)};
    background-color: ${color.disableColor(color.MAIN)};
    color: ${color.disableColor(color.TEXT_WHITE)};
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
