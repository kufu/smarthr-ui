'use client'

import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ComponentType,
  type PropsWithChildren,
  forwardRef,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useSectionWrapper } from '../../SectioningContent'

import type { Gap, SeparateGap } from '../../../types'

const classNameGenerator = tv({
  base: ['shr-flex shr-flex-wrap', 'empty:shr-gap-0'],
  variants: {
    align: {
      start: 'shr-items-start',
      'flex-start': 'shr-items-start',
      end: 'shr-items-end',
      'flex-end': 'shr-items-end',
      center: 'shr-items-center',
      baseline: 'shr-items-baseline',
      stretch: 'shr-items-stretch',
    },
    rowGap: {
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
    right: {
      false: [
        '[&>:first-child]:shr-grow',
        '[&>:last-child]:shr-grow-[999]',
        '[&>:last-child]:shr-basis-0',
        '[&>:last-child]:shr-min-w-[var(--sidebar-min-width)]',
      ],
      true: [
        '[&>:first-child]:shr-grow-[999]',
        '[&>:first-child]:shr-basis-0',
        '[&>:first-child]:shr-min-w-[var(--sidebar-min-width)]',
        '[&>:last-child]:shr-grow',
      ],
    },
  },
})

type Props = Omit<VariantProps<typeof classNameGenerator>, 'rowGap' | 'columnGap'> &
  PropsWithChildren<{
    as?: string | ComponentType<any>
    /** コンポーネントの `min-width` 値 */
    contentsMinWidth?: CSSProperties['minWidth']
    /** 各領域の間隔の指定（gap） */
    gap?: Gap | SeparateGap
  }> &
  ComponentPropsWithRef<'div'>

export const Sidebar = forwardRef<HTMLDivElement, Props>(
  (
    {
      as: Component = 'div',
      align = 'stretch',
      contentsMinWidth = '50%',
      gap = 1,
      right = false,
      className,
      children,
      style: styleFromProps,
      ...rest
    },
    ref,
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
        classNameGenerator({ align, rowGap: gaps.row, columnGap: gaps.column, right, className }),
      [align, gaps.row, gaps.column, right, className],
    )
    const style = useMemo(
      () => ({ ...styleFromProps, '--sidebar-min-width': contentsMinWidth }) as CSSProperties,
      [contentsMinWidth, styleFromProps],
    )

    const Wrapper = useSectionWrapper(Component)
    const body = (
      <Component {...rest} ref={ref} className={actualClassName} style={style}>
        {children}
      </Component>
    )

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
