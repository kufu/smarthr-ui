'use client'

import React, { ReactElement, forwardRef, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { useSectionWrapper } from '../../SectioningContent/useSectioningWrapper'

import type { Gap, SeparateGap } from '../../../types'
import type { CSSProperties, ComponentPropsWithRef, PropsWithChildren } from 'react'

const sidebar = tv({
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
  },
})
const sidebarItem = tv({
  slots: {
    firstItem: '',
    lastItem: '',
  },
  variants: {
    right: {
      true: {
        firstItem: 'shr-grow-[999] shr-basis-0',
        lastItem: 'shr-grow',
      },
      false: {
        firstItem: 'shr-grow',
        lastItem: 'shr-grow-[999] shr-basis-0',
      },
    },
  },
})

type Props = Omit<VariantProps<typeof sidebar>, 'rowGap' | 'columnGap'> &
  VariantProps<typeof sidebarItem> &
  PropsWithChildren<{
    as?: string | React.ComponentType<any>
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
      ...props
    },
    ref,
  ) => {
    const rowGap = gap instanceof Object ? gap.row : gap
    const columnGap = gap instanceof Object ? gap.column : gap

    const wrapperStyle = useMemo(
      () => sidebar({ align, rowGap, columnGap, className }),
      [align, rowGap, columnGap, className],
    )
    const { firstItemStyleProps, lastItemStyleProps } = useMemo(() => {
      const { firstItem, lastItem } = sidebarItem({ right })
      const styleProps = {
        minWidth: contentsMinWidth,
      }
      return {
        firstItemStyleProps: {
          className: firstItem(),
          style: right ? styleProps : undefined,
        },
        lastItemStyleProps: {
          className: lastItem(),
          style: right ? undefined : styleProps,
        },
      }
    }, [contentsMinWidth, right])

    // tailwindcss で :first-child / :last-child に対して動的な min-height を当てられないため、React で疑似的に処理している
    const styledChildren = React.Children.map(children, (child, i) => {
      if (React.isValidElement(child)) {
        const childClassName = child.props.className ?? ''
        if (i === 0) {
          return React.cloneElement(child as ReactElement, {
            className: `${firstItemStyleProps.className} ${childClassName}`,
            style: { ...firstItemStyleProps.style, ...child.props.style },
          })
        }
        if (i === React.Children.count(children) - 1) {
          return React.cloneElement(child as ReactElement, {
            className: `${lastItemStyleProps.className} ${childClassName}`,
            style: { ...lastItemStyleProps.style, ...child.props.style },
          })
        }
      }

      return child
    })

    const Wrapper = useSectionWrapper(Component)

    return (
      <Wrapper>
        <Component {...props} ref={ref} className={wrapperStyle}>
          {styledChildren}
        </Component>
      </Wrapper>
    )
  },
)
