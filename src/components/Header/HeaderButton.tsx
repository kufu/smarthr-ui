import * as React from 'react'
import styled, { css } from 'styled-components'

import { Icon, Props as IconProps } from '../Icon/Icon'

import { useTheme, Theme } from '../../hooks/useTheme'

export interface HeaderButtonProps {
  children?: React.ReactNode
  url?: string
  target?: string
  icon?: IconProps['name']
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({ ...props }) => {
  const theme = useTheme()
  return (
    <Wrapper themes={theme} href={props.url} target={props.target && props.target}>
      {props.icon && (
        <HeaderButtonIcon themes={theme} role="presentation">
          <Icon name={props.icon}></Icon>
        </HeaderButtonIcon>
      )}
      {props.children && props.children}
    </Wrapper>
  )
}

const Wrapper: any = styled.a<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, interaction } = themes
    return css`
      display: block;
      margin: 0;
      padding: 0 ${size.pxToRem(10)};
      color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      text-decoration: none;
      line-height: ${size.pxToRem(50)};
      transition: background-color ${interaction.hover.animation};

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }}
`

const HeaderButtonIcon: any = styled.figure<{ themes: Theme }>`
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
