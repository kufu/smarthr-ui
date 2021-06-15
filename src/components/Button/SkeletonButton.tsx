import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'
import { useClassNames } from './useClassNames'

export const SkeletonButton: VFC<ButtonProps> = ({ type = 'button', className = '', ...props }) => {
  const theme = useTheme()
  const { skeletonButton } = useClassNames()

  return (
    <SkeletonStyleButton
      {...props}
      themes={theme}
      type={type}
      className={`${className} ${skeletonButton.wrapper}`}
    />
  )
}

export const SkeletonButtonAnchor: VFC<AnchorProps> = ({ className = '', ...props }) => {
  const theme = useTheme()
  const { skeletonButtonAnchor } = useClassNames()

  return (
    <SkeletonStyleButtonAnchor
      themes={theme}
      className={`${className} ${skeletonButtonAnchor.wrapper}`}
      {...props}
    />
  )
}

const skeletonStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction, frame } = themes

    return css`
      background-color: transparent;
      color: #fff;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.lineWidth} ${frame.border.lineStyle} #fff;

      &.hover,
      &:focus {
        background-color: ${palette.OVERLAY};
        color: #fff;
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    background-color: transparent;
    color: ${color.disableColor('#fff')};
  `}
`
const SkeletonStyleButton = styled(BaseButton)`
  ${skeletonStyle}
  &[disabled] {
    ${disabledStyle}
  }
`
const SkeletonStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${skeletonStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`
