import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Dropdown, DropdownContent as DropdownContentComponent, DropdownTrigger } from '../Dropdown'
import { Icon } from '../Icon'

export interface HeaderDropDownProps {
  children?: React.ReactNode
  displayName: string
  currentTenant: string
}

const HeaderUserDropDownComponent: React.FC<HeaderDropDownProps & InjectedProps> = ({
  displayName,
  currentTenant,
  theme,
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <ButtonWrapper theme={theme}>
          {displayName}
          <HeaderDropDownCaret key="headerDropDownCaret" theme={theme} role="presentation">
            <Icon name="fa-caret-down" color="#fff" />
          </HeaderDropDownCaret>
        </ButtonWrapper>
      </DropdownTrigger>

      <DropdownContent>
        <MenuList theme={theme} role="menu">
          <MenuListItem role="menuitem">
            <MenuListItemHeader theme={theme}>{displayName}</MenuListItemHeader>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme}>
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-cog" />
              </MenuListItemIcon>
              個人設定
            </MenuListItemAnchor>
          </MenuListItem>

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

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme} target="_blank">
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-graduation-cap" />
              </MenuListItemIcon>
              SmartHR スクール
            </MenuListItemAnchor>
          </MenuListItem>

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

const ButtonWrapper: any = styled.button`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
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
const HeaderDropDownCaret: any = styled.figure`
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
const MenuList: any = styled.div`
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
const MenuListItem: any = styled.div`
  margin: 0;
  padding: 0;
`
const MenuListItemIcon: any = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      align-items: center;
      padding: 0;
      margin: 0 ${theme.size.pxToRem(theme.size.space.XXS)} 0 0;
    `
  }}
`
const MenuListItemAnchor: any = styled.a`
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
const MenuListItemHeader: any = styled.div`
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
const MenuListItemDivider: any = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      padding: 0;
      margin: ${theme.size.pxToRem(10)} 0;
      border-top: 1px solid ${theme.palette.BORDER};
    `
  }}
`
