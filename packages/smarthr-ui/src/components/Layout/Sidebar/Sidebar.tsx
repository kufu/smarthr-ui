'use client'

import {
  type CSSProperties,
  Children,
  type ComponentPropsWithRef,
  type ComponentType,
  type PropsWithChildren,
  type ReactElement,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useSectionWrapper } from '../../SectioningContent/useSectioningWrapper'

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
  },
})
const itemClassNameGenerator = tv({
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

type Props = Omit<VariantProps<typeof classNameGenerator>, 'rowGap' | 'columnGap'> &
  VariantProps<typeof itemClassNameGenerator> &
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
      () => classNameGenerator({ align, rowGap: gaps.row, columnGap: gaps.column, className }),
      [align, gaps.row, gaps.column, className],
    )
    const classNames = useMemo(() => {
      const { firstItem, lastItem } = itemClassNameGenerator({ right })

      return {
        firstItem: firstItem(),
        lastItem: lastItem(),
      }
    }, [right])
    const styles = useMemo(() => {
      const styleProps = {
        minWidth: contentsMinWidth,
      }

      if (right) {
        return {
          firstItem: styleProps,
          lastItem: undefined,
        }
      }

      return {
        firstItem: undefined,
        lastItem: styleProps,
      }
    }, [contentsMinWidth, right])

    // tailwindcss で :first-child / :last-child に対して動的な min-height を当てられないため、React で疑似的に処理している
    const maxChildrenIndex = Children.count(children) - 1
    const styledChildren = Children.map(children, (child, i) => {
      if (isValidElement(child)) {
        const childClassName = child.props.className ?? ''

        if (i === 0) {
          return cloneElement(child as ReactElement, {
            className: `${classNames.firstItem} ${childClassName}`,
            style: { ...styles.firstItem, ...child.props.style },
          })
        } else if (i === maxChildrenIndex) {
          return cloneElement(child as ReactElement, {
            className: `${classNames.lastItem} ${childClassName}`,
            style: { ...styles.lastItem, ...child.props.style },
          })
        }
      }

      return child
    })

    const Wrapper = useSectionWrapper(Component)
    const body = (
      <Component {...rest} ref={ref} className={actualClassName}>
        {styledChildren}
      </Component>
    )

    if (Wrapper) {
      return <Wrapper>{body}</Wrapper>
    }

    return body
  },
)
