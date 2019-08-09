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
    const { MAIN, DANGER, WARNING, BORDER } = palette

    return css`
      margin: 0;
      padding: 0 ${size.pxToRem(theme.size.space.XXS)};
      display: inline-block;
      white-space: nowrap;
      font-size: ${size.font.SHORT}px;
      border: ${frame.border.default};
      background-color: transparent;
      color: ${BORDER};

      &.success {
        border: 1px solid ${MAIN};
        background-color: ${skeleton ? 'transparent' : MAIN};
        color: ${skeleton ? MAIN : '#fff'};
      }

      &.error {
        border: 1px solid ${DANGER};
        background-color: ${skeleton ? 'transparent' : DANGER};
        color: ${skeleton ? DANGER : '#fff'};
      }

      &.warning {
        border: 1px solid ${WARNING};
        background-color: ${skeleton ? 'transparent' : WARNING};
        color: ${skeleton ? WARNING : '#fff'};
      }

      &.require {
        border: 1px solid ${WARNING};
        background-color: ${skeleton ? 'transparent' : WARNING};
        color: ${skeleton ? WARNING : '#fff'};
      }
    `
  }}
`

export const Tag = withTheme(TagComponent)
