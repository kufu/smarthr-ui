import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { SmartHRLogo } from '../SmartHRLogo/SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderNotification, HeaderNotificationProps } from './HeaderNotification'
import { HeaderUserDropDown, HeaderUserDropDownProps } from './HeaderUserDropDown'
import { HeaderEmployeeDropDown, HeaderEmployeeDropDownProps } from './HeaderEmployeeDropDown'

interface Props {
  logoUrl?: string
  employeeListButtonLink?: string
  isAdmin?: boolean
  headerNotification: HeaderNotificationProps
  headerEmployeeDropDown: HeaderEmployeeDropDownProps
  headerUserDropDown: HeaderUserDropDownProps
}

const HeaderComponent: React.FC<Props & InjectedProps> = ({
  logoUrl = '/',
  employeeListButtonLink,
  isAdmin,
  headerNotification,
  headerEmployeeDropDown,
  headerUserDropDown,
  theme,
}) => {
  const { number, url } = headerNotification
  const {
    crewsNewUrl,
    crewsBulkInserterUrl,
    crewsBulkUpdaterUrl,
    crewsInviterUrl,
  } = headerEmployeeDropDown
  const {
    displayName,
    currentTenant,
    avatar,
    profileUrl,
    myAccountUrl,
    adminCompanyUrl,
    helpUrl,
    schoolUrl,
  } = headerUserDropDown

  return (
    <Wrapper theme={theme}>
      <HeaderLogoArea>
        <HeaderLogo href={logoUrl} aria-label="SmartHR">
          <SmartHRLogo />
        </HeaderLogo>
        <TenantName theme={theme}>{currentTenant}</TenantName>
      </HeaderLogoArea>

      <HeaderAreaNavi>
        {isAdmin && (
          <>
            <HeaderButton url={helpUrl} icon="fa-question-circle" target="_blank">
              ヘルプ
            </HeaderButton>

            <HeaderButton url={employeeListButtonLink} icon="fa-th-list">
              従業員リスト
            </HeaderButton>

            <HeaderEmployeeDropDown
              crewsNewUrl={crewsNewUrl}
              crewsBulkInserterUrl={crewsBulkInserterUrl}
              crewsBulkUpdaterUrl={crewsBulkUpdaterUrl}
              crewsInviterUrl={crewsInviterUrl}
            />
          </>
        )}
        <HeaderNotification url={url} number={number} />

        <HeaderUserDropDown
          displayName={displayName}
          currentTenant={currentTenant}
          avatar={avatar}
          isAdmin={isAdmin}
          profileUrl={profileUrl}
          myAccountUrl={myAccountUrl}
          adminCompanyUrl={adminCompanyUrl}
          helpUrl={helpUrl}
          schoolUrl={schoolUrl}
        />
      </HeaderAreaNavi>
    </Wrapper>
  )
}

export const Header = withTheme(HeaderComponent)

const Wrapper: any = styled.header`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      height: ${theme.size.pxToRem(50)};
      padding: 0 ${theme.size.pxToRem(theme.size.space.XS)};
      background-color: ${theme.palette.HEADER_GREEN};
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
