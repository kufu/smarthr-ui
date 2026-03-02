import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react'
import { Children, cloneElement } from 'react'
import { tv } from 'tailwind-variants'

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
}>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'ul'>, keyof AbstractProps>

const classNameGenerator = tv({
  base: ['smarthr-ui-SideNav', 'shr-list-none shr-bg-column'],
})

export const SideNav: FC<Props> = ({
  items,
  size = 'default',
  onClick,
  className,
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

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

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
