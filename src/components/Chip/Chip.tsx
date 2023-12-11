import React, { FC, ReactNode, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

export type Props = {
  label: ReactNode
  size?: VariantProps<typeof chip>['size']
  className?: string
}

export const chip = tv({
  base: [
    'smarthr-ui-Chip',
    'shr-box-border',
    'shr-rounded-full',
    'shr-border',
    'shr-border-solid',
    'shr-border-default',
    'shr-leading-none',
    'contrast-more:shr-border-high-contrast',
  ],
  variants: {
    size: {
      S: ['shr-text-sm', 'shr-px-0.75', 'shr-py-0.5'],
    },
  },
})

export const Chip: FC<Props> = ({ className, label, size = 'S', ...props }) => {
  const styles = useMemo(() => chip({ size, className }), [size, className])
  return (
    <span {...props} className={styles}>
      {label}
    </span>
  )
}
