'use client'

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ForwardedRef,
  type PropsWithChildren,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { genericsForwardRef } from '../../../libs/util'
import { useSectionWrapper } from '../../SectioningContent/useSectioningWrapper'

import type { Gap, SeparateGap } from '../../../types'

export const clusterClassNameGenerator = tv({
  base: 'shr-flex-wrap [&:empty]:shr-gap-0',
  variants: {
    inline: {
      true: 'shr-inline-flex',
      false: 'shr-flex',
    },
    rowGap: {
      // 動的生成も考えたが、tailwindcss が検知できないためベタ書きしている
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
    columnGap: {
      0: 'shr-gap-x-0',
      0.25: 'shr-gap-x-0.25',
      0.5: 'shr-gap-x-0.5',
      0.75: 'shr-gap-x-0.75',
      1: 'shr-gap-x-1',
      1.25: 'shr-gap-x-1.25',
      1.5: 'shr-gap-x-1.5',
      2: 'shr-gap-x-2',
      2.5: 'shr-gap-x-2.5',
      3: 'shr-gap-x-3',
      3.5: 'shr-gap-x-3.5',
      4: 'shr-gap-x-4',
      8: 'shr-gap-x-8',
      X3S: 'shr-gap-x-0.25',
      XXS: 'shr-gap-x-0.5',
      XS: 'shr-gap-x-1',
      S: 'shr-gap-x-1.5',
      M: 'shr-gap-x-2',
      L: 'shr-gap-x-2.5',
      XL: 'shr-gap-x-3',
      XXL: 'shr-gap-x-3.5',
      X3L: 'shr-gap-x-4',
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
    justify: {
      normal: 'shr-justify-normal',
      start: 'shr-justify-start',
      'flex-start': 'shr-justify-start',
      end: 'shr-justify-end',
      'flex-end': 'shr-justify-end',
      center: 'shr-justify-center',
      'space-between': 'shr-justify-between',
      'space-around': 'shr-justify-around',
      'space-evenly': 'shr-justify-evenly',
      stretch: 'shr-justify-stretch',
    },
  },
})

type Props<T extends ElementType> = PropsWithChildren<
  Omit<VariantProps<typeof clusterClassNameGenerator>, 'rowGap' | 'columnGap'> & {
    as?: T
    gap?: Gap | SeparateGap
  }
> &
  ComponentPropsWithoutRef<T>

const ActualCluster = <T extends ElementType = 'div'>(
  { as, gap = 0.5, inline = false, align, justify, className, ...rest }: Props<T>,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const gaps = useMemo(() => {
    if (gap instanceof Object) {
      return gap
    }

    return {
      row: gap,
      column: gap,
    }
  }, [gap])

  const actualClassName = useMemo(
    () =>
      clusterClassNameGenerator({
        inline,
        rowGap: gaps.row,
        columnGap: gaps.column,
        align,
        justify,
        className,
      }),
    [inline, gaps.row, gaps.column, align, justify, className],
  )

  const Component = as || 'div'
  const Wrapper = useSectionWrapper(Component)
  const body = <Component {...rest} ref={ref} className={actualClassName} />

  if (Wrapper) {
    return <Wrapper>{body}</Wrapper>
  }

  return body
}

export const Cluster = genericsForwardRef(ActualCluster)
