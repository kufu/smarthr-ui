import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { hoverable } from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type Tag = 'button' | 'a'
type Size = 'default' | 's'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'prefix'> &
  BaseProps
export type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> & BaseProps

export type BaseProps = {
  size?: Size
  children?: React.ReactNode
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  square?: boolean
  wide?: boolean
}

export const buttonFactory: <Props extends BaseProps>(tag: Tag) => FC<Props> = (tag) => {
  const Tag = hoverable()(tagStore[tag])

  return ({
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
      <Tag className={classNames} themes={theme} {...props}>
        {prefix && <Prefix themes={theme}>{prefix}</Prefix>}
        {children}
        {suffix && <Suffix themes={theme}>{suffix}</Suffix>}
      </Tag>
    )
  }
}

const Base: any = styled.div<{ themes: Theme; wide: boolean }>`
  ${({ themes, wide }) => {
    const { frame, size, interaction } = themes

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

export const BaseButton: FC<ButtonProps> = buttonFactory<ButtonProps>('button')
export const BaseButtonAnchor: FC<AnchorProps> = buttonFactory<AnchorProps>('a')
