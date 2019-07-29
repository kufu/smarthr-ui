import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

interface Props {
  children: React.ReactNode
  url?: string
  icon?: React.ReactNode
}

const HeaderButtonComponent: React.StatelessComponent<Props & InjectedProps> = ({
  theme,
  url,
  icon,
  children,
}) => (
  <Wrapper theme={theme} href={url}>
    {icon && <figure className="header-button__icon">{icon}</figure>}
    {children}
  </Wrapper>
)

export const HeaderButton = withTheme(HeaderButtonComponent)

const Wrapper: any = styled.a`
  ${({ theme }: InjectedProps) => {
    const { palette } = theme

    return css`
      display: block;
      margin: 0;
      padding: 0;
      color: ${palette.White};
    `
  }}
`
