import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { SmartHRLogo } from '../SmartHRLogo/SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { FaQuestionCircle, FaThList, FaUser } from 'react-icons/fa'

interface Props {
  tenantName?: string
  logoUrl?: string
}

const HeaderComponent: React.FC<Props> = ({ ...props }) => (
  <Wrapper {...props}>
    <HeaderLogoArea>
      <HeaderLogo href={props.logoUrl ? props.logoUrl : '/'} aria-label="SmartHR">
        <SmartHRLogo />
      </HeaderLogo>
      <TenantName {...props}>{props.tenantName}</TenantName>
    </HeaderLogoArea>

    <HeaderAreaNavi>
      <HeaderButton url="#" icon={<FaQuestionCircle />}>
        ヘルプ
      </HeaderButton>
      <HeaderButton url="#" icon={<FaThList />}>
        従業員リスト
      </HeaderButton>
      <HeaderButton url="#" icon={<FaUser />}>
        従業員管理
      </HeaderButton>
    </HeaderAreaNavi>
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
    `
  }}
`

const HeaderLogoArea: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HeaderLogo: any = styled.a`
  display: block;
  padding: 0;
  box-sizing: border-box;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`

const TenantName: any = styled.span`
  ${({ theme }: InjectedProps) => {
    const { palette, size } = theme

    return css`
      display: block;
      margin-left: ${size.space.xs}px;
      color: ${palette.White};
    `
  }}
`

const HeaderAreaNavi: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
