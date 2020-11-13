import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { SideNavItem, SideNavItemProps } from './SideNavItem'

type Props = {
  items: SideNavItemProps[]
  size?: 'default' | 's'
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void
}

export const SideNav: FC<Props> = ({ items, size = 'default', onClick }) => {
  const theme = useTheme()
  const SideNavButtonClassName = `${size}`

  return (
    <Wrapper themes={theme}>
      {items.map((item) => (
        <SideNavItem
          id={item.id}
          title={item.title}
          prefix={item.prefix}
          isSelected={item.isSelected}
          className={SideNavButtonClassName}
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
