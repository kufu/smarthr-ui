import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { OnClick, SideNavItem, SideNavItemProps, SideNavSizeType } from './SideNavItem'

type Props = {
  items: SideNavItemProps[]
  size?: SideNavSizeType
  onClick?: OnClick
}

export const SideNav: FC<Props> = ({ items, size = 'default', onClick }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      {items.map((item) => (
        <SideNavItem
          id={item.id}
          title={item.title}
          prefix={item.prefix}
          isSelected={item.isSelected}
          size={size}
          key={item.id}
          onClick={onClick}
        />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette } = themes

    return css`
      background-color: ${palette.COLUMN};
      list-style: none;
      padding: 0;
    `
  }}
`
