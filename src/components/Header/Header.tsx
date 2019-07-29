import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { SmartHRLogo } from '../SmartHRLogo/SmartHRLogo'

interface Props {
  tenant_name?: string
  logo_url?: string
}

const HeaderComponent: React.FC<Props> = ({ ...props }) => (
  <Wrapper {...props}>
    <div className="header-logoarea">
      <a className="header-logoarea__logo" href={props.logo_url ? props.logo_url : '/'}>
        <SmartHRLogo />
      </a>
      <span className="header-logoarea__tenant-name">{props.tenant_name}</span>
    </div>

    <div className="header-naviarea">hoge</div>
  </Wrapper>
)

export const Header = withTheme(HeaderComponent)

const Wrapper: any = styled.header`
  ${({ theme }: InjectedProps) => {
    const { palette, size } = theme

    return css`
      display: flex;
      height: 50px;
      padding: 0 ${size.space.xs}px;
      background-color: ${palette.SmartHRGreen};
      box-sizing: border-box;
      position: relative;
      align-items: center;
      justify-content: space-between;

      .header-logoarea {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__logo {
          display: block;
          padding: 0;
          box-sizing: border-box;
          transition: opacity 0.3s;

          &:hover {
            opacity: 0.7;
          }
        }

        &__tenant-name {
          display: block;
          margin-left: ${size.space.xs}px;
          color: ${palette.White};
        }
      }
    `
  }}
`
