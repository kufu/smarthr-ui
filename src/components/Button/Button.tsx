import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { hoverable } from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type Tag = 'button' | 'a' | 'div'
type Type = 'primary' | 'danger' | 'sub-a' | 'sub-b' | 'sub-c'
type Size = 's' | 'm' | 'l'

interface ClickEvent {
  preventDefault: () => void
}

interface BaseProps {
  type?: Type
  size?: Size
  full?: boolean
  children?: React.ReactNode
  className?: string
}

interface ButtonProps extends BaseProps {
  onClick?: (e: ClickEvent) => void
  disabled?: boolean
}

interface AnchorProps extends BaseProps {
  href: string
  target?: string
}

interface ButtonDivProps extends BaseProps {
  onClick?: (e: ClickEvent) => void
  disabled?: boolean
  tabIndex?: number
  role?: string
}

const buttonFactory: <Props extends BaseProps>(
  tag: Tag,
) => React.FC<Props & InjectedProps> = tag => ({
  type = 'primary',
  size = 'm',
  full = false,
  className = '',
  ...props
}) => {
  const Tag = hoverable()(Base.withComponent(tag))
  const classNames = `${type} ${size} ${full ? 'full' : ''} ${className}`
  return <Tag className={classNames} {...props} />
}

const ButtonComponent: React.FC<ButtonProps & InjectedProps> = buttonFactory<ButtonProps>('button')
const ButtonAnchorComponent: React.FC<AnchorProps & InjectedProps> = buttonFactory<AnchorProps>('a')
const ButtonDivComponent: React.FC<ButtonDivProps & InjectedProps> = buttonFactory<ButtonDivProps>(
  'div',
)

export const Button = withTheme(ButtonComponent)
export const ButtonAnchor = withTheme(ButtonAnchorComponent)
export const ButtonDiv = withTheme(ButtonDivComponent)

const Base: any = styled.div`
  ${({ theme }: InjectedProps) => {
    const { palette, frame, size, interaction } = theme

    return css`
      display: inline-block;
      width: ${({ wide }: any) => (wide ? '100%;' : 'auto')};
      border: none;
      border-radius: ${frame.border.radius.m};
      color: #fff;
      font-size: ${size.font.TALL}px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      box-sizing: border-box;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.s {
        min-width: 80px;
        height: 32px;
        padding: 0 ${size.space.XXS}px;
        line-height: 32px;
      }
      &.m {
        min-width: 180px;
        height: 40px;
        padding: 0 ${size.space.XS}px;
        line-height: 40px;
      }
      &.l {
        min-width: 220px;
        height: 48px;
        padding: 0 ${size.space.S}px;
        line-height: 48px;
      }

      &.full {
        width: 100%;
      }

      &.primary {
        background-color: ${palette.MAIN};
      }
      &.danger {
        background-color: ${palette.DANGER};
      }
      &.sub-a {
        background-color: #5e718d;
      }
      &.sub-b {
        border: 1px solid ${palette.BORDER};
        background-color: #fff;
        color: ${palette.TEXT_GREY};
      }
      &.sub-c {
        border: 1px solid #fff;
        background-color: transparent;
        color: #fff;
      }

      &.hover {
        &.primary {
          background-color: ${palette.hoverColor(palette.MAIN)};
        }
        &.danger {
          background-color: ${palette.hoverColor(palette.DANGER)};
        }
        &.sub-a {
          background-color: #414e62;
        }
        &.sub-b {
          background-color: ${palette.hoverColor('#fff')};
        }
        &.sub-c {
          background-color: #fff;
          color: ${palette.MAIN};
        }
      }

      &[disabled] {
        background-color: ${palette.BORDER};
        color: ${palette.TEXT_GREY};
        pointer-events: none;
      }
    `
  }}
`
