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
  },
  defaultVariants: {
    bgColor: 'COLUMN',
  },
})

export const BaseColumn: FC<Props> = ({ bgColor, padding = 1, className, ...props }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ bgColor, className }),
    [bgColor, className],
  )

  return <Base {...props} padding={padding} layer={0} className={actualClassName} />
}
