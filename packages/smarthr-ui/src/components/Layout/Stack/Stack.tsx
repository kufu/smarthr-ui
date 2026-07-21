'use client'

import {
  type ComponentPropsWithRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useSectionWrapper } from '../../SectioningContent'

import type { Gap } from '../../../types'

const classNameGenerator = tv({
  base: 'shr-flex-col shr-justify-start [&_>_*]:shr-my-0',
  variants: {
    inline: {
      true: 'shr-inline-flex',
      false: 'shr-flex',
    },
    gap: {
      0: 'shr-gap-y-0',
      0.25: 'shr-gap-y-0.25',
      0.5: 'shr-gap-y-0.5',
      0.75: 'shr-gap-y-0.75',
      1: 'shr-gap-y-1',
      1.25: 'shr-gap-y-1.25',
      1.5: 'shr-gap-y-1.5',
      2: 'shr-gap-y-2',
      2.5: 'shr-gap-y-2.5',
      3: 'shr-gap-y-3',
      3.5: 'shr-gap-y-3.5',
      4: 'shr-gap-y-4',
      8: 'shr-gap-y-8',
      X3S: 'shr-gap-y-0.25',
      XXS: 'shr-gap-y-0.5',
      XS: 'shr-gap-y-1',
      S: 'shr-gap-y-1.5',
      M: 'shr-gap-y-2',
      L: 'shr-gap-y-2.5',
      XL: 'shr-gap-y-3',
      XXL: 'shr-gap-y-3.5',
      X3L: 'shr-gap-y-4',
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

type Props = VariantProps<typeof classNameGenerator> &
  PropsWithChildren<{
    as?: string | ComponentType<any>
  }> &
  ComponentPropsWithRef<'div'>

export const Stack = forwardRef<HTMLDivElement, Props>(
  ({ as: Component = 'div', inline = false, gap = 1, align, className, ...rest }, ref) => {
    const actualClassName = useMemo(
      () => classNameGenerator({ inline, align, gap, className }),
      [align, className, gap, inline],
    )

    const Wrapper = useSectionWrapper(Component)
    const body = <Component {...rest} ref={ref} className={actualClassName} />

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
