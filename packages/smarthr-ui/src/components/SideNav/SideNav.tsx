import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { SideNavProvider } from './SideNavContext'

import type { SideNavSizeType } from './SideNavItemButton'

type AbstractProps = PropsWithChildren<{
  /** 各アイテムの大きさ */
  size?: SideNavSizeType
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
  base: ['smarthr-ui-SideNav', 'shr-relative shr-list-none shr-bg-column'],
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

export const SideNav: FC<Props> = ({ size = 'M', className, rounded, children, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ rounded, className }),
    [rounded, className],
  )

  return (
    <SideNavProvider value={{ size }}>
      <ul {...rest} className={actualClassName}>
        {children}
      </ul>
    </SideNavProvider>
  )
}
