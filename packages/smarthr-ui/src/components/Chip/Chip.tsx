import React, {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react'
import { VariantProps, tv } from 'tailwind-variants'

type Props = PropsWithChildren<
  VariantProps<typeof classNameGenerator> & ComponentPropsWithoutRef<'span'>
>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Chip',
    'shr-border-shorthand shr-rounded-full shr-bg-white shr-text-black shr-leading-none',
    'contrast-more:shr-border-high-contrast',
  ],
  variants: {
    size: {
      s: 'shr-text-sm shr-px-0.5 shr-py-0.25',
    },
    disabled: {
      true: 'shr-bg-white/50 shr-text-disabled',
    },
  },
  defaultVariants: {
    size: 's',
  },
})

export const Chip: FC<Props> = ({ size, disabled, className, ...props }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ size, disabled, className }),
    [size, disabled, className],
  )

  return <span {...props} className={actualClassName} />
}
