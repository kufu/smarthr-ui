import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Icon as DuplicatedIcon, IconNames, ComponentProps as IconProps } from '../Icon/Icon'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  icon: IconNames | React.ComponentType<IconProps>
  children: ReactNode
  onClick?: () => void
}

export const HeaderButton: VFC<Props> = ({ icon: Icon, children, onClick }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme} onClick={onClick} type="button">
      <IconWrapper themes={theme} role="presentation">
        {typeof Icon === 'string' ? <DuplicatedIcon name={Icon}></DuplicatedIcon> : <Icon />}
      </IconWrapper>
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
const IconWrapper = styled.span<{ themes: Theme }>`
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
