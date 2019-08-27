import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

// import { hoverable } from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type Tag = 'button' | 'a'
type Size = 's' | 'm' | 'l'

interface ClickEvent {
  preventDefault: () => void
}

interface BaseProps {
  size?: Size
  full?: boolean
  children?: React.ReactNode
  className?: string
  tag?: Tag
  tabIndex?: number
}

// tag = 'button' ならこの型を使いたい
interface ButtonProps extends BaseProps {
  onClick?: (e: ClickEvent) => void
  disabled?: boolean
}

// tag = 'a' ならこの型を使いたい
// interface AnchorProps extends BaseProps {
//   href: string
//   target?: string
// }

const PrimaryButtonComponent: React.FC<ButtonProps & InjectedProps> = ({
  size = 'm',
  full = false,
  className = '',
  tag = 'button',
  ...props
}) => {
  const classNames = `${size} ${full ? 'full' : ''} ${className}`

  return <Base className={classNames} as={tag} {...props}></Base>
}

export const PrimaryButton = withTheme(PrimaryButtonComponent)

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
      background-color: ${palette.MAIN};

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

      &.hover {
        background-color: ${palette.hoverColor(palette.MAIN)};
      }

      &[disabled] {
        background-color: ${palette.BORDER};
        color: ${palette.TEXT_GREY};
        pointer-events: none;
      }
    `
  }}
`
