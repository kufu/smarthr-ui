import React, { ComponentProps, HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { OnClick, SideNavItem, SideNavSizeType } from './SideNavItem'
import { useClassNames } from './useClassNames'

type SideNavItemProps = Omit<ComponentProps<typeof SideNavItem>, 'size' | 'onClick'>

type Props = {
  /** 各アイテムのデータの配列 */
  items: SideNavItemProps[]
  /** 各アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: OnClick
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLUListElement>, keyof Props>

export const SideNav: VFC<Props & ElementProps> = ({
  items,
  size = 'default',
  onClick,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper {...props} themes={theme} className={`${className} ${classNames.wrapper}`}>
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
    const { color } = themes

    return css`
      background-color: ${color.COLUMN};
      list-style: none;
      padding: 0;
    `
  }}
`
