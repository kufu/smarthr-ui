import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { SmartHRLogo } from '../SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderNotification } from './HeaderNotification'
import { HeaderCrewDropdown } from './HeaderCrewDropdown'
import { HeaderUserDropDown, HeaderUserDropDownProps } from './HeaderUserDropDown'

type Props = {
  currentTenantName: string
  notificationLength: number
  onClickLogo: () => void
  onClickHelp: () => void
  onClickNotification: () => void

  isAdmin?: boolean
  onClickCrewList?: () => void
  onClickNewCrew?: () => void
  onClickBulkInsertCrews?: () => void
  onClickBulkUpdateCrews?: () => void
  onClickInviteCrew?: () => void

  userDropDown: HeaderUserDropDownProps
}

export const Header: FC<Props> = ({
  currentTenantName,
  notificationLength,
  onClickLogo,
  onClickHelp,
  onClickNotification,

  isAdmin = false,
  onClickCrewList,
  onClickNewCrew,
  onClickBulkInsertCrews,
  onClickBulkUpdateCrews,
  onClickInviteCrew,

  userDropDown,
}) => {
  const theme = useTheme()
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

            <HeaderCrewDropdown
              onClickNew={onClickNewCrew}
              onClickBulkInsert={onClickBulkInsertCrews}
              onClickBulkUpdate={onClickBulkUpdateCrews}
              onClickInvite={onClickInviteCrew}
            />
          </>
        )}

        <HeaderNotification length={notificationLength} onClick={onClickNotification} />

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
