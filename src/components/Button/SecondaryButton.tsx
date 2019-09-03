import * as React from 'react'
import styled, { css } from 'styled-components'

import { buttonFactory, BaseProps } from './BaseButton'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

interface ClickEvent {
  preventDefault: () => void
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

type MargedButtonProps = ButtonProps & InjectedProps
type MargedAnchorProps = AnchorProps & InjectedProps

const ButtonComponent: React.FC<MargedButtonProps> = buttonFactory<ButtonProps>('button')
const ButtonAnchorComponent: React.FC<MargedAnchorProps> = buttonFactory<AnchorProps>('a')

const injectStyle = (
  component: React.FC<MargedButtonProps> | React.FC<MargedAnchorProps>,
) => styled(component)`
  ${({ theme }: InjectedProps) => {
    const { palette, interaction, frame } = theme

    return css`
      background-color: #fff;
      color: ${palette.TEXT_BLACK};
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};
      border: ${frame.border.default};

      &.hover {
        background-color: ${palette.hoverColor('#fff')};
      }

      &[disabled] {
        background-color: ${palette.disableColor('#fff')};
        color: ${palette.disableColor(palette.TEXT_BLACK)};
      }
    `
  }}
`

export const SecondaryButton: React.FC<ButtonProps> = withTheme(injectStyle(ButtonComponent))
export const SecondaryButtonAnchor: React.FC<AnchorProps> = withTheme(
  injectStyle(ButtonAnchorComponent),
)
