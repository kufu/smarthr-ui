import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

type Props = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & ComponentPropsWithoutRef<'span'>
>

export const classNameGenerator = tv({
  base: [
    'smarthr-ui-Chip',
    'shr-border-shorthand shr-rounded-full shr-bg-white shr-leading-none shr-text-black',
    'contrast-more:shr-border-high-contrast',
  ],
  variants: {
    color: {
      grey: 'shr-border-grey-20',
      blue: 'shr-border-main',
      green: 'shr-border-green',
      orange: 'shr-border-orange',
      red: 'shr-border-danger',
    },
    size: {
      s: 'shr-px-0.5 shr-py-0.25 shr-text-sm',
    },
    disabled: {
      true: 'shr-bg-white/50 shr-text-disabled',
    },
  },
  defaultVariants: {
    size: 's',
    color: 'grey',
  },
})

export const Chip: FC<Props> = ({ size, color, disabled, className, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ size, color, disabled, className }),
    [size, color, disabled, className],
  )
  return <span {...rest} className={actualClassName} />
}
