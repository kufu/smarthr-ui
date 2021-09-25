import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { hoverable } from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type Tag = 'button' | 'a'

export type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>
export type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

export type BaseProps = {
  /**
   * Size of button.
   * @default 'default'
   */
  size?: 'default' | 's'
  /**
   * The content of the component.
   */
  children?: React.ReactNode
  /**
   * `className` of component.
   */
  className?: string
  /**
   * The content of the prefix of button content.
   * Normally, this is for icon insertion.
   */
  prefix?: React.ReactNode
  /**
   * The content of the suffix of button content.
   * Normally, this is for icon insertion.
   */
  suffix?: React.ReactNode
  /**
   * If `true`, the component shape changes to square.
   * @default false
   */
  square?: boolean
  /**
   * If `true`, the component shape changes width is 100%
   */
  wide?: boolean
}

export const buttonFactory = <Props extends BaseProps>(tag: Tag) => {
  const BaseTag = hoverable()(tagStore[tag])

  const Button: VFC<Props> = ({
    size = 'default',
    className = '',
    square = false,
    children = '',
    prefix = '',
    suffix = '',
    ...props
  }) => {
    const theme = useTheme()

    // prettier-ignore
    const classNames = `${size} ${className} ${square ? 'square' : ''} ${prefix ? 'prefix' : ''} ${suffix ? 'suffix' : ''}`

    return (
      <BaseTag className={classNames} themes={theme} {...props}>
        {prefix && <Prefix themes={theme}>{prefix}</Prefix>}
        {children}
        {suffix && <Suffix themes={theme}>{suffix}</Suffix>}
      </BaseTag>
    )
  }
  return Button
}

const Base: any = styled.div<{ themes: Theme; wide: boolean }>`
  ${({ themes, wide }) => {
    const { radius, fontSize, leading, spacingByChar, interaction, shadow } = themes

    return css`
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: ${wide ? '100%;' : 'auto'};
      vertical-align: middle;
      border-radius: ${radius.m};
      font-family: inherit;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      box-sizing: border-box;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      white-space: nowrap;

      /* ボタンの高さを合わせるために指定 */
      border: 1px solid transparent;
      line-height: ${leading.NONE};

      &.default {
        font-size: ${fontSize.M};
        padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      }

      &.square {
        padding: ${spacingByChar(0.75)};
      }

      &.s {
        font-size: ${fontSize.S};
        padding: ${spacingByChar(0.5)};
      }

      &[disabled] {
        cursor: not-allowed;

        /* alpha color を使用しているので、背景色と干渉させない */
        background-clip: padding-box;
      }

      &.suffix {
        justify-content: space-between;
      }

      &.prefix {
        justify-content: left;
      }

      &:hover,
      &:focus {
        text-decoration: none;
      }

      &:focus {
        outline: 0;
        box-shadow: ${shadow.OUTLINE};
      }
    `
  }}
`
const Prefix = styled.span<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: inline-flex;
      margin-right: ${spacingByChar(0.5)};
    `
  }}
`
const Suffix = styled.span<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: inline-flex;
      margin-left: ${spacingByChar(0.5)};
    `
  }}
`
const tagStore = {
  button: Base.withComponent('button'),
  a: Base.withComponent('a'),
}

export const BaseButton: VFC<ButtonProps> = buttonFactory<ButtonProps>('button')

const AnchorButton: VFC<AnchorProps> = buttonFactory<AnchorProps>('a')
export const BaseButtonAnchor = styled(AnchorButton)`
  &:not([href]) {
    cursor: not-allowed;
  }
`
