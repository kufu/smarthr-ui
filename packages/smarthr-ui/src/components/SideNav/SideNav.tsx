import { type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { backgroundColor } from '../../tailwind'

import type { ExtendElementPropsWithoutRef } from '../../types'

type BgColor = 'WHITE' | 'COLUMN'

type Props = ExtendElementPropsWithoutRef<
  'ul',
  {
    /** 各アイテムの大きさ */
    size?: 'M' | 'S'
    /** 背景色 */
    bgColor?: BgColor
    rounded?: boolean | 'all' | 'top' | 'right' | 'bottom' | 'left'
  }
>

const ROUNDED = {
  t_l: '[&>.smarthr-ui-SideNav-item:first-child]:shr-rounded-tl-l',
  t_r: '[&>.smarthr-ui-SideNav-item:first-child]:shr-rounded-tr-l',
  b_l: '[&>.smarthr-ui-SideNav-item:last-child]:shr-rounded-bl-l',
  b_r: '[&>.smarthr-ui-SideNav-item:last-child]:shr-rounded-br-l',
}
const ROUNDED_ALL = ['shr-rounded-l', ROUNDED.t_l, ROUNDED.t_r, ROUNDED.b_l, ROUNDED.b_r]

const classNameGenerator = tv({
  base: ['smarthr-ui-SideNav', 'shr-relative shr-list-none'],
  variants: {
    bgColor: {
      WHITE: backgroundColor.WHITE,
      COLUMN: backgroundColor.COLUMN,
    } satisfies Record<BgColor, string>,
    rounded: {
      true: ROUNDED_ALL,
      all: ROUNDED_ALL,
      top: ['shr-rounded-t-l', ROUNDED.t_l, ROUNDED.t_r],
      right: ['shr-rounded-r-l', ROUNDED.t_r, ROUNDED.b_r],
      bottom: ['shr-rounded-b-l', ROUNDED.b_l, ROUNDED.b_r],
      left: ['shr-rounded-l-l', ROUNDED.t_l, ROUNDED.b_l],
    } satisfies Record<Exclude<NonNullable<Props['rounded']>, boolean> | 'true', string[]>,
  },
  defaultVariants: {
    rounded: false,
  },
})

export const SideNav: FC<Props> = ({
  size = 'M',
  bgColor = 'COLUMN',
  className,
  rounded,
  children,
  ...rest
}) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ bgColor, rounded, className }),
    [bgColor, rounded, className],
  )

  return (
    <ul {...rest} className={actualClassName} data-size={size} data-bg-color={bgColor}>
      {children}
    </ul>
  )
}
