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
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
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
  //return <Tag className={classNames} {...props} />
  return (
    <Tag className={classNames} {...props}>
      {props.iconLeft && <figure className="icon-left">{props.iconLeft}</figure>}
      {props.children}
      {props.iconRight && <figure className="icon-right">{props.iconRight}</figure>}
    </Tag>
  )
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
      border-radius: ${frame.border.radius.m};
      color: ${palette.White};
      font-size: ${size.font.grande}px;
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
        background-color: ${palette.Red};
      }
      &.sub-a {
        background-color: #5e718d;
      }
      &.sub-b {
        border: 1px solid #d2d2d2;
        background-color: ${palette.White};
        color: ${palette.Mono_P60};
      }
      &.sub-c {
        border: 1px solid ${palette.White};
        background-color: transparent;
        color: ${palette.White};
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
          background-color: ${palette.White};
          color: ${palette.Main};
        }
      }

      &[disabled] {
        background-color: ${palette.Mono_P10};
        color: ${palette.Mono_P30};
        pointer-events: none;
        cursor: not-allowed;
      }

      & figure.icon-left,
      & figure.icon-right {
        display: inline-block;
        margin: 0;
        padding: 0;
        vertical-align: middle;
        line-height: 1;
      }

      & figure.icon-left {
        margin-right: ${size.font.grande}px;
        margin-left: -8px;
      }

      & figure.icon-right {
        margin-left: ${size.font.grande}px;
        margin-right: -8px;
      }
    `
  }}
`
