import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { hoverable } from '../../hocs/hoverable'
import { isTouchDevice } from '../../libs/ua'

type Tag = 'button' | 'a'
type Size = 's'

interface ClickEvent {
  preventDefault: () => void
}

interface BaseProps {
  size?: Size
  children?: React.ReactNode
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  square?: boolean
  wide?: boolean
}

interface ButtonProps extends BaseProps {
  onClick?: (e: ClickEvent) => void
  disabled?: boolean
}

interface AnchorProps extends BaseProps {
  href: string
  target?: string
  rel?: string
}

const buttonFactory: <Props extends BaseProps>(
  tag: Tag,
) => React.FC<Props & InjectedProps> = tag => ({
  size = '',
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

const ButtonComponent: React.FC<ButtonProps & InjectedProps> = buttonFactory<ButtonProps>('button')
const ButtonAnchorComponent: React.FC<AnchorProps & InjectedProps> = buttonFactory<AnchorProps>('a')

export const PrimaryButton = withTheme(ButtonComponent)
export const PrimaryButtonAnchor = withTheme(ButtonAnchorComponent)

const Base: any = styled.div`
  ${({ theme }: InjectedProps) => {
    const { palette, frame, size, interaction } = theme

    return css`
      display: inline-flex;
      justify-content: center;
      align-items: center;
      padding: 0 ${size.pxToRem(size.space.XS)};
      width: ${({ wide }: any) => (wide ? '100%;' : 'auto')};
      min-width: 2rem;
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
      border: none;
      border-radius: ${frame.border.radius.m};
      background-color: ${palette.MAIN};
      color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      box-sizing: border-box;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.s {
        min-width: 80px;
        height: 32px;
        padding: 0 ${size.pxToRem(size.space.XXS)};
        line-height: 32px;
      }

      &.hover {
        background-color: ${palette.hoverColor(palette.MAIN)};
      }

      &.square {
        width: 40px;
        line-height: 40px;
        padding: 0;

        &.s {
          font-size: ${size.pxToRem(size.font.SHORT)}
          width: 32px;
          min-width: 32px;
        }
      }

      &[disabled] {
        background-color: ${palette.disableColor(palette.MAIN)};
        color: ${palette.disableColor('#fff')};
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
