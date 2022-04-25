import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

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
    const { color } = themes

    return css`
      border-color: ${color.WHITE};
      background-color: transparent;
      color: ${color.TEXT_WHITE};

      &:focus-visible,
      &:hover {
        border-color: ${color.hoverColor(color.WHITE)};
        background-color: ${color.OVERLAY};
        color: ${color.hoverColor(color.TEXT_WHITE)};
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    border-color: ${color.disableColor(color.WHITE)};
    background-color: transparent;
    color: ${color.disableColor(color.TEXT_WHITE)};
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
