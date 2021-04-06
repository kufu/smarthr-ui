import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { isTouchDevice } from '../../libs/ua'
import { Theme, useTheme } from '../../hooks/useTheme'

import {
  AnchorProps as BaseAnchorProps,
  BaseButton,
  BaseButtonAnchor,
  ButtonProps as BaseButtonProps,
} from './BaseButton'
import { useClassNames } from './useClassNames'

type ButtonProps = Omit<BaseButtonProps, 'square'>
type AnchorProps = Omit<BaseAnchorProps, 'square'>

export const TextButton: VFC<ButtonProps> = ({ type = 'button', className = '', ...props }) => {
  const theme = useTheme()
  const { textButton } = useClassNames()

  return (
    <TextStyleButton
      {...props}
      themes={theme}
      type={type}
      className={`${className} ${textButton.wrapper}`}
    />
  )
}

export const TextButtonAnchor: VFC<AnchorProps> = ({ className = '', ...props }) => {
  const theme = useTheme()
  const { textButtonAnchor } = useClassNames()

  return (
    <TextStyleButtonAnchor
      themes={theme}
      className={`${className} ${textButtonAnchor.wrapper}`}
      {...props}
    />
  )
}

const textStyle = css`
  ${({ themes }: { themes: Theme }) => {
    const { palette, interaction, frame } = themes

    return css`
      background-color: transparent;
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.lineWidth} ${frame.border.lineStyle} transparent;

      &.hover,
      &:focus {
        background-color: ${palette.hoverColor('#fff')};
        color: ${palette.TEXT_BLACK};
      }

      &[disabled] {
        background-color: transparent;
        color: ${palette.disableColor(palette.TEXT_DISABLED)};
      }
    `
  }}
`
const TextStyleButton = styled(BaseButton)`
  ${textStyle}
`
const TextStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${textStyle}
`
