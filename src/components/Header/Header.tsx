import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { SmartHRLogo } from '../SmartHRLogo/SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderNotification } from './HeaderNotification'
import { HeaderUserDropDown, HeaderUserDropDownProps } from './HeaderUserDropDown'
import { HeaderEmployeeDropDown, HeaderEmployeeDropDownProps } from './HeaderEmployeeDropDown'

interface Props {
  logoUrl?: string
  employeeListButtonLink?: string
  notificationNumber?: number
  isAdmin?: boolean
}

const HeaderComponent: React.FC<Props & HeaderEmployeeDropDownProps & HeaderUserDropDownProps> = ({
  ...props
}) => (
  <Wrapper {...props}>
    <HeaderLogoArea>
      <HeaderLogo href={props.logoUrl ? props.logoUrl : '/'} aria-label="SmartHR">
        <SmartHRLogo />
      </HeaderLogo>
      <TenantName {...props}>{props.currentTenant}</TenantName>
    </HeaderLogoArea>

    <HeaderAreaNavi>
      <HeaderButton url={props.helpUrl} icon="fa-question-circle" target="_blank">
        ヘルプ
      </HeaderButton>

      <HeaderButton url={props.employeeListButtonLink} icon="fa-th-list">
        従業員リスト
      </HeaderButton>

      {props.isAdmin && (
        <HeaderEmployeeDropDown
          crewsNewUrl="abc"
          crewsBulkInserterUrl="abc"
          crewsBulkUpdaterUrl="abc"
          crewsInviterUrl="abc"
        />
      )}
      <HeaderNotification number={props.notificationNumber} />

      <HeaderUserDropDown
        displayName="abc@example.com"
        currentTenant="Test inc."
        isAdmin={true}
        profileUrl="abc"
        myAccountUrl="abc"
        adminCompanyUrl="abc"
        helpUrl="abc"
        schoolUrl="abc"
      />
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
      color: #fff;
    `
  }}
`

const HeaderAreaNavi: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
