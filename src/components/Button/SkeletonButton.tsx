import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'

export const SkeletonButton: VFC<ButtonProps> = ({ type = 'button', ...props }) => {
  const theme = useTheme()
  return <SkeletonStyleButton {...props} themes={theme} type={type} />
}

export const SkeletonButtonAnchor: VFC<AnchorProps> = (props) => {
  const theme = useTheme()
  return <SkeletonStyleButtonAnchor themes={theme} {...props} />
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

      &[disabled] {
        background-color: transparent;
        color: ${palette.disableColor('#fff')};
      }
    `
  }}
`
const SkeletonStyleButton = styled(BaseButton)`
  ${skeletonStyle}
`
const SkeletonStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${skeletonStyle}
`
