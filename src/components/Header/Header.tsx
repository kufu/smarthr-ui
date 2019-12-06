import * as React from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'
import { SmartHRLogo } from '../SmartHRLogo/SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderNotification, HeaderNotificationProps } from './HeaderNotification'
import { HeaderUserDropDown, HeaderUserDropDownProps } from './HeaderUserDropDown'
import { HeaderEmployeeDropDown, HeaderEmployeeDropDownProps } from './HeaderEmployeeDropDown'

type Props = {
  logoUrl?: string
  employeeListLink?: string
  isAdmin?: boolean
  helpUrl?: string
  notification: HeaderNotificationProps
  employeeDropDown: HeaderEmployeeDropDownProps
  userDropDown: HeaderUserDropDownProps
}

export const Header: React.FC<Props> = ({
  logoUrl = '/',
  employeeListLink,
  isAdmin,
  helpUrl,
  notification,
  employeeDropDown,
  userDropDown,
}) => {
  const theme = useTheme()
  const { number, url } = notification
  const {
    crewsNewUrl,
    crewsBulkInserterUrl,
    crewsBulkUpdaterUrl,
    crewsInviterUrl,
  } = employeeDropDown
  const {
    displayName,
    currentTenant,
    avatar,
    profileUrl,
    myAccountUrl,
    adminCompanyUrl,
    schoolUrl,
  } = userDropDown

  return (
    <Wrapper themes={theme}>
      <HeaderLogoArea>
        <HeaderLogo href={logoUrl} aria-label="SmartHR">
          <SmartHRLogo />
        </HeaderLogo>
        <TenantName themes={theme}>{currentTenant}</TenantName>
      </HeaderLogoArea>

      <HeaderAreaNavi>
        <HeaderButton url={helpUrl} icon="fa-question-circle" target="_blank">
          ヘルプ
        </HeaderButton>
        {isAdmin && (
          <>
            <HeaderButton url={employeeListLink} icon="fa-th-list">
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
          schoolUrl={schoolUrl}
        />
      </HeaderAreaNavi>
    </Wrapper>
  )
}

const Wrapper: any = styled.header<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes
    return css`
      display: flex;
      height: ${size.pxToRem(50)};
      padding: 0 ${size.pxToRem(size.space.XS)};
      background-color: ${palette.HEADER_GREEN};
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

const TenantName: any = styled.span<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes
    return css`
      display: block;
      margin-left: ${size.space.XS}px;
      color: #fff;
    `
  }}
`

const HeaderAreaNavi: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
