'use client'

import React, { ComponentPropsWithRef, PropsWithChildren, forwardRef, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { useSectionWrapper } from '../SectioningContent/useSectioningWrapper'

import type { Gap } from '../../types'

export const base = tv({
  base: 'smarthr-ui-Base shr-bg-white forced-colors:shr-border-shorthand contrast-more:shr-border-high-contrast',
  variants: {
    paddingBlock: {
      0: 'shr-py-0',
      0.25: 'shr-py-0.25',
      0.5: 'shr-py-0.5',
      0.75: 'shr-py-0.75',
      1: 'shr-py-1',
      1.25: 'shr-py-1.25',
      1.5: 'shr-py-1.5',
      2: 'shr-py-2',
      2.5: 'shr-py-2.5',
      3: 'shr-py-3',
      3.5: 'shr-py-3.5',
      4: 'shr-py-4',
      8: 'shr-py-8',
      X3S: 'shr-py-0.25',
      XXS: 'shr-py-0.5',
      XS: 'shr-py-1',
      S: 'shr-py-1.5',
      M: 'shr-py-2',
      L: 'shr-py-2.5',
      XL: 'shr-py-3',
      XXL: 'shr-py-3.5',
      X3L: 'shr-py-4',
    } as { [key in Gap]: string },
    paddingInline: {
      0: 'shr-px-0',
      0.25: 'shr-px-0.25',
      0.5: 'shr-px-0.5',
      0.75: 'shr-px-0.75',
      1: 'shr-px-1',
      1.25: 'shr-px-1.25',
      1.5: 'shr-px-1.5',
      2: 'shr-px-2',
      2.5: 'shr-px-2.5',
      3: 'shr-px-3',
      3.5: 'shr-px-3.5',
      4: 'shr-px-4',
      8: 'shr-px-8',
      X3S: 'shr-px-0.25',
      XXS: 'shr-px-0.5',
      XS: 'shr-px-1',
      S: 'shr-px-1.5',
      M: 'shr-px-2',
      L: 'shr-px-2.5',
      XL: 'shr-px-3',
      XXL: 'shr-px-3.5',
      X3L: 'shr-px-4',
    } as { [key in Gap]: string },
    radius: {
      s: 'shr-rounded-m',
      m: 'shr-rounded-l',
    },
    overflowBlock: {
      visible: 'shr-overflow-y-visible',
      hidden: 'shr-overflow-y-hidden',
      clip: 'shr-overflow-y-clip',
      scroll: 'shr-overflow-y-scroll',
      auto: 'shr-overflow-y-auto',
    },
    overflowInline: {
      visible: 'shr-overflow-x-visible',
      hidden: 'shr-overflow-x-hidden',
      clip: 'shr-overflow-x-clip',
      scroll: 'shr-overflow-x-scroll',
      auto: 'shr-overflow-x-auto',
    },
    layer: {
      0: 'shr-shadow-layer-0',
      1: 'shr-shadow-layer-1',
      2: 'shr-shadow-layer-2',
      3: 'shr-shadow-layer-3',
      4: 'shr-shadow-layer-4',
    },
  },
})

type Overflow = 'visible' | 'hidden' | 'clip' | 'scroll' | 'auto'

type Props = PropsWithChildren<
  Omit<
    VariantProps<typeof base>,
    'paddingBlock' | 'paddingInline' | 'overflowBlock' | 'overflowInline'
  > & {
    /** 境界とコンテンツの間の余白 */
    padding?: Gap | SeparatePadding
    /** コンテンツが要素内に収まらない場合の処理方法 */
    overflow?: Overflow | { x: Overflow; y: Overflow }
    as?: string | React.ComponentType<any>
  }
>

type SeparatePadding = {
  block?: Gap
  inline?: Gap
}

export type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof Props>

export const Base = forwardRef<HTMLDivElement, Props & ElementProps>(
  (
    { padding, radius = 'm', overflow, layer = 1, as: Component = 'div', className, ...props },
    ref,
  ) => {
    const styles = useMemo(() => {
      const paddingBlock = padding instanceof Object ? padding.block : padding
      const paddingInline = padding instanceof Object ? padding.inline : padding

      const overflowBlock = overflow instanceof Object ? overflow.y : overflow
      const overflowInline = overflow instanceof Object ? overflow.x : overflow

      return base({
        paddingBlock,
        paddingInline,
        radius,
        overflowBlock,
        overflowInline,
        layer,
        className,
      })
    }, [className, layer, overflow, padding, radius])

    const Wrapper = useSectionWrapper(Component)

    return (
      <Wrapper>
        <Component {...props} ref={ref} className={styles} />
      </Wrapper>
    )
  },
)
