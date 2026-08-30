import { type ComponentProps, type FC, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { backgroundColor } from '../../../tailwind'
import { Panel } from '../Panel'

type BaseProps = Omit<ComponentProps<typeof Panel>, 'radius' | 'layer'> &
  VariantProps<typeof classNameGenerator>
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
    },
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

  return <Panel {...rest} padding={padding} layer={0} className={actualClassName} />
}
