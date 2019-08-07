import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { FaCaretDown } from 'react-icons/fa'
import { getParentElementRecursively } from '../Dropdown/helper'

export interface HeaderDropDownProps {
  children?: React.ReactNode
  icon?: React.ReactNode
  menus?: HeaderDropDownMenuProps[]
  dropDownKey: string
}

export interface HeaderDropDownMenuProps {
  type: 'link' | 'header' | 'divider'
  icon?: React.ReactNode
  title?: string
  url?: string
  target?: string
}

const HeaderDropDownComponent: React.FC<HeaderDropDownProps & InjectedProps> = ({
  theme,
  ...props
}) => {
  const [opened, setOpened] = React.useState(false)

  React.useEffect(() => {
    document.body.addEventListener('click', handleClickBody as any)
    return () => {
      document.body.removeEventListener('click', handleClickBody as any)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickBody = (e: { target: HTMLElement }) => {
    if (getParentElementRecursively(e.target, props.dropDownKey)) return
    setOpened(false)
  }

  const handleToggleOpen = () => setOpened(!opened)

  return (
    <Wrapper className={props.dropDownKey}>
      <ButtonWrapper
        onClick={handleToggleOpen}
        theme={theme}
        open={opened}
        aria-expanded={opened}
        alia-line="polite"
      >
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

      <MenuWrapper theme={theme} open={opened} role="menu">
        {props.menus && (
          <MenuList theme={theme}>
            {props.menus.map(menu => (
              <MenuListItem key={menu.title} role="menuitem">
                {menu.type === 'link' ? (
                  <MenuListItemAnchor
                    theme={theme}
                    href={menu.url}
                    target={menu.target && menu.target}
                  >
                    {menu.icon && <MenuListItemIcon theme={theme}>{menu.icon}</MenuListItemIcon>}
                    {menu.title}
                  </MenuListItemAnchor>
                ) : menu.type === 'header' ? (
                  <MenuListItemHeader key={menu.title} theme={theme}>
                    {menu.title}
                  </MenuListItemHeader>
                ) : (
                  <MenuListItemDivider key={menu.title} theme={theme} role="separator" />
                )}
              </MenuListItem>
            ))}
          </MenuList>
        )}
      </MenuWrapper>
    </Wrapper>
  )
}

export const HeaderDropDown = withTheme(HeaderDropDownComponent)

const Wrapper: any = styled.div`
  position: relative;
  overflow: visible;
`

const ButtonWrapper: any = styled.button`
  ${({ theme, open }: InjectedProps & { open: boolean }) => {
    return css`
      display: block;
      margin: 0;
      padding: 0 ${theme.size.pxToRem(10)};
      border: none;
      background: ${open ? 'rgba(255, 255, 255, 0.3)' : 'none'};
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
  ${({ theme, open }: InjectedProps & { open: boolean }) => {
    return css`
      display: ${open ? 'block' : 'none'};
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

const MenuList: any = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      margin: 0;
      padding: ${theme.size.pxToRem(5)} 0;
    `
  }}
`

const MenuListItem: any = styled.div`
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

const MenuListItemHeader: any = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      padding: ${theme.size.pxToRem(3)} ${theme.size.pxToRem(20)};
      color: ${theme.palette.TextGrey};
      font-size: ${theme.size.pxToRem(theme.size.font.tasting)}
      line-height: 1.6;
      white-space: nowrap;
    `
  }}
`

const MenuListItemDivider: any = styled.div`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      padding: 0;
      margin: ${theme.size.pxToRem(10)} 0;
      border-top: 1px solid ${theme.palette.Border};
    `
  }}
`
