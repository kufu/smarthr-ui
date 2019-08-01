import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

export interface HeaderButtonProps {
  children?: React.ReactNode
  url?: string
  target?: '_self' | '_blank'
  icon?: React.ReactNode
}

const HeaderButtonComponent: React.FC<HeaderButtonProps & InjectedProps> = ({
  theme,
  ...props
}) => (
  <Wrapper theme={theme} href={props.url} target={props.target}>
    {props.icon && (
      <HeaderButtonIcon theme={theme} role="presentation">
        {props.icon}
      </HeaderButtonIcon>
    )}
    {props.children}
    {/* {props.menus && CreateDropDownMenu(props.menus, theme)} */}
  </Wrapper>
)

// function CreateDropDownMenu(menus: Array<MenuProps>, theme: InjectedProps) {
//   return (
//     <DropDownMenu theme={theme}>
//       {menus &&
//         menus.map(menu => (
//           <li key={`pagination-${menu}`}>
//             <a href={menu.menu_url}>
//               {menu.menu_icon && <figure>{menu.menu_icon}</figure>}
//               {menu.menu_title}
//             </a>
//           </li>
//         ))}
//     </DropDownMenu>
//   )
// }

export const HeaderButton = withTheme(HeaderButtonComponent)

const Wrapper: any = styled.a`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      margin: 0;
      padding: 0 ${theme.size.pxToRem(10)};
      color: ${theme.palette.White};
      font-size: ${theme.size.pxToRem(theme.size.font.tall)};
      text-decoration: none;
      line-height: ${theme.size.pxToRem(50)};
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }}
`

const HeaderButtonIcon: any = styled.figure`
  ${({ theme }: InjectedProps) => {
    return css`
      display: inline-block;
      padding: 0;
      margin: 0 ${theme.size.pxToRem(theme.size.space.xxs)} 0 0;
      vertical-align: middle;
    `
  }}
`

// const DropDownMenu: any = styled.a`
//   ${({ theme }: InjectedProps) => {
//     const { palette, size } = theme

//     return css`
//       display: block;
//       margin: 0;
//       padding: 0 10px;
//       color: ${palette.White};
//       font-size: ${size.font.tall};
//       text-decoration: none;
//       line-height: 50px;
//       transition: background-color 0.3s;
//     `
//   }}
// `
