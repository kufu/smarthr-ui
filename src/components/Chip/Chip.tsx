import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

type Props = PropsWithChildren<VariantProps<typeof chip> & ComponentPropsWithoutRef<'span'>>

const chip = tv({
  base: [
    'smarthr-ui-Chip',
    'shr-rounded-full',
    'shr-border',
    'shr-border-solid',
    'shr-border-default',
    'shr-leading-none',
    'contrast-more:shr-border-high-contrast',
  ],
  variants: {
    size: {
      s: ['shr-text-sm', 'shr-px-0.5', 'shr-py-0.25'],
    },
  },
})

export const Chip: FC<Props> = ({ className, size = 's', ...props }) => {
  const styles = useMemo(() => chip({ size, className }), [size, className])
  return <span {...props} className={styles} />
}
