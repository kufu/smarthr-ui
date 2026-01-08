'use client'

import {
  type ComponentPropsWithRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { paddingBlock, paddingInline } from '../../themes/tailwind'
import { useSectionWrapper } from '../SectioningContent/useSectioningWrapper'

import type { Gap } from '../../types'

export const baseClassNameGenerator = tv({
  base: 'smarthr-ui-Base shr-bg-white forced-colors:shr-border-shorthand contrast-more:shr-border-high-contrast',
  variants: {
    paddingBlock,
    paddingInline,
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

type AbstractProps = PropsWithChildren<
  Omit<
    VariantProps<typeof baseClassNameGenerator>,
    'paddingBlock' | 'paddingInline' | 'overflowBlock' | 'overflowInline'
  > & {
    /** 境界とコンテンツの間の余白 */
    padding?: Gap | SeparatePadding
    /** コンテンツが要素内に収まらない場合の処理方法 */
    overflow?: Overflow | { x: Overflow; y: Overflow }
    as?: string | ComponentType<any>
  }
>
export type ElementProps = Omit<ComponentPropsWithRef<'div'>, keyof AbstractProps>
type Props = AbstractProps & ElementProps

type SeparatePadding = {
  block?: Gap
  inline?: Gap
}

export const Base = forwardRef<HTMLDivElement, Props>(
  ({ padding, radius, overflow, layer, as: Component = 'div', className, ...rest }, ref) => {
    const actualClassName = useMemo(() => {
      const actualPadding =
        padding instanceof Object ? padding : { block: padding, inline: padding }
      const actualOverflow = overflow instanceof Object ? overflow : { x: overflow, y: overflow }

      return baseClassNameGenerator({
        paddingBlock: actualPadding.block,
        paddingInline: actualPadding.inline,
        radius: radius ?? 'm',
        overflowBlock: actualOverflow.y,
        overflowInline: actualOverflow.x,
        layer: layer ?? 1,
        className,
      })
    }, [layer, overflow, padding, radius, className])

    const Wrapper = useSectionWrapper(Component)
    const body = <Component {...rest} ref={ref} className={actualClassName} />

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
