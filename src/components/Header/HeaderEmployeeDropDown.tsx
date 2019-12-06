import * as React from 'react'
import styled, { css } from 'styled-components'

import { Dropdown, DropdownContent as DropdownContentComponent, DropdownTrigger } from '../Dropdown'
import { Icon } from '../Icon'
import { useTheme, Theme } from '../../hooks/useTheme'

export interface HeaderEmployeeDropDownProps {
  crewsNewUrl: string
  crewsBulkInserterUrl: string
  crewsBulkUpdaterUrl: string
  crewsInviterUrl: string
}

export const HeaderEmployeeDropDown: React.FC<HeaderEmployeeDropDownProps> = ({
  crewsNewUrl,
  crewsBulkInserterUrl,
  crewsBulkUpdaterUrl,
  crewsInviterUrl,
}) => {
  const theme = useTheme()
  return (
    <Dropdown>
      <DropdownTrigger>
        <ButtonWrapper themes={theme}>
          <HeaderDropDownIcon key="headerDropDownIcon" themes={theme} role="presentation">
            <Icon name="fa-users" />
          </HeaderDropDownIcon>
          従業員管理
          <HeaderDropDownCaret key="headerDropDownCaret" themes={theme} role="presentation">
            <Icon name="fa-caret-down" color="#fff" />
          </HeaderDropDownCaret>
        </ButtonWrapper>
      </DropdownTrigger>

      <DropdownContent>
        <MenuList themes={theme} role="menu">
          <MenuListItem role="menuitem">
            <MenuListItemAnchor themes={theme} href={crewsNewUrl}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-edit" />
              </MenuListItemIcon>
              新規登録する（手入力）
            </MenuListItemAnchor>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor themes={theme} href={crewsBulkInserterUrl}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-reg-plus-square" />
              </MenuListItemIcon>
              新規登録する（ファイル）
            </MenuListItemAnchor>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor themes={theme} href={crewsBulkUpdaterUrl}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-sync-alt" />
              </MenuListItemIcon>
              更新する（ファイル）
            </MenuListItemAnchor>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemDivider themes={theme} role="separator" />
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemAnchor themes={theme} href={crewsInviterUrl}>
              <MenuListItemIcon themes={theme}>
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
const HeaderDropDownIcon: any = styled.figure<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      display: inline-block;
      padding: 0;
      margin: 0 ${size.pxToRem(size.space.XXS)} 0 0;
      vertical-align: middle;
    `
  }}
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
