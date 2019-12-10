import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { SmartHRLogo } from '../SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderNotification } from './HeaderNotification'
import { HeaderCrewDropdown } from './HeaderCrewDropdown'
import { HeaderUserDropdown } from './HeaderUserDropdown'

type Props = {
  isAdmin?: boolean
  user: {
    displayName: string
    avatar: string
  }
  currentTenantName: string
  notificationLength: number
  onClickLogo: () => void
  onClickHelp: () => void
  onClickNotification: () => void
  onClickAccount: () => void
  onClickLogout: () => void
  onClickCrewList?: () => void
  onClickNewCrew?: () => void
  onClickBulkInsertCrews?: () => void
  onClickBulkUpdateCrews?: () => void
  onClickInviteCrew?: () => void
  onClickProfile?: () => void
  onClickCompany?: () => void
  onClickSchool?: () => void
}

export const Header: FC<Props> = ({
  isAdmin = false,
  user,
  currentTenantName,
  notificationLength,
  onClickLogo,
  onClickHelp,
  onClickNotification,
  onClickAccount,
  onClickLogout,
  onClickCrewList,
  onClickNewCrew,
  onClickBulkInsertCrews,
  onClickBulkUpdateCrews,
  onClickInviteCrew,
  onClickProfile,
  onClickCompany,
  onClickSchool,
}) => {
  const theme = useTheme()
  const { displayName, avatar } = user

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

        <HeaderUserDropdown
          isAdmin={isAdmin}
          isCrew={true} // TODO: 調査
          displayName={displayName}
          currentTenantName={currentTenantName}
          avatar={avatar}
          onClickAccount={onClickAccount}
          onClickLogout={onClickLogout}
          onClickProfile={onClickProfile}
          onClickCompany={onClickCompany}
          onClickSchool={onClickSchool}
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
