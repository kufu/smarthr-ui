import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

interface Props {
  tetant_name?: string
}

const HeaderComponent: React.FC<Props> = ({ ...props }) => <Wrapper {...props} />

export const Header = withTheme(HeaderComponent)

const Wrapper: any = styled.header`
  ${({ theme }: InjectedProps) => {
    const { palette, size } = theme

    return css`
      display: block;
      height: 50px;
      padding: ${size.space.xs};
      background-color: ${palette.SmartHRGreen};
    `
  }}
`
