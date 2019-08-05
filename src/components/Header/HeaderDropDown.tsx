import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { FaCaretDown } from 'react-icons/fa'

export interface HeaderDropDownProps {
  children?: React.ReactNode
  icon?: React.ReactNode
  menus?: HeaderDropDownMenuProps[]
}

export interface HeaderDropDownMenuProps {
  icon?: React.ReactNode
  title: string
  url: string
}

const HeaderDropDownComponent: React.FC<HeaderDropDownProps & InjectedProps> = ({
  theme,
  ...props
}) => (
  <Wrapper>
    <ButtonWrapper theme={theme}>
      {props.icon && (
        <HeaderDropDownIcon theme={theme} role="presentation">
          {props.icon}
        </HeaderDropDownIcon>
      )}
      {props.children}
      <HeaderDropDownCaret theme={theme} role="presentation">
        <FaCaretDown />
      </HeaderDropDownCaret>
    </ButtonWrapper>

    <MenuWrapper theme={theme}>
      {props.menus && (
        <MenuList theme={theme}>
          {props.menus.map(menu => (
            <MenuListItem key={menu.title}>
              <MenuListItemAnchor theme={theme} href={menu.url}>
                {menu.icon && <MenuListItemIcon theme={theme}>{menu.icon}</MenuListItemIcon>}
                {menu.title}
              </MenuListItemAnchor>
            </MenuListItem>
          ))}
        </MenuList>
      )}
    </MenuWrapper>
  </Wrapper>
)

export const HeaderDropDown = withTheme(HeaderDropDownComponent)

const Wrapper: any = styled.div`
  position: relative;
  overflow: visible;
`

const ButtonWrapper: any = styled.button`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      margin: 0;
      padding: 0 ${theme.size.pxToRem(10)};
      border: none;
      background: none;
      color: #ffffff;
      font-size: ${theme.size.pxToRem(theme.size.font.tall)};
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
      margin: 0 ${theme.size.pxToRem(theme.size.space.xxs)} 0 0;
      vertical-align: middle;
    `
  }}
`

const HeaderDropDownCaret: any = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      padding: 0;
      margin: 0 0 0 ${theme.size.pxToRem(theme.size.space.xxs)};
      vertical-align: middle;
    `
  }}
`

const MenuWrapper: any = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      border: 1px solid ${theme.palette.Border};
      border-radius: ${theme.size.pxToRem(3)};
      background-color: #ffffff;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      position: absolute;
      top: 100%;
      right: 0;
    `
  }}
`

const MenuList: any = styled.ul`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      margin: 0;
      padding: ${theme.size.pxToRem(5)} 0;
    `
  }}
`

const MenuListItem: any = styled.li`
  display: block;
  margin: 0;
  padding: 0;
`

const MenuListItemIcon: any = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      padding: 0;
      margin: 0 ${theme.size.pxToRem(theme.size.space.xxs)} 0 0;
      vertical-align: middle;
    `
  }}
`

const MenuListItemAnchor: any = styled.a`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      padding: ${theme.size.pxToRem(3)} ${theme.size.pxToRem(20)};
      color: ${theme.palette.TextBlack};
      font-size: ${theme.size.pxToRem(theme.size.font.tall)}
      text-decoration: none;
      white-space: nowrap;
      transition: background-color 0.3s;

      &:hover{
        background-color: ${theme.palette.Overlay};
      }
    `
  }}
`
