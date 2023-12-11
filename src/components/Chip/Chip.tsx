import React, { FC, ReactNode } from 'react'
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
      XXS: ['shr-text-2xs', 'shr-px-0.5', 'shr-py-0.25'],
      XS: ['shr-text-xs', 'shr-px-0.5', 'shr-py-0.25'],
      S: ['shr-text-sm', 'shr-px-0.75', 'shr-py-0.5'],
      M: ['shr-text-base', 'shr-px-0.75', 'shr-py-0.5'],
      L: ['shr-text-lg', 'shr-px-1', 'shr-py-0.5'],
      XL: ['shr-text-xl', 'shr-px-1', 'shr-py-0.5'],
      XXL: ['shr-text-2xl', 'shr-px-1.5', 'shr-py-0.75'],
    },
  },
})

export const Chip: FC<Props> = ({ label, size = 'M' }) => {
  const className = chip({ size })
  return <span className={className}>{label}</span>
}
