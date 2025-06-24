import {
  type AriaAttributes,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { ThSortButton } from './ThSortButton'
import { reelShadowClassNameGenerator } from './reelShadowStyle'

import type { CellContentWidth } from './type'

export type Props = PropsWithChildren<
  {
    /** 並び替え状態 */
    sort?: ComponentPropsWithoutRef<typeof ThSortButton>['sort']
    /** 並び替えをクリックした時に発火するコールバック関数 */
    onSort?: () => void
    /** 横スクロール時、カラムを左右いずれかに固定 */
    fixed?: 'left' | 'right'
    /** 文言を変更するための関数 */
    decorators?: ComponentPropsWithoutRef<typeof ThSortButton>['decorators']
    contentWidth?: CellContentWidth
  } & VariantProps<typeof classNameGenerator>
>
type ElementProps = Omit<ComponentPropsWithoutRef<'th'>, keyof Props | 'onClick'>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Th',
    'shr-border-0 shr-px-1 shr-py-0.75 shr-text-left shr-align-middle shr-text-sm shr-font-bold shr-leading-tight shr-text-black',
    'aria-[sort]:shr-cursor-pointer',
    'hover:aria-[sort]:shr-bg-head-darken',
    '[&:has(:focus-visible)]:aria-[sort]:shr-focus-indicator',
    '[&[aria-sort=none]_.smarthr-ui-Icon]:forced-colors:shr-fill-[GrayText]',
    '[&[aria-sort=ascending]_.smarthr-ui-Icon:first-of-type]:forced-colors:shr-fill-[CanvasText] [&[aria-sort=ascending]_.smarthr-ui-Icon:last-of-type]:forced-colors:shr-fill-[GrayText]',
    '[&[aria-sort=descending]_.smarthr-ui-Icon:first-of-type]:forced-colors:shr-fill-[GrayText] [&[aria-sort=descending]_.smarthr-ui-Icon:last-of-type]:forced-colors:shr-fill-[CanvasText]',
  ],
  variants: {
    align: {
      left: '',
      right: 'shr-text-right',
    },
    vAlign: {
      middle: '',
      baseline: 'shr-align-baseline',
      bottom: 'shr-align-bottom',
    },
  },
  defaultVariants: {
    align: 'left',
    vAlign: 'middle',
  },
})

const convertContentWidth = (contentWidth?: CellContentWidth) => {
  if (typeof contentWidth === 'number') {
    // Th は fontSize.S のため、rem で指定する
    return `${contentWidth}rem`
  }

  return contentWidth
}

type ActualProps = Props & ElementProps

export const Th = memo<ActualProps>(
  ({
    children,
    sort,
    onSort,
    decorators,
    align,
    vAlign,
    fixed,
    contentWidth,
    className,
    style,
    ...props
  }) => {
    const actualClassName = useMemo(() => {
      const base = classNameGenerator({ className, align, vAlign })

      if (!fixed) {
        return base
      }

      const shadow = reelShadowClassNameGenerator({ showShadow: false, direction: fixed })

      return `${base} ${shadow}`
    }, [align, className, fixed, vAlign])
    const actualStyle = useMemo(
      () => ({
        ...style,
        width: convertContentWidth(contentWidth),
      }),
      [style, contentWidth],
    )

    const ariaSort = useMemo<AriaAttributes['aria-sort'] | undefined>(
      () => (sort ? (sort === 'none' ? 'none' : `${sort}ending`) : undefined),
      [sort],
    )

    return (
      <th
        {...props}
        aria-sort={ariaSort}
        data-fixed={fixed}
        className={actualClassName}
        style={actualStyle}
      >
        {sort ? (
          <ThSortButton align={align} onSort={onSort} sort={sort} decorators={decorators}>
            {children}
          </ThSortButton>
        ) : (
          children
        )}
      </th>
    )
  },
)
