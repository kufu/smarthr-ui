import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Dropdown, DropdownContent as DropdownContentComponent, DropdownTrigger } from '../Dropdown'
import { Icon } from '../Icon'

export interface HeaderDropDownProps {
  displayName: string
  currentTenant: string
  avatar?: string
  isAdmin?: boolean
}

const HeaderUserDropDownComponent: React.FC<HeaderDropDownProps & InjectedProps> = ({
  displayName,
  currentTenant,
  avatar,
  isAdmin = false,
  theme,
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <ButtonWrapper theme={theme}>
          {avatar && <Avatar src={avatar} theme={theme} />}
          {displayName}
          <HeaderDropDownCaret key="headerDropDownCaret" theme={theme} role="presentation">
            <Icon name="fa-caret-down" color="#fff" />
          </HeaderDropDownCaret>
        </ButtonWrapper>
      </DropdownTrigger>

      <DropdownContent>
        <MenuList theme={theme} role="menu">
          {!isAdmin && (
            <MenuListItem role="menuitem">
              <MenuListItemHeader theme={theme}>{displayName}</MenuListItemHeader>
            </MenuListItem>
          )}
          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme}>
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-user-alt" />
              </MenuListItemIcon>
              プロフィールの確認
            </MenuListItemAnchor>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme}>
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-cog" />
              </MenuListItemIcon>
              個人設定
            </MenuListItemAnchor>
          </MenuListItem>

          {isAdmin && (
            <>
              <MenuListItem role="menuitem">
                <MenuListItemDivider theme={theme} role="separator" />
              </MenuListItem>

              <MenuListItem role="menuitem">
                <MenuListItemHeader theme={theme}>{currentTenant}</MenuListItemHeader>
              </MenuListItem>

              <MenuListItem role="menuitem">
                <MenuListItemAnchor theme={theme}>
                  <MenuListItemIcon theme={theme}>
                    <Icon name="fa-building" />
                  </MenuListItemIcon>
                  共通設定
                </MenuListItemAnchor>
              </MenuListItem>
            </>
          )}
          <MenuListItem role="menuitem">
            <MenuListItemDivider theme={theme} role="separator" />
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme} target="_blank">
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-question-circle" />
              </MenuListItemIcon>
              ヘルプ
            </MenuListItemAnchor>
          </MenuListItem>

          {isAdmin && (
            <MenuListItem role="menuitem">
              <MenuListItemAnchor theme={theme} target="_blank">
                <MenuListItemIcon theme={theme}>
                  <Icon name="fa-graduation-cap" />
                </MenuListItemIcon>
                SmartHR スクール
              </MenuListItemAnchor>
            </MenuListItem>
          )}

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme}>
              <MenuListItemIcon theme={theme}>
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

export const HeaderUserDropDown = withTheme(HeaderUserDropDownComponent)

const ButtonWrapper = styled.button`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0 ${theme.size.pxToRem(10)};
      border: none;
      background: initial;
      color: #fff;
      font-size: ${theme.size.pxToRem(theme.size.font.TALL)};
      text-decoration: none;
      line-height: ${theme.size.pxToRem(50)};
      transition: background-color 0.3s;
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }}
`
const Avatar = styled.img`
  ${({ theme }: InjectedProps) => {
    return css`
      border-radius: ${theme.frame.border.radius.m};
      margin-right: ${theme.size.space.XXS}px;
    `
  }};
`
const HeaderDropDownCaret = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      padding: 0;
      margin: 0 0 0 ${theme.size.pxToRem(theme.size.space.XXS)};
      vertical-align: middle;
    `
  }}
`
const DropdownContent = styled(DropdownContentComponent)`
  transition: none;
`
const MenuList = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      border: 1px solid ${theme.palette.BORDER};
      border-radius: ${theme.size.pxToRem(3)};
      background-color: #ffffff;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      padding: ${theme.size.pxToRem(5)} 0;
    `
  }}
`
const MenuListItem = styled.div`
  margin: 0;
  padding: 0;
`
const MenuListItemIcon = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      padding: 0;
      margin: 0 ${theme.size.pxToRem(theme.size.space.XXS)} 0 0;
    `
  }}
`
const MenuListItemAnchor = styled.a`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      padding: ${theme.size.pxToRem(3)} ${theme.size.pxToRem(20)};
      color: ${theme.palette.TEXT_BLACK};
      font-size: ${theme.size.pxToRem(theme.size.font.TALL)}
      text-decoration: none;
      white-space: nowrap;
      transition: background-color 0.3s;

      &:hover{
        background-color: ${theme.palette.OVERLAY};
      }
    `
  }}
`
const MenuListItemHeader = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      padding: ${theme.size.pxToRem(3)} ${theme.size.pxToRem(20)};
      color: ${theme.palette.TEXT_GREY};
      font-size: ${theme.size.pxToRem(theme.size.font.SHORT)}
      line-height: 1.6;
      white-space: nowrap;
    `
  }}
`
const MenuListItemDivider = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      padding: 0;
      margin: ${theme.size.pxToRem(10)} 0;
      border-top: 1px solid ${theme.palette.BORDER};
    `
  }}
`
