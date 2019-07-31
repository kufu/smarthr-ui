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
    const { Black, White, Blue, Red, Warning, Border } = palette

    return css`
      margin: 0;
      padding: 0 ${size.pxToRem(theme.size.space.xxs)};
      display: inline-block;
      white-space: nowrap;
      font-size: ${size.font.tasting}px;
      border: ${frame.border.default};
      background-color: transparent;
      color: ${Border};

      &.success {
        border: 1px solid ${Blue};
        background-color: ${skeleton ? 'transparent' : Blue};
        color: ${skeleton ? Blue : White};
      }

      &.error {
        border: 1px solid ${Red};
        background-color: ${skeleton ? 'transparent' : Red};
        color: ${skeleton ? Red : White};
      }

      &.warning {
        border: 1px solid ${Warning};
        background-color: ${skeleton ? 'transparent' : Warning};
        color: ${skeleton ? Warning : Black};
      }

      &.require {
        border: 1px solid ${Warning};
        background-color: ${skeleton ? 'transparent' : Warning};
        color: ${skeleton ? Warning : White};
      }
    `
  }}
`

export const Tag = withTheme(TagComponent)
