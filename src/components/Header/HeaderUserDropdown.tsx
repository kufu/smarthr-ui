import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { Icon } from '../Icon'

type Props = {
  isAdmin: boolean
  isCrew: boolean
  displayName: string
  currentTenantName: string
  avatar: string
  onClickAccount: () => void
  onClickLogout: () => void
  onClickProfile?: () => void
  onClickCompany?: () => void
  onClickSchool?: () => void
}

export const HeaderUserDropdown: FC<Props> = ({
  isAdmin,
  isCrew,
  displayName,
  currentTenantName,
  avatar,
  onClickAccount,
  onClickLogout,
  onClickProfile,
  onClickCompany,
  onClickSchool,
}) => {
  const theme = useTheme()
  return (
    <Dropdown>
      <DropdownTrigger>
        <TriggerButton themes={theme}>
          {avatar && (
            <Avatar
              src={avatar}
              width={20}
              height={20}
              alt={displayName + 'の写真'}
              themes={theme}
            />
          )}
          {displayName}
          <CaretIcon themes={theme} role="presentation">
            <Icon name="fa-caret-down" color="#fff" />
          </CaretIcon>
        </TriggerButton>
      </DropdownTrigger>

      <DropdownContent>
        <MenuList themes={theme} role="menu">
          <MenuListItem role="menuitem">
            <MenuListItemHeader themes={theme}>{displayName}</MenuListItemHeader>
          </MenuListItem>

          {isCrew && (
            <MenuListItem role="menuitem">
              <MenuListItemButton onClick={onClickProfile} themes={theme}>
                <MenuListItemIcon themes={theme}>
                  <Icon name="fa-user-alt" />
                </MenuListItemIcon>
                プロフィールの確認
              </MenuListItemButton>
            </MenuListItem>
          )}

          <MenuListItem role="menuitem">
            <MenuListItemButton onClick={onClickAccount} themes={theme}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-cog" />
              </MenuListItemIcon>
              個人設定
            </MenuListItemButton>
          </MenuListItem>

          {isAdmin && (
            <>
              <MenuListItem role="menuitem">
                <MenuListItemDivider themes={theme} role="separator" />
              </MenuListItem>

              <MenuListItem role="menuitem">
                <MenuListItemHeader themes={theme}>{currentTenantName}</MenuListItemHeader>
              </MenuListItem>

              <MenuListItem role="menuitem">
                <MenuListItemButton onClick={onClickCompany} themes={theme}>
                  <MenuListItemIcon themes={theme}>
                    <Icon name="fa-building" />
                  </MenuListItemIcon>
                  共通設定
                </MenuListItemButton>
              </MenuListItem>
            </>
          )}

          <MenuListItem role="menuitem">
            <MenuListItemDivider themes={theme} role="separator" />
          </MenuListItem>

          {isAdmin && (
            <MenuListItem role="menuitem">
              <MenuListItemButton onClick={onClickSchool} themes={theme}>
                <MenuListItemIcon themes={theme}>
                  <Icon name="fa-graduation-cap" />
                </MenuListItemIcon>
                SmartHR スクール
              </MenuListItemButton>
            </MenuListItem>
          )}

          <MenuListItem role="menuitem">
            <MenuListItemButton onClick={onClickLogout} themes={theme}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-power-off" />
              </MenuListItemIcon>
              ログアウト
            </MenuListItemButton>
          </MenuListItem>
        </MenuList>
      </DropdownContent>
    </Dropdown>
  )
}

const TriggerButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, interaction } = themes

    return css`
      display: flex;
      align-items: center;
      height: 50px;
      margin: 0;
      padding: 0 ${size.pxToRem(10)};
      border: none;
      background: none;
      color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      transition: background-color ${interaction.hover.animation};
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }}
`
const Avatar = styled.img<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      border-radius: 4px;
      margin-right: ${size.pxToRem(size.space.XXS)};
    `
  }};
`
const CaretIcon = styled.figure<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      display: inline-block;
      padding: 0;
      margin: 0 0 0 ${size.pxToRem(size.space.XXS)};
      vertical-align: middle;
    `
  }}
`
const MenuList = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame } = themes

    return css`
      border: ${frame.border.default};
      border-radius: ${frame.border.radius.s};
      background-color: #fff;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      padding: ${size.pxToRem(5)} 0;
    `
  }}
`
const MenuListItem = styled.div`
  margin: 0;
  padding: 0;
`
const MenuListItemIcon = styled.figure<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      display: flex;
      align-items: center;
      padding: 0;
      margin: 0 ${size.pxToRem(size.space.XXS)} 0 0;
    `
  }}
`
const MenuListItemButton = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette, interaction } = themes

    return css`
      display: flex;
      align-items: center;
      width: 100%;
      padding: ${size.pxToRem(3)} ${size.pxToRem(20)};
      border: none;
      background: none;
      color: ${palette.TEXT_BLACK};
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: 1.5;
      white-space: nowrap;
      box-sizing: border-box;
      transition: background-color ${interaction.hover.animation};
      cursor: pointer;

      &:hover {
        background-color: ${palette.OVERLAY};
      }
    `
  }}
`
const MenuListItemHeader = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      padding: ${size.pxToRem(3)} ${size.pxToRem(20)};
      color: ${palette.TEXT_GREY};
      font-size: ${size.pxToRem(size.font.SHORT)};
      line-height: 1.6;
      white-space: nowrap;
    `
  }}
`
const MenuListItemDivider = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame } = themes

    return css`
      padding: 0;
      margin: ${size.pxToRem(10)} 0;
      border-top: ${frame.border.default};
    `
  }}
`
