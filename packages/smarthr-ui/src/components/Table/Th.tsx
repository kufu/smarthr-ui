import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useLatest } from '../../hooks/useLatest'

import { ThSortButton } from './ThSortButton'
import { reelShadowClassNameGenerator } from './reelShadowStyle'

import type { CellContentWidth } from './type'

export type BaseProps = PropsWithChildren<
  {
    /** 並び替え状態 */
    sort?: ComponentPropsWithoutRef<typeof ThSortButton>['sort']
    /** 並び替えをクリックした時に発火するコールバック関数 */
    onSort?: () => void
    /** 横スクロール時、カラムを左右いずれかに固定 */
    fixed?: 'left' | 'right'
    contentWidth?: CellContentWidth
  } & VariantProps<typeof classNameGenerator>
>
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'th'>, keyof BaseProps | 'onClick'>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Th',
    'shr-whitespace-nowrap shr-border-0 shr-px-1 shr-py-0.75 shr-text-left shr-align-middle shr-text-sm shr-font-bold shr-leading-tight shr-text-black',
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

export const Th: FC<Props> = ({ sort, onSort, ...rest }) =>
  sort ? <SortableTh {...rest} sort={sort} onSort={onSort} /> : <ActualTh {...rest} />

const SortableTh: FC<
  Omit<Props, 'sort'> & {
    sort: NonNullable<Props['sort']>
  }
> = ({ sort, onSort, align, children, ...rest }) => {
  const latest = useLatest({ onSort })
  const hasOnSort = !!onSort

  const functions = useMemo(
    () => ({
      handleSort: hasOnSort
        ? () => {
            latest.onSort?.()
          }
        : undefined,
    }),
    [hasOnSort, latest],
  )

  return (
    <ActualTh {...rest} align={align} aria-sort={sort === 'none' ? sort : `${sort}ending`}>
      <ThSortButton align={align} handleSort={functions.handleSort} sort={sort}>
        {children}
      </ThSortButton>
    </ActualTh>
  )
}

const ActualTh = memo<Omit<Props, 'onSort' | 'sort'>>(
  ({ children, align, vAlign, fixed, contentWidth, className, style, ...rest }) => {
    const actualClassName = useMemo(() => {
      const base = classNameGenerator({ className, align, vAlign })

      if (!fixed) {
        return base
      }

      return `${base} ${reelShadowClassNameGenerator({ showShadow: false, direction: fixed })}`
    }, [align, fixed, vAlign, className])

    return (
      <th
        {...rest}
        data-fixed={fixed}
        className={actualClassName}
        style={{
          ...style,
          width: typeof contentWidth === 'number' ? `${contentWidth}rem` : contentWidth,
        }}
      >
        {children}
      </th>
    )
  },
)
