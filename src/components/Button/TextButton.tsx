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
    const { color, interaction, border, spacingByChar } = themes

    return css`
      background-color: transparent;
      color: ${color.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${border.lineWidth} ${border.lineStyle} transparent;

      /** border-widthの余白を引いてborderがないBaseButtonと高さを揃える */
      &&& {
        padding-top: calc(${spacingByChar(0.5)} - 1px);
        padding-bottom: calc(${spacingByChar(0.5)} - 1px);
      }

      &&&.s {
        padding-top: calc(${spacingByChar(0.25)} - 2px);
        padding-bottom: calc(${spacingByChar(0.25)} - 2px);
      }

      &.hover,
      &:focus {
        background-color: ${color.hoverColor(color.WHITE)};
        color: ${color.TEXT_BLACK};
      }
    `
  }}
`
const disabledStyle = css`
  ${({ themes: { color } }: { themes: Theme }) => css`
    background-color: transparent;
    color: ${color.disableColor(color.TEXT_DISABLED)};
  `}
`
const TextStyleButton = styled(BaseButton)`
  ${textStyle}
  &[disabled] {
    ${disabledStyle}
  }
`
const TextStyleButtonAnchor = styled(BaseButtonAnchor)`
  ${textStyle}
  &:not([href]) {
    ${disabledStyle}
  }
`
