import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps } from '../../hocs/withTheme'

import { hoverable } from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type Tag = 'button' | 'a'
type Size = 'default' | 's'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'prefix'> &
  BaseProps
export type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> & BaseProps

export interface BaseProps {
  size?: Size
  children?: React.ReactNode
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  square?: boolean
  wide?: boolean
}

export type MargedButtonProps = ButtonProps & InjectedProps
export type MargedAnchorProps = AnchorProps & InjectedProps

export const buttonFactory: <Props extends BaseProps>(
  tag: Tag,
) => React.FC<Props & InjectedProps> = tag => ({
  size = 'default',
  className = '',
  square = false,
  children = '',
  prefix = '',
  suffix = '',
  theme,
  ...props
}) => {
  const Tag = hoverable()(Base.withComponent(tag))

  // prettier-ignore
  const classNames = `${size} ${className} ${square ? 'square' : ''} ${prefix ? 'prefix' : ''} ${suffix ? 'suffix' : ''}`

  return (
    <Tag className={classNames} theme={theme} {...props}>
      {prefix && <Prefix theme={theme}>{prefix}</Prefix>}
      {children}
      {suffix && <Suffix theme={theme}>{suffix}</Suffix>}
    </Tag>
  )
}

const Base: any = styled.div`
  ${({ theme }: InjectedProps) => {
    const { frame, size, interaction } = theme

    return css`
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: ${({ wide }: any) => (wide ? '100%;' : 'auto')};
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

const Prefix = styled.span`
  ${({ theme }: InjectedProps) => {
    const { size } = theme
    return css`
      display: inline-flex;
      margin-right: ${size.pxToRem(size.space.XXS)};
    `
  }}
`
const Suffix = styled.span`
  ${({ theme }: InjectedProps) => {
    const { size } = theme
    return css`
      display: inline-flex;
      margin-left: ${size.pxToRem(size.space.XXS)};
    `
  }}
`

export const BaseButton: React.FC<MargedButtonProps> = buttonFactory<ButtonProps>('button')
export const BaseButtonAnchor: React.FC<MargedAnchorProps> = buttonFactory<AnchorProps>('a')
