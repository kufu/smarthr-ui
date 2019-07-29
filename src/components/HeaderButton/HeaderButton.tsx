import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

export interface HeaderButtonProps {
  children?: React.ReactNode
  url?: string
  target?: '_self' | '_blank'
  icon?: React.ReactNode
}

const HeaderButtonComponent: React.StatelessComponent<HeaderButtonProps & InjectedProps> = ({
  theme,
  ...props
}) => (
  <Wrapper theme={theme} href={props.url} target={props.target}>
    {props.icon && <figure className="header-button__icon">{props.icon}</figure>}
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
    const { palette, size } = theme

    return css`
      display: block;
      margin: 0;
      padding: 0 10px;
      color: ${palette.White};
      font-size: ${size.font.tall}px;
      text-decoration: none;
      line-height: 50px;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      & .header-button__icon {
        display: inline-block;
        padding: 0;
        margin: 0 ${size.space.xxs}px 0 0;
      }
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
