import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { Icon } from '../Icon'

type Props = {
  onClickNew?: () => void
  onClickBulkInsert?: () => void
  onClickBulkUpdate?: () => void
  onClickInvite?: () => void
}

export const HeaderCrewDropdown: FC<Props> = ({
  onClickNew,
  onClickBulkInsert,
  onClickBulkUpdate,
  onClickInvite,
}) => {
  const theme = useTheme()

  return (
    <Dropdown>
      <DropdownTrigger>
        <TriggerButton themes={theme}>
          <TriggerIcon themes={theme} role="presentation">
            <Icon name="fa-users" />
          </TriggerIcon>
          従業員管理
          <CaretIcon themes={theme} role="presentation">
            <Icon name="fa-caret-down" color="#fff" />
          </CaretIcon>
        </TriggerButton>
      </DropdownTrigger>

      <DropdownContent>
        <MenuList themes={theme} role="menu">
          <MenuListItem role="menuitem">
            <MenuListItemButon themes={theme} onClick={onClickNew}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-edit" />
              </MenuListItemIcon>
              新規登録する（手入力）
            </MenuListItemButon>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemButon themes={theme} onClick={onClickBulkInsert}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-plus-square" />
              </MenuListItemIcon>
              新規登録する（ファイル）
            </MenuListItemButon>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemButon themes={theme} onClick={onClickBulkUpdate}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-sync-alt" />
              </MenuListItemIcon>
              更新する（ファイル）
            </MenuListItemButon>
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemDivider themes={theme} role="separator" />
          </MenuListItem>

          <MenuListItem role="menuitem">
            <MenuListItemButon themes={theme} onClick={onClickInvite}>
              <MenuListItemIcon themes={theme}>
                <Icon name="fa-paper-plane" />
              </MenuListItemIcon>
              SmartHR に招待
            </MenuListItemButon>
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
const TriggerIcon = styled.figure<{ themes: Theme }>`
  ${({ themes }) => {
    const { size } = themes

    return css`
      display: inline-block;
      height: 14px;
      padding: 0;
      margin: 0 ${size.pxToRem(size.space.XXS)} 0 0;
      vertical-align: middle;
    `
  }}
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
const MenuListItemButon = styled.button<{ themes: Theme }>`
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
