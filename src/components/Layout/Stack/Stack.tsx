import React, { ComponentPropsWithRef, PropsWithChildren, forwardRef, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Gap } from '../../../types'

const stack = tv({
  base: 'shr-flex-col shr-justify-start [&_>_*]:shr-my-0',
  variants: {
    inline: {
      true: 'shr-inline-flex',
      false: 'shr-flex',
    },
    gap: {
      0: '[&_>_*_+_*]:shr-mt-0',
      0.25: '[&_>_*_+_*]:shr-mt-0.25',
      0.5: '[&_>_*_+_*]:shr-mt-0.5',
      0.75: '[&_>_*_+_*]:shr-mt-0.75',
      1: '[&_>_*_+_*]:shr-mt-1',
      1.25: '[&_>_*_+_*]:shr-mt-1.25',
      1.5: '[&_>_*_+_*]:shr-mt-1.5',
      2: '[&_>_*_+_*]:shr-mt-2',
      2.5: '[&_>_*_+_*]:shr-mt-2.5',
      3: '[&_>_*_+_*]:shr-mt-3',
      3.5: '[&_>_*_+_*]:shr-mt-3.5',
      4: '[&_>_*_+_*]:shr-mt-4',
      8: '[&_>_*_+_*]:shr-mt-8',
      X3S: '[&_>_*_+_*]:shr-mt-0.25',
      XXS: '[&_>_*_+_*]:shr-mt-0.5',
      XS: '[&_>_*_+_*]:shr-mt-1',
      S: '[&_>_*_+_*]:shr-mt-1.5',
      M: '[&_>_*_+_*]:shr-mt-2',
      L: '[&_>_*_+_*]:shr-mt-2.5',
      XL: '[&_>_*_+_*]:shr-mt-3',
      XXL: '[&_>_*_+_*]:shr-mt-3.5',
      X3L: '[&_>_*_+_*]:shr-mt-4',
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
  ComponentPropsWithRef<'div'>

export const Stack = forwardRef<HTMLDivElement, Props>(
  ({ as: Component = 'div', inline = false, gap = 1, align, className, ...props }, ref) => {
    const styles = useMemo(
      () => stack({ inline, align, gap, className }),
      [align, className, gap, inline],
    )
    return <Component {...props} ref={ref} className={styles} />
  },
)
