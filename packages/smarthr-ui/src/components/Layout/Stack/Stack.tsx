'use client'

import React, { ComponentPropsWithRef, PropsWithChildren, forwardRef, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Gap } from '../../../types'
import { useSectionWrapper } from '../../SectioningContent/useSectioningWrapper'

const stack = tv({
  base: 'shr-flex-col shr-justify-start [&_>_*]:shr-my-0',
  variants: {
    inline: {
      true: 'shr-inline-flex',
      false: 'shr-flex',
    },
    gap: {
      0: 'shr-space-y-0',
      0.25: 'shr-space-y-0.25',
      0.5: 'shr-space-y-0.5',
      0.75: 'shr-space-y-0.75',
      1: 'shr-space-y-1',
      1.25: 'shr-space-y-1.25',
      1.5: 'shr-space-y-1.5',
      2: 'shr-space-y-2',
      2.5: 'shr-space-y-2.5',
      3: 'shr-space-y-3',
      3.5: 'shr-space-y-3.5',
      4: 'shr-space-y-4',
      8: 'shr-space-y-8',
      X3S: 'shr-space-y-0.25',
      XXS: 'shr-space-y-0.5',
      XS: 'shr-space-y-1',
      S: 'shr-space-y-1.5',
      M: 'shr-space-y-2',
      L: 'shr-space-y-2.5',
      XL: 'shr-space-y-3',
      XXL: 'shr-space-y-3.5',
      X3L: 'shr-space-y-4',
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

    const Wrapper = useSectionWrapper(Component)

    return (
      <Wrapper>
        <Component {...props} ref={ref} className={styles} />
      </Wrapper>
    )
  },
)
