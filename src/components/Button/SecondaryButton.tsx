import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'
import { useClassNames } from './useClassNames'

export const SecondaryButton: VFC<ButtonProps> = ({
  type = 'button',
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const { secondaryButton } = useClassNames()

  return (
    <SecondaryStyleButton
      {...props}
      themes={theme}
      type={type}
      className={`${className} ${secondaryButton.wrapper}`}
    />
  )
}
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButton.displayName = 'SecondaryButton'

export const SecondaryButtonAnchor: VFC<AnchorProps> = ({ className = '', ...props }) => {
  const theme = useTheme()
  const { secondaryButtonAnchor } = useClassNames()

  return (
    <SecondaryStyleButtonAnchor
      themes={theme}
      className={`${className} ${secondaryButtonAnchor.wrapper}`}
      {...props}
    />
  )
}
// set the displayName explicit.
// This is for error message of BottomFixedArea component.
SecondaryButtonAnchor.displayName = 'SecondaryButtonAnchor'

const secondaryStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { color, interaction } = themes

    return css`
      border-color: ${color.BORDER};
      background-color: ${color.WHITE};
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &:focus,
      &:hover {
        border-color: ${color.hoverColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    border-color: ${color.disableColor(color.BORDER)};
    background-color: ${color.disableColor(color.WHITE)};
    color: ${color.TEXT_DISABLED};
  `}
`
const SecondaryStyleButton = styled(BaseButton)`
  ${secondaryStyle}
  &[disabled] {
    ${disabledStyle}
  }
`
const SecondaryStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${secondaryStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`
