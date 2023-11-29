import React, { ComponentProps, PropsWithChildren, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Gap } from '../../../types'

const stack = tv({
  base: 'shr-flex-col shr-justify-start [&&&]:shr-my-0',
  variants: {
    inline: {
      true: 'shr-inline-flex',
      false: 'shr-flex',
    },
    gap: {
      0: 'shr-gap-0',
      0.25: 'shr-gap-0.25',
      0.5: 'shr-gap-0.5',
      0.75: 'shr-gap-0.75',
      1: 'shr-gap-1',
      1.25: 'shr-gap-1.25',
      1.5: 'shr-gap-1.5',
      2: 'shr-gap-2',
      2.5: 'shr-gap-2.5',
      3: 'shr-gap-3',
      3.5: 'shr-gap-3.5',
      4: 'shr-gap-4',
      8: 'shr-gap-8',
      '-0.25': '-shr-gap-0.25',
      '-0.5': '-shr-gap-0.5',
      '-0.75': '-shr-gap-0.75',
      '-1': '-shr-gap-1',
      '-1.25': '-shr-gap-1.25',
      '-1.5': '-shr-gap-1.5',
      '-2': '-shr-gap-2',
      '-2.5': '-shr-gap-2.5',
      '-3': '-shr-gap-3',
      '-3.5': '-shr-gap-3.5',
      '-4': '-shr-gap-4',
      '-8': '-shr-gap-8',
      X3S: 'shr-gap-0.25',
      XXS: 'shr-gap-0.5',
      XS: 'shr-gap-1',
      S: 'shr-gap-1.5',
      M: 'shr-gap-2',
      L: 'shr-gap-2.5',
      XL: 'shr-gap-3',
      XXL: 'shr-gap-3.5',
      X3L: 'shr-gap-4',
    } as { [key in Gap]: string },
    align: {
      start: 'shr-items-start',
      'flex-start': 'shr-items-start',
      end: 'shr-items-end',
      'flex-end': 'shr-items-end',
      center: 'shr-items-center',
      baseline: 'shr-items-baseline',
      stretch: 'shr-items-stretch',
    },
  },
})

type Props = VariantProps<typeof stack> &
  PropsWithChildren<{
    as?: string | React.ComponentType<any>
  }> &
  ComponentProps<'div'>

export const Stack: React.FC<Props> = ({
  as: Component = 'div',
  inline = false,
  gap = 1,
  align,
  className,
  ...props
}) => {
  const styles = useMemo(
    () => stack({ inline, align, gap, className }),
    [align, className, gap, inline],
  )
  return <Component {...props} className={styles} />
}
