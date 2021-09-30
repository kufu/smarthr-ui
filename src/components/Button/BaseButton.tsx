import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { hoverable } from '../../hocs/hoverable'

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
    const { border, fontSize, leading, radius, shadow, spacingByChar } = themes

    return css`
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      white-space: nowrap;
      border-radius: ${radius.m};

      /* ボタンの高さを合わせるために指定 */
      border: ${border.lineWidth} ${border.lineStyle} transparent;
      padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      font-family: inherit;
      font-size: ${fontSize.M};
      font-weight: bold;
      line-height: ${leading.NONE};
      ${wide && 'width: 100%;'}

      &.square {
        padding: ${spacingByChar(0.75)};
      }

      &.s {
        padding: ${spacingByChar(0.5)};
        font-size: ${fontSize.S};
      }

      &[disabled] {
        cursor: not-allowed;

        /* alpha color を使用しているので、背景色と干渉させない */
        background-clip: padding-box;
      }

      &:focus {
        ${shadow.focusIndicatorStyles}
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
  text-decoration: none;

  &:not([href]) {
    cursor: not-allowed;

    /* alpha color を使用しているので、背景色と干渉させない */
    background-clip: padding-box;
  }
`
