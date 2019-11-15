import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { useTheme, Theme } from '../../hooks/useTheme'

import { BaseButton, BaseButtonAnchor, ButtonProps, AnchorProps } from './BaseButton'

export const SkeletonButton: FC<ButtonProps> = props => {
  const theme = useTheme()
  return <SkeletonStyleButton themes={theme} {...props} />
}

export const SkeletonButtonAnchor: FC<AnchorProps> = props => {
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

      &.hover {
        background-color: ${palette.OVERLAY};
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
