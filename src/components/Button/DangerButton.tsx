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
    const { palette, interaction } = theme

    return css`
      background-color: ${palette.DANGER};
      color: #fff;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &.hover {
        background-color: ${palette.hoverColor(palette.DANGER)};
      }

      &[disabled] {
        background-color: ${palette.disableColor(palette.DANGER)};
        color: ${palette.disableColor('#fff')};
      }
    `
  }}
`

export const DangerButton: React.FC<ButtonProps> = withTheme(injectStyle(ButtonComponent))
export const DangerButtonAnchor: React.FC<AnchorProps> = withTheme(
  injectStyle(ButtonAnchorComponent),
)
