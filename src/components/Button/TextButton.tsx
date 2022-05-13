import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

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

/**
 * @deprecated `TextButton` コンポーネントは非推奨です。代わりに `Button` コンポーネントと `variant` プロパティを使用してください。
 */
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

/**
 * @deprecated `TextButtonAnchor` コンポーネントは非推奨です。代わりに `AnchorButton` コンポーネントと `variant` プロパティを使用してください。
 */
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
    const { color } = themes

    return css`
      background-color: transparent;
      color: ${color.TEXT_BLACK};

      &:focus-visible,
      &:hover {
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
