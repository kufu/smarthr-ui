import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react'
import { Children, cloneElement } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { SideNavItemButton, type SideNavSizeType } from './SideNavItemButton'

export type SideNavItemButtonProps = Omit<
  ComponentProps<typeof SideNavItemButton>,
  'size' | 'onClick'
>

type AbstractProps = PropsWithChildren<{
  /** 各アイテムのデータの配列
   * @deprecated SideNavItemButton を使ってください
   */
  items?: SideNavItemButtonProps[]
  /** 各アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
    id: string,
  ) => void
  /** コンポーネントに適用するクラス名 */
  className?: string
}> &
  VariantProps<typeof classNameGenerator>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'ul'>, keyof AbstractProps>

const ROUNDED = {
  t_l: '[&>.smarthr-ui-SideNav-item:first-child]:shr-rounded-tl-l',
  t_r: '[&>.smarthr-ui-SideNav-item:first-child]:shr-rounded-tr-l',
  b_l: '[&>.smarthr-ui-SideNav-item:last-child]:shr-rounded-bl-l',
  b_r: '[&>.smarthr-ui-SideNav-item:last-child]:shr-rounded-br-l',
}
const ROUNDED_ALL = ['shr-rounded-l', ROUNDED.t_l, ROUNDED.t_r, ROUNDED.b_l, ROUNDED.b_r]

const classNameGenerator = tv({
  base: ['smarthr-ui-SideNav', 'shr-list-none shr-bg-column'],
  variants: {
    rounded: {
      true: ROUNDED_ALL,
      all: ROUNDED_ALL,
      top: ['shr-rounded-t-l', ROUNDED.t_l, ROUNDED.t_r],
      right: ['shr-rounded-r-l', ROUNDED.t_r, ROUNDED.b_r],
      bottom: ['shr-rounded-b-l', ROUNDED.b_l, ROUNDED.b_r],
      left: ['shr-rounded-l-l', ROUNDED.t_l, ROUNDED.b_l],
    },
  },
  defaultVariants: {
    rounded: false,
  },
})

export const SideNav: FC<Props> = ({
  items,
  size = 'default',
  onClick,
  className,
  rounded,
  children,
  ...rest
}) => {
  const actualOnClick = useMemo(
    () =>
      onClick
        ? (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) =>
            onClick(
              e,
              ((e as React.MouseEvent<HTMLButtonElement, MouseEvent>).currentTarget.value ||
                e.currentTarget.getAttribute('data-value')) as string,
            )
        : undefined,
    [onClick],
  )

  const actualClassName = useMemo(
    () => classNameGenerator({ rounded, className }),
    [rounded, className],
  )

  return (
    <ul {...rest} className={actualClassName}>
      {items
        ? items.map((item) => (
            <SideNavItemButton
              key={item.id}
              id={item.id}
              title={item.title}
              prefix={item.prefix}
              current={item.current}
              size={size}
              onClick={actualOnClick}
            />
          ))
        : children &&
          Children.map(children, (child) => {
            if (
              child &&
              typeof child === 'object' &&
              'type' in child &&
              child.type === SideNavItemButton
            ) {
              return cloneElement(child as React.ReactElement, {
                // 子コンポーネントに対して親コンポーネントから onClick size を一括で適用
                size,
                onClick: actualOnClick,
              })
            }

            return child
          })}
    </ul>
  )
}
