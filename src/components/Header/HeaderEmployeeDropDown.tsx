import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { Dropdown, DropdownContent as DropdownContentComponent, DropdownTrigger } from '../Dropdown'
import { Icon } from '../Icon'

export interface HeaderEmployeeDropDownProps {
  crewsNewUrl: string
  crewsBulkInserterUrl: string
  crewsBulkUpdaterUrl: string
  crewsInviterUrl: string
}

const HeaderEmployeeDropDownComponent: React.FC<HeaderEmployeeDropDownProps & InjectedProps> = ({
  crewsNewUrl,
  crewsBulkInserterUrl,
  crewsBulkUpdaterUrl,
  crewsInviterUrl,
  theme,
}) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <ButtonWrapper theme={theme}>
          <HeaderDropDownIcon key="headerDropDownIcon" theme={theme} role="presentation">
            <Icon name="fa-users" />
          </HeaderDropDownIcon>
          従業員管理
          <HeaderDropDownCaret key="headerDropDownCaret" theme={theme} role="presentation">
            <Icon name="fa-caret-down" color="#fff" />
          </HeaderDropDownCaret>
        </ButtonWrapper>
      </DropdownTrigger>

      <DropdownContent>
        <MenuList theme={theme} role="menu">
          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme} href={crewsNewUrl}>
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-edit" />
              </MenuListItemIcon>
              新規登録する（手入力）
            </MenuListItemAnchor>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme} href={crewsBulkInserterUrl}>
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-reg-plus-square" />
              </MenuListItemIcon>
              新規登録する（ファイル）
            </MenuListItemAnchor>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme} href={crewsBulkUpdaterUrl}>
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-sync-alt" />
              </MenuListItemIcon>
              更新する（ファイル）
            </MenuListItemAnchor>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemDivider theme={theme} role="separator" />
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor theme={theme} href={crewsInviterUrl}>
              <MenuListItemIcon theme={theme}>
                <Icon name="fa-paper-plane" />
              </MenuListItemIcon>
              SmartHR に招待
            </MenuListItemAnchor>
          </MenuListItem>
        </MenuList>
      </DropdownContent>
    </Dropdown>
  )
}

export const HeaderEmployeeDropDown = withTheme(HeaderEmployeeDropDownComponent)

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
const HeaderDropDownIcon: any = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      padding: 0;
      margin: 0 ${theme.size.pxToRem(theme.size.space.XXS)} 0 0;
      vertical-align: middle;
    `
  }}
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
const MenuListItemDivider = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      padding: 0;
      margin: ${theme.size.pxToRem(10)} 0;
      border-top: 1px solid ${theme.palette.BORDER};
    `
  }}
`
