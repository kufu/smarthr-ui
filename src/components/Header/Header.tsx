import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { SmartHRLogo } from '../SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderNotification, HeaderNotificationProps } from './HeaderNotification'
import { HeaderUserDropDown, HeaderUserDropDownProps } from './HeaderUserDropDown'
import { HeaderEmployeeDropDown, HeaderEmployeeDropDownProps } from './HeaderEmployeeDropDown'

type Props = {
  currentTenantName: string
  onClickLogo: () => void
  onClickHelp: () => void

  isAdmin?: boolean
  onClickCrewList?: () => void

  notification: HeaderNotificationProps
  employeeDropDown: HeaderEmployeeDropDownProps
  userDropDown: HeaderUserDropDownProps
}

export const Header: FC<Props> = ({
  currentTenantName,
  onClickLogo,
  onClickHelp,

  isAdmin = false,
  onClickCrewList,

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
  const { displayName, avatar, profileUrl, myAccountUrl, adminCompanyUrl, schoolUrl } = userDropDown

  return (
    <Wrapper themes={theme}>
      <HeaderColumn>
        <HeaderLogo onClick={onClickLogo} aria-label="SmartHR" themes={theme}>
          <SmartHRLogo />
        </HeaderLogo>
        <TenantName themes={theme}>{currentTenantName}</TenantName>
      </HeaderColumn>

      <HeaderColumn>
        <HeaderButton icon="fa-question-circle" onClick={onClickHelp}>
          ヘルプ
        </HeaderButton>

        {isAdmin && (
          <>
            <HeaderButton icon="fa-th-list" onClick={onClickCrewList}>
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
          currentTenant={currentTenantName}
          avatar={avatar}
          isAdmin={isAdmin}
          profileUrl={profileUrl}
          myAccountUrl={myAccountUrl}
          adminCompanyUrl={adminCompanyUrl}
          schoolUrl={schoolUrl}
        />
      </HeaderColumn>
    </Wrapper>
  )
}

const Wrapper = styled.header<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 ${size.pxToRem(size.space.XS)};
      background-color: ${palette.HEADER_GREEN};
    `
  }}
`
const HeaderColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const HeaderLogo = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { animation } = themes.interaction.hover

    return css`
      padding: 0;
      border: none;
      background: none;
      box-sizing: border-box;
      transition: opacity ${animation};
      cursor: pointer;

      &:hover {
        opacity: 0.7;
      }
    `
  }}
`
const TenantName = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      margin: 0 0 0 ${size.pxToRem(size.space.XS)};
      font-size: ${size.pxToRem(size.font.TALL)};
      color: #fff;
    `
  }}
`
