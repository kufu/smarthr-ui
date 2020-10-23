import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Icon, Props as IconProps } from '../Icon/Icon'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  icon: IconProps['name']
  children: ReactNode
  onClick?: () => void
}

export const HeaderButton: FC<Props> = ({ icon, children, onClick }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme} onClick={onClick} type="button">
      {icon && (
        <IconWrapper themes={theme} role="presentation">
          <Icon name={icon}></Icon>
        </IconWrapper>
      )}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.button<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, interaction } = themes

    return css`
      display: inline-block;
      margin: 0;
      padding: 0 ${size.pxToRem(10)};
      border: none;
      background: none;
      color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: 50px;
      transition: background-color ${interaction.hover.animation};
      cursor: pointer;

      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    `
  }}
`
const IconWrapper = styled.figure<{ themes: Theme }>`
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
