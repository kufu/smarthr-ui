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
  ...props
}) => {
  const Tag = hoverable()(Base.withComponent(tag))
  const classNames = `${type} ${size} ${full ? 'full' : ''}`
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
      font-size: ${size.font.tall}px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      box-sizing: border-box;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.s {
        min-width: 80px;
        height: 32px;
        padding: 0 ${size.space.xxs}px;
        line-height: 32px;
      }
      &.m {
        min-width: 180px;
        height: 40px;
        padding: 0 ${size.space.xs}px;
        line-height: 40px;
      }
      &.l {
        min-width: 220px;
        height: 48px;
        padding: 0 ${size.space.s}px;
        line-height: 48px;
      }

      &.full {
        width: 100%;
      }

      &.primary {
        background-color: ${palette.Main};
      }
      &.danger {
        background-color: ${palette.Danger};
      }
      &.sub-a {
        background-color: #5e718d;
      }
      &.sub-b {
        border: 1px solid ${palette.Border};
        background-color: #fff;
        color: ${palette.TextGrey};
      }
      &.sub-c {
        border: 1px solid #fff;
        background-color: transparent;
        color: #fff;
      }

      &.hover {
        &.primary {
          background-color: ${palette.Main_P10};
        }
        &.danger {
          background-color: #de283d;
        }
        &.sub-a {
          background-color: #414e62;
        }
        &.sub-b {
          background-color: ${palette.Mono_P05};
        }
        &.sub-c {
          background-color: #fff;
          color: ${palette.Main};
        }
      }

      &[disabled] {
        background-color: ${palette.Border};
        color: ${palette.Mono_P30};
        pointer-events: none;
      }
    `
  }}
`
