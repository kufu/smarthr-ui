import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { SmartHRLogo } from '../SmartHRLogo/SmartHRLogo'
import { HeaderButton, HeaderButtonProps } from './HeaderButton'
import { HeaderDropDown, HeaderDropDownProps } from './HeaderDropDown'
import {
  FaQuestionCircle,
  FaThList,
  FaUser,
  FaEdit,
  FaRegPlusSquare,
  FaSyncAlt,
} from 'react-icons/fa'

interface Props {
  tenantName?: string
  logoUrl?: string
  buttons?: ButtonProps[]
}

interface ButtonProps extends HeaderButtonProps, HeaderDropDownProps {
  buttonType: 'anchor' | 'dropdown'
}

const DropDownSample = [
  {
    title: '新規登録する（手入力）',
    url: '#menu1',
    icon: <FaEdit />,
  },
  {
    title: '新規登録する（ファイル）',
    url: '#menu2',
    icon: <FaRegPlusSquare />,
  },
  {
    title: '更新する（ファイル）',
    url: '#menu3',
    icon: <FaSyncAlt />,
  },
]

const HeaderComponent: React.FC<Props> = ({ ...props }) => (
  <Wrapper {...props}>
    <HeaderLogoArea>
      <HeaderLogo href={props.logoUrl ? props.logoUrl : '/'} aria-label="SmartHR">
        <SmartHRLogo />
      </HeaderLogo>
      <TenantName {...props}>{props.tenantName}</TenantName>
    </HeaderLogoArea>

    <HeaderAreaNavi>
      <HeaderButton url="#" icon={<FaQuestionCircle />}>
        ヘルプ
      </HeaderButton>
      <HeaderButton url="#" icon={<FaThList />}>
        従業員リスト
      </HeaderButton>
      <HeaderDropDown icon={<FaUser />} menus={DropDownSample}>
        従業員管理
      </HeaderDropDown>
      <HeaderDropDown menus={DropDownSample}>test@smarthr.co.jp</HeaderDropDown>
    </HeaderAreaNavi>
  </Wrapper>
)

export const Header = withTheme(HeaderComponent)

const Wrapper: any = styled.header`
  ${({ theme }: InjectedProps) => {
    return css`
      display: flex;
      height: ${theme.size.pxToRem(50)};
      padding: 0 ${theme.size.pxToRem(theme.size.space.xs)};
      background-color: ${theme.palette.Hanica_Green};
      box-sizing: border-box;
      position: relative;
      align-items: center;
      justify-content: space-between;
    `
  }}
`

const HeaderLogoArea: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HeaderLogo: any = styled.a`
  display: block;
  padding: 0;
  box-sizing: border-box;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`

const TenantName: any = styled.span`
  ${({ theme }: InjectedProps) => {
    return css`
      display: block;
      margin-left: ${theme.size.space.xs}px;
      color: ${theme.palette.White};
    `
  }}
`

const HeaderAreaNavi: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
