'use client'

import React, { forwardRef, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { useSectionWrapper } from '../../SectioningContent/useSectioningWrapper'

import type { Gap } from '../../../types'
import type { ComponentPropsWithRef, PropsWithChildren } from 'react'

type Props = VariantProps<typeof reel> &
  PropsWithChildren<{
    as?: string | React.ComponentType<any>
  }> &
  ComponentPropsWithRef<'div'>

const reel = tv({
  base: [
    'shr-flex shr-overflow-x-auto shr-overflow-y-hidden',
    '[&_>_*]:shr-flex- [&_>_*]:shr-flex-shrink-0 [&_>_*]:shr-basis-auto',
    /*
      Chromeで空の要素にflex-gapがあると印刷時にレイアウトが崩れるので gap の値を0にする
      See https://bugs.chromium.org/p/chromium/issues/detail?id=1161709
    */
    'empty:shr-gap-0',
  ],
  variants: {
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
    padding: {
      0: 'shr-p-0',
      0.25: 'shr-p-0.25',
      0.5: 'shr-p-0.5',
      0.75: 'shr-p-0.75',
      1: 'shr-p-1',
      1.25: 'shr-p-1.25',
      1.5: 'shr-p-1.5',
      2: 'shr-p-2',
      2.5: 'shr-p-2.5',
      3: 'shr-p-3',
      3.5: 'shr-p-3.5',
      4: 'shr-p-4',
      8: 'shr-p-8',
      X3S: 'shr-p-0.25',
      XXS: 'shr-p-0.5',
      XS: 'shr-p-1',
      S: 'shr-p-1.5',
      M: 'shr-p-2',
      L: 'shr-p-2.5',
      XL: 'shr-p-3',
      XXL: 'shr-p-3.5',
      X3L: 'shr-p-4',
    } as { [key in Gap]: string },
  },
})

export const Reel = forwardRef<HTMLDivElement, Props>(
  ({ as: Component = 'div', gap = 0.5, padding = 0, className, ...props }, ref) => {
    const styles = useMemo(() => reel({ gap, padding, className }), [className, gap, padding])

    const Wrapper = useSectionWrapper(Component)

    return (
      <Wrapper>
        <Component {...props} ref={ref} className={styles} />
      </Wrapper>
    )
  },
)
