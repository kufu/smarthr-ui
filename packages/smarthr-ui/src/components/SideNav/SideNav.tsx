import React, { ComponentProps, ComponentPropsWithoutRef, FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { OnClick, SideNavItemButton, SideNavSizeType } from './SideNavItemButton'

export type SideNavItemButtonProps = Omit<
  ComponentProps<typeof SideNavItemButton>,
  'size' | 'onClick'
>

type Props = {
  /** 各アイテムのデータの配列
   * @deprecated SideNavItemButton を使ってください
   */
  items?: SideNavItemButtonProps[]
  /** 各アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: OnClick
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
  children,
  ...props
}) => {
  const styles = useMemo(() => sideNav({ className }), [className])

  return (
    <ul {...props} className={styles}>
      {items &&
        items.map((item) => (
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
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as ComponentPropsWithoutRef<typeof SideNavItemButton>

          return React.cloneElement(
            child as React.ReactElement<ComponentProps<typeof SideNavItemButton>>,
            {
              size,
              ...(childProps.onClick ? {} : { onClick }),
            },
          )
        }
        return child
      })}
    </ul>
  )
}
