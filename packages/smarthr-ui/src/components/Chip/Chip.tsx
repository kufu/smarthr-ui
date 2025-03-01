import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

type Props = PropsWithChildren<
  VariantProps<typeof styleGenerator> & ComponentPropsWithoutRef<'span'>
>

const styleGenerator = tv({
  base: [
    'smarthr-ui-Chip',
    'shr-border-shorthand shr-rounded-full shr-bg-white shr-text-black shr-leading-none',
    'contrast-more:shr-border-high-contrast',
  ],
  variants: {
    type: {
      grey: 'shr-border-grey-20',
      blue: 'shr-border-main',
      /* green がトークン化されたら置き換える */
      green: 'shr-border-[#0f7f85]',
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
    type: 'grey',
  },
})

export const Chip: FC<Props> = ({ size, type, disabled, className, ...props }) => {
  const styles = useMemo(
    () => styleGenerator({ size, type, disabled, className }),
    [size, type, disabled, className],
  )
  return <span {...props} className={styles} />
}
