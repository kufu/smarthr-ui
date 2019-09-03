import * as React from 'react'
import styled, { css } from 'styled-components'

import { buttonFactory } from './BaseButton'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

type Size = 'default' | 's'

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

const ButtonComponent: React.FC<ButtonProps & InjectedProps> = buttonFactory<ButtonProps>('button')
const ButtonAnchorComponent: React.FC<AnchorProps & InjectedProps> = buttonFactory<AnchorProps>('a')

const injectStyle = (
  component: React.FC<ButtonProps & InjectedProps> | React.FC<AnchorProps & InjectedProps>,
) => styled(component)`
  ${({ theme }: InjectedProps) => {
    const { palette, interaction } = theme

    return css`
      background-color: ${palette.MAIN};
      color: #fff;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.hover {
        background-color: ${palette.hoverColor(palette.MAIN)};
      }

      &[disabled] {
        background-color: ${palette.disableColor(palette.MAIN)};
        color: ${palette.disableColor('#fff')};
      }
    `
  }}
`

export const PrimaryButton: React.FC<ButtonProps> = withTheme(injectStyle(ButtonComponent))
export const PrimaryButtonAnchor: React.FC<AnchorProps> = withTheme(
  injectStyle(ButtonAnchorComponent),
)
