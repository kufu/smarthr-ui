import { type ComponentProps, type ComponentPropsWithoutRef, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { SideNavItemButton, type SideNavSizeType } from './SideNavItemButton'

type SideNavItemButtonProps = Omit<ComponentProps<typeof SideNavItemButton>, 'size' | 'onClick'>

type Props = {
  /** 各アイテムのデータの配列 */
  items: SideNavItemButtonProps[]
  /** 各アイテムの大きさ */
  size?: SideNavSizeType
  /** アイテムを押下したときに発火するコールバック関数 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<ComponentPropsWithoutRef<'ul'>, keyof Props>

const classNameGenerator = tv({
  base: ['smarthr-ui-SideNav', 'shr-list-none shr-bg-column'],
})

export const SideNav: FC<Props & ElementProps> = ({
  items,
  size = 'default',
  onClick,
  className,
  ...props
}) => {
  const actualOnClick = useMemo(
    () =>
      onClick
        ? (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick(e, e.currentTarget.value)
        : undefined,
    [onClick],
  )

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    <ul {...props} className={actualClassName}>
      {items.map((item) => (
        <SideNavItemButton
          key={item.id}
          id={item.id}
          title={item.title}
          prefix={item.prefix}
          isSelected={item.isSelected}
          size={size}
          onClick={actualOnClick}
        />
      ))}
    </ul>
  )
}
