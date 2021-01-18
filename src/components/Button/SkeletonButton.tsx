import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import { AnchorProps, BaseButton, BaseButtonAnchor, ButtonProps } from './BaseButton'

export const SkeletonButton: FC<ButtonProps> = ({ type = 'button', ...props }) => {
  const theme = useTheme()
  return <SkeletonStyleButton {...props} themes={theme} type={type} />
}

export const SkeletonButtonAnchor: FC<AnchorProps> = (props) => {
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
