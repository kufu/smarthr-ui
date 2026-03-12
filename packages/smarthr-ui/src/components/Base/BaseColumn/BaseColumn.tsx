import { type ComponentProps, type FC, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { bgColors } from '../../../themes/tailwind'
import { Base } from '../Base'

type AbstractProps = Omit<ComponentProps<typeof Base>, 'radius' | 'layer'> &
  VariantProps<typeof classNameGenerator>
type Props = AbstractProps & Omit<ComponentProps<'div'>, keyof AbstractProps>

const classNameGenerator = tv({
  base: 'shr-rounded-[unset]',
  variants: {
    bgColor: bgColors,
    rounded: {
      true: 'shr-rounded-l',
      all: 'shr-rounded-l',
      top: 'shr-rounded-t-l',
      right: 'shr-rounded-r-l',
      bottom: 'shr-rounded-b-l',
      left: 'shr-rounded-l-l',
    },
  },
  defaultVariants: {
    bgColor: 'COLUMN',
    rounded: false,
  },
})

export const BaseColumn: FC<Props> = ({ bgColor, rounded, padding = 1, className, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ bgColor, rounded, className }),
    [bgColor, rounded, className],
  )

  return <Base {...rest} padding={padding} layer={0} className={actualClassName} />
}
