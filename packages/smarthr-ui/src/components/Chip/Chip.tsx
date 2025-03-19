import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

type Props = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & ComponentPropsWithoutRef<'span'>
>

export const classNameGenerator = tv({
  base: [
    'smarthr-ui-Chip',
    'shr-border-shorthand shr-rounded-full shr-bg-white shr-text-black shr-leading-none',
    'contrast-more:shr-border-high-contrast',
  ],
  variants: {
    color: {
      grey: 'shr-border-grey-20',
      blue: 'shr-border-main',
      /* green がトークン化されたら置き換える */
      green: 'shr-border-[#0f7f85]',
      /* oragen がトークン化されたら置き換える */
      orange: 'shr-border-[#ff8800]',
      red: 'shr-border-danger',
    },
    size: {
      s: 'shr-text-sm shr-px-0.5 shr-py-0.25',
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

export const Chip: FC<Props> = ({ size, color, disabled, className, ...props }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ size, color, disabled, className }),
    [size, color, disabled, className],
  )
  return <span {...props} className={actualClassName} />
}
