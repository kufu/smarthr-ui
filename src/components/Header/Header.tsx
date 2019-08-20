import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { SmartHRLogo } from '../SmartHRLogo/SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderDropDown, HeaderDropDownMenuProps } from './HeaderDropDown'
import { HeaderNotification } from './HeaderNotification'
import { HeaderUserDropDown } from './HeaderUserDropDown'

interface Props {
  tenantName?: string
  logoUrl?: string
  helpButtonLink?: string
  employeeListButtonLink?: string
  userMailAddress?: string
  employeeButtonMenu?: HeaderDropDownMenuProps[]
  userButtonMenu?: HeaderDropDownMenuProps[]
  notificationNumber?: number
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
      <HeaderButton url={props.helpButtonLink} icon="fa-question-circle" target="_blank">
        ヘルプ
      </HeaderButton>

      <HeaderButton url={props.employeeListButtonLink} icon="fa-th-list">
        従業員リスト
      </HeaderButton>

      <HeaderDropDown
        key="headerDropDown-0"
        dropDownKey="manage"
        icon="fa-users"
        menus={props.employeeButtonMenu}
      >
        従業員管理
      </HeaderDropDown>

      <HeaderNotification number={props.notificationNumber} />

      <HeaderDropDown key="headerDropDown-1" dropDownKey="other" menus={props.userButtonMenu}>
        {props.userMailAddress}
      </HeaderDropDown>
      <HeaderUserDropDown
        displayName="abc@example.com"
        currentTenant="Test inc."
      ></HeaderUserDropDown>
    </HeaderAreaNavi>
  </Wrapper>
)

export const Header = withTheme(HeaderComponent)

const Wrapper: any = styled.header`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      height: ${theme.size.pxToRem(50)};
      padding: 0 ${theme.size.pxToRem(theme.size.space.XS)};
      background-color: ${theme.palette.MAIN};
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
    return css`
      display: block;
      margin-left: ${theme.size.space.XS}px;
      color: #ffffff;
    `
  }}
`

const HeaderAreaNavi: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
