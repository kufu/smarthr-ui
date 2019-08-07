import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

type Type = 'success' | 'warning' | 'error' | 'require'

interface Props {
  skeleton?: boolean
  type?: Type
  children: string
}

interface WrapperProps {
  skeleton: boolean
}

type MergedProps = Props & InjectedProps

const TagComponent: React.FC<MergedProps> = ({ skeleton = false, type, children, theme }) => {
  return (
    <Wrapper theme={theme} className={type} skeleton={skeleton}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.span`
  ${({ theme, skeleton }: InjectedProps & WrapperProps) => {
    const { frame, size, palette } = theme
    const { Main, Danger, Warning, TextGrey } = palette

    return css`
      margin: 0;
      padding: 0 ${size.pxToRem(theme.size.space.xxs)};
      display: inline-block;
      white-space: nowrap;
      font-size: ${size.font.tasting}px;
      font-weight: bold;
      border: ${frame.border.default};
      background-color: transparent;
      color: ${TextGrey};

      &.success {
        border: 1px solid ${Main};
        background-color: ${skeleton ? 'transparent' : Main};
        color: ${skeleton ? Main : '#fff'};
      }

      &.error {
        border: 1px solid ${Danger};
        background-color: ${skeleton ? 'transparent' : Danger};
        color: ${skeleton ? Danger : '#fff'};
      }

      &.warning {
        border: 1px solid ${Warning};
        background-color: ${skeleton ? 'transparent' : Warning};
        color: ${skeleton ? Warning : '#fff'};
      }

      &.require {
        border: 1px solid ${Warning};
        background-color: ${skeleton ? 'transparent' : Warning};
        color: ${skeleton ? Warning : '#fff'};
      }
    `
  }}
`

export const Tag = withTheme(TagComponent)
