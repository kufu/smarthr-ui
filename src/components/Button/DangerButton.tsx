import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
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
    const { palette, interaction } = themes

    return css`
      color: #fff;
      border: none;
      background-color: ${palette.DANGER};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.hover {
        background-color: ${palette.hoverColor(palette.DANGER)};
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    background-color: ${color.disableColor(color.DANGER)};
    color: ${color.disableColor('#fff')};
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
