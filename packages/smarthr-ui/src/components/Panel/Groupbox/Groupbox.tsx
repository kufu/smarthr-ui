import { type ComponentProps, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { backgroundColor } from '../../../tailwind'
import { Panel } from '../Panel'

type BaseProps = Omit<ComponentProps<typeof Panel>, 'radius' | 'layer'> & {
  /** 背景色 */
  bgColor?: keyof typeof backgroundColor
  /** 角丸を適用する範囲 */
  rounded?: boolean | 'all' | 'top' | 'right' | 'bottom' | 'left'
}
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>

const classNameGenerator = tv({
  base: 'shr-rounded-[unset]',
  variants: {
    bgColor: backgroundColor,
    rounded: {
      true: 'shr-rounded-l',
      all: 'shr-rounded-l',
      top: 'shr-rounded-t-l',
      right: 'shr-rounded-r-l',
      bottom: 'shr-rounded-b-l',
      left: 'shr-rounded-l-l',
    } satisfies Record<Exclude<NonNullable<BaseProps['rounded']>, boolean> | 'true', string>,
  },
  // TODO: tailwindの場合のみdefault値が設定される挙動はバグの原因になりかねないので整理する
  defaultVariants: {
    bgColor: 'COLUMN',
    rounded: false,
  },
})

export const Groupbox: FC<Props> = ({ bgColor, rounded, padding = 1, className, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ bgColor, rounded, className }),
    [bgColor, rounded, className],
  )

  return <Panel {...rest} layer={0} padding={padding} className={actualClassName} />
}
