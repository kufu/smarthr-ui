import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { hoverable } from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type Tag = 'button' | 'a'
type Size = 'default' | 's'

export type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>
export type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>

export type BaseProps = {
  /**
   * Size of button.
   * @default 'default'
   */
  size?: Size
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
  /**
   * If `true`, the button becomes disabled.
   */
  disabled?: boolean
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
    const { frame, size, interaction, shadow } = themes

    return css`
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: ${wide ? '100%;' : 'auto'};
      min-width: 2rem;
      vertical-align: middle;
      border-radius: ${frame.border.radius.m};
      font-family: inherit;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      box-sizing: border-box;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      white-space: nowrap;

      &.default {
        font-size: ${size.pxToRem(size.font.TALL)};
        height: 40px;
        padding: 0 ${size.pxToRem(size.space.XS)};
      }

      &.s {
        font-size: ${size.pxToRem(size.font.SHORT)};
        height: 27px;
        padding: 0 ${size.pxToRem(size.space.XXS)};
      }

      &.square {
        width: 40px;
        padding: 0;

        &.s {
          width: 27px;
          min-width: 27px;
        }
      }

      &[disabled] {
        cursor: not-allowed;
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
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      display: inline-flex;
      margin-right: ${pxToRem(space.XXS)};
    `
  }}
`
const Suffix = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size
    return css`
      display: inline-flex;
      margin-left: ${pxToRem(space.XXS)};
    `
  }}
`
const tagStore = {
  button: Base.withComponent('button'),
  a: Base.withComponent('a'),
}

export const BaseButton: VFC<ButtonProps> = buttonFactory<ButtonProps>('button')

const AnchorButton: VFC<AnchorProps> = buttonFactory<AnchorProps>('a')

export const BaseButtonAnchor: VFC<AnchorProps> = ({ disabled, href, onClick, ...props }) => {
  const controlledHref = React.useMemo(() => {
    // When disabled, make href undefined
    return disabled ? undefined : href
  }, [disabled, href])

  const controlledOnClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        // When disabled, do not fire click event
        e.preventDefault()
        e.stopPropagation()
        return
      }
      onClick && onClick(e)
    },
    [disabled, onClick],
  )

  return (
    <AnchorButton
      {...props}
      href={controlledHref}
      onClick={controlledOnClick}
      disabled={disabled}
    />
  )
}
