import React, { ComponentProps, ComponentPropsWithoutRef, FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { OnClick, SideNavItemButton, SideNavSizeType } from './SideNavItemButton'

type SideNavItemButtonProps = Omit<ComponentProps<typeof SideNavItemButton>, 'size' | 'onClick'>

type Props = {
  /** 各アイテムのデータの配列 */
  items: SideNavItemButtonProps[]
  /** 各アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: OnClick
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<ComponentPropsWithoutRef<'ul'>, keyof Props>

const sideNav = tv({
  base: ['smarthr-ui-SideNav', 'shr-list-none shr-bg-column'],
})

export const SideNav: FC<Props & ElementProps> = ({
  items,
  size = 'default',
  onClick,
  className,
  ...props
}) => {
  const styles = useMemo(() => sideNav({ className }), [className])

  return (
    <ul {...props} className={styles}>
      {items.map((item) => (
        <SideNavItemButton
          id={item.id}
          title={item.title}
          prefix={item.prefix}
          isSelected={item.isSelected}
          size={size}
          key={item.id}
          onClick={onClick}
        />
      ))}
    </ul>
  )
}
