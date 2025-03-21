import { type ComponentProps, type FC, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { Base } from '../Base'

type BaseProps = Omit<ComponentProps<typeof Base>, 'radius' | 'layer'>
type Props = VariantProps<typeof classNameGenerator>
type ElementProps = Omit<ComponentProps<'div'>, keyof BaseProps | keyof Props>

export const classNameGenerator = tv({
  base: 'shr-rounded-[unset]',
  variants: {
    bgColor: {
      BACKGROUND: 'shr-bg-background',
      COLUMN: 'shr-bg-column',
      BASE_GREY: 'shr-bg-base-grey',
      OVER_BACKGROUND: 'shr-bg-over-background',
      HEAD: 'shr-bg-head',
      BORDER: 'shr-bg-[theme(colors.grey.20)]',
      ACTION_BACKGROUND: 'shr-bg-action-background',
      WHITE: 'shr-bg-white',
      GREY_5: 'shr-bg-[theme(colors.grey.5)]',
      GREY_6: 'shr-bg-[theme(colors.grey.6)]',
      GREY_7: 'shr-bg-[theme(colors.grey.7)]',
      GREY_9: 'shr-bg-[theme(colors.grey.9)]',
      GREY_20: 'shr-bg-[theme(colors.grey.20)]',
    },
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
