import * as React from 'react'
import styled, { css } from 'styled-components'

import { Dropdown, DropdownContent as DropdownContentComponent, DropdownTrigger } from '../Dropdown'
import { Icon } from '../Icon'
import { useTheme, Theme } from '../../hooks/useTheme'

export type HeaderUserDropDownProps = {
  displayName: string
  currentTenant: string
  avatar?: string
  isAdmin?: boolean
  profileUrl: string
  myAccountUrl: string
  adminCompanyUrl: string
  schoolUrl: string
}

export const HeaderUserDropDown: React.FC<HeaderUserDropDownProps> = ({
  displayName,
  currentTenant,
  avatar,
  isAdmin = false,
}) => {
  const theme = useTheme()
  return (
    <Dropdown>
      <DropdownTrigger>
        <ButtonWrapper themes={theme}>
          {avatar && <Avatar src={avatar} themes={theme} alt={displayName + 'の写真'} />}
          {displayName}
          <HeaderDropDownCaret key="headerDropDownCaret" themes={theme} role="presentation">
            <Icon name="fa-caret-down" color="#fff" />
          </HeaderDropDownCaret>
        </ButtonWrapper>
      </DropdownTrigger>

      <DropdownContent>
        <MenuList themes={theme} role="menu">
          <MenuListItem role="menuitem">
            <MenuListItemHeader themes={theme}>{displayName}</MenuListItemHeader>
          </MenuListItem>

          {!isAdmin && (
            <MenuListItem role="menuitem">
              <MenuListItemAnchor themes={theme}>
                <MenuListItemIcon themes={theme}>
                  <Icon name="fa-user-alt" />
                </MenuListItemIcon>
                プロフィールの確認
              </MenuListItemAnchor>
            </MenuListItem>
          )}

          <MenuListItem role="menuitem">
            <MenuListItemAnchor themes={theme}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-cog" />
              </MenuListItemIcon>
              個人設定
            </MenuListItemAnchor>
          </MenuListItem>

          {isAdmin && (
            <>
              <MenuListItem role="menuitem">
                <MenuListItemDivider themes={theme} role="separator" />
              </MenuListItem>

              <MenuListItem role="menuitem">
                <MenuListItemHeader themes={theme}>{currentTenant}</MenuListItemHeader>
              </MenuListItem>

              <MenuListItem role="menuitem">
                <MenuListItemAnchor themes={theme}>
                  <MenuListItemIcon themes={theme}>
                    <Icon name="fa-building" />
                  </MenuListItemIcon>
                  共通設定
                </MenuListItemAnchor>
              </MenuListItem>
            </>
          )}
          <MenuListItem role="menuitem">
            <MenuListItemDivider themes={theme} role="separator" />
          </MenuListItem>

          {isAdmin && (
            <MenuListItem role="menuitem">
              <MenuListItemAnchor themes={theme} target="_blank">
                <MenuListItemIcon themes={theme}>
                  <Icon name="fa-graduation-cap" />
                </MenuListItemIcon>
                SmartHR スクール
              </MenuListItemAnchor>
            </MenuListItem>
          )}

          <MenuListItem role="menuitem">
            <MenuListItemAnchor themes={theme}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-power-off" />
              </MenuListItemIcon>
              ログアウト
            </MenuListItemAnchor>
          </MenuListItem>
        </MenuList>
      </DropdownContent>
    </Dropdown>
  )
}

const ButtonWrapper = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0 ${size.pxToRem(10)};
      border: none;
      background: initial;
      color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      text-decoration: none;
      line-height: ${size.pxToRem(50)};
      transition: background-color 0.3s;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }}
`
const Avatar = styled.img<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, frame } = themes

    return css`
      border-radius: ${frame.border.radius.m};
      margin-right: ${size.space.XXS}px;
    `
  }};
`
const HeaderDropDownCaret = styled.figure<{ themes: Theme }>`
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
const DropdownContent = styled(DropdownContentComponent)`
  transition: none;
`
const MenuList = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      border: 1px solid ${palette.BORDER};
      border-radius: ${size.pxToRem(3)};
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
const MenuListItemAnchor = styled.a<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      display: flex;
      align-items: center;
      padding: ${size.pxToRem(3)} ${size.pxToRem(20)};
      color: ${palette.TEXT_BLACK};
      font-size: ${size.pxToRem(size.font.TALL)}
      text-decoration: none;
      white-space: nowrap;
      transition: background-color 0.3s;

      &:hover{
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
      font-size: ${size.pxToRem(size.font.SHORT)}
      line-height: 1.6;
      white-space: nowrap;
    `
  }}
`
const MenuListItemDivider = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      padding: 0;
      margin: ${size.pxToRem(10)} 0;
      border-top: 1px solid ${palette.BORDER};
    `
  }}
`
