import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { SmartHRLogo } from '../SmartHRLogo'
import { HeaderButton } from './HeaderButton'
import { HeaderNotification } from './HeaderNotification'
import { HeaderCrewDropdown } from './HeaderCrewDropdown'
import { HeaderUserDropdown } from './HeaderUserDropdown'
import { FaQuestionCircleIcon, FaThListIcon } from '../Icon/'

type Props = {
  isAdmin?: boolean
  isCrew?: boolean
  user: {
    displayName: string
    avatar: string
  }
  currentTenantName: string
  tenantContent?: React.ReactNode
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
  className?: string
}

export const Header: VFC<Props> = ({
  isAdmin = false,
  isCrew = false,
  user,
  currentTenantName,
  tenantContent,
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
  className,
}) => {
  const theme = useTheme()
  const { displayName, avatar } = user

  return (
    <Wrapper themes={theme} className={className}>
      <HeaderColumn>
        <HeaderLogo onClick={onClickLogo} aria-label="SmartHR" themes={theme}>
          <SmartHRLogo />
        </HeaderLogo>
        <TenantName themes={theme}>{tenantContent ? tenantContent : currentTenantName}</TenantName>
      </HeaderColumn>

      <HeaderColumn>
        <HeaderButton icon={FaQuestionCircleIcon} onClick={onClickHelp}>
          ヘルプ
        </HeaderButton>

        {isAdmin && (
          <>
            <HeaderButton icon={FaThListIcon} onClick={onClickCrewList}>
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
          isCrew={isCrew}
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
  ${({ themes: { spacingByChar, palette } }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 ${spacingByChar(1)};
      background-color: ${palette.BRAND};
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
const TenantName = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, spacingByChar } = themes

    return css`
      margin: 0 0 0 ${spacingByChar(1)};
      font-size: ${size.pxToRem(size.font.TALL)};
      color: #fff;
    `
  }}
`
