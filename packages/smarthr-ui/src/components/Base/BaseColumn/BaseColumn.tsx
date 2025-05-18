import { type ComponentProps, type FC, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { bgColors } from '../../../themes/tailwind'
import { Base } from '../Base'

type BaseProps = Omit<ComponentProps<typeof Base>, 'radius' | 'layer'>
type Props = VariantProps<typeof classNameGenerator>
type ElementProps = Omit<ComponentProps<'div'>, keyof BaseProps | keyof Props>

const classNameGenerator = tv({
  base: 'shr-rounded-[unset]',
  variants: {
    bgColor: bgColors,
  },
  defaultVariants: {
    bgColor: 'COLUMN',
  },
})

export const BaseColumn: FC<BaseProps & Props & ElementProps> = ({
  bgColor,
  padding = 1,
  className,
  ...props
}) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ bgColor, className }),
    [bgColor, className],
  )

  return <Base {...props} padding={padding} layer={0} className={actualClassName} />
}
