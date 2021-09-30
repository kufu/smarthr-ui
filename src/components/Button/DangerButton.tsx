import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'
import { useClassNames } from './useClassNames'

export const DangerButton: VFC<ButtonProps> = ({ type = 'button', className = '', ...props }) => {
  const theme = useTheme()
  const { dangerButton } = useClassNames()

  return (
    <DangerStyleButton
      {...props}
      themes={theme}
      type={type}
      className={`${className} ${dangerButton.wrapper}`}
    />
  )
}

export const DangerButtonAnchor: VFC<AnchorProps> = ({ className = '', ...props }) => {
  const theme = useTheme()
  const { dangerButtonAnchor } = useClassNames()

  return (
    <DangerStyleButtonAnchor
      themes={theme}
      className={`${className} ${dangerButtonAnchor.wrapper}`}
      {...props}
    />
  )
}

const dangerStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { color } = themes

    return css`
      border-color: ${color.DANGER};
      background-color: ${color.DANGER};
      color: ${color.TEXT_WHITE};

      &:focus,
      &:hover {
        border-color: ${color.hoverColor(color.DANGER)};
        background-color: ${color.hoverColor(color.DANGER)};
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    border-color: ${color.disableColor(color.DANGER)};
    background-color: ${color.disableColor(color.DANGER)};
    color: ${color.disableColor(color.TEXT_WHITE)};
  `}
`
const DangerStyleButton = styled(BaseButton)`
  ${dangerStyle}
  &[disabled] {
    ${disabledStyle}
  }
`
const DangerStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${dangerStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`
