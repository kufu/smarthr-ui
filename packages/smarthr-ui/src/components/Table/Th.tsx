import {
  type AriaAttributes,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { FaSortDownIcon, FaSortUpIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { reelShadowClassNameGenerator } from './useReelShadow'

import type { CellContentWidth } from './type'

type sortTypes = keyof typeof SORT_DIRECTION_LABEL
export type Props = PropsWithChildren<
  {
    /** 並び替え状態 */
    sort?: sortTypes
    /** 並び替えをクリックした時に発火するコールバック関数 */
    onSort?: () => void
    /** 文言を変更するための関数 */
    decorators?: {
      sortDirectionIconAlt: (text: string, { sort }: { sort: sortTypes }) => ReactNode
    }
    contentWidth?: CellContentWidth
  } & VariantProps<typeof classNameGenerator>
>
type ElementProps = Omit<ComponentPropsWithoutRef<'th'>, keyof Props | 'onClick'>

const SORT_DIRECTION_LABEL = {
  asc: '昇順',
  desc: '降順',
  none: '並び替えなし',
}

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Th',
    'shr-border-solid shr-border-0 shr-px-1 shr-py-0.75 shr-text-left shr-align-middle shr-text-sm shr-font-bold shr-leading-tight shr-text-black',
    [
      '[.shr-table-border-vertical_&+&]:shr-border-l',
      '[.shr-table-border-vertical_&+&]:shr-border-l-default',
    ],
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
    fixed: {
      true: [
        /* これ以降の記述はTableReel内で'fixed'を利用した際に追従させるために必要 */
        'fixedElement',
        '[&.fixed]:shr-sticky [&.fixed]:shr-right-0 [&.fixed]:after:shr-opacity-100',
      ],
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

export const Th = memo<Props & ElementProps>(
  ({
    children,
    sort,
    onSort,
    decorators,
    align,
    vAlign,
    fixed = false,
    contentWidth,
    className,
    style,
    ...props
  }) => {
    const actualClassName = useMemo(() => {
      const base = classNameGenerator({ className, align, vAlign, fixed })

      if (!fixed) {
        return base
      }

      const shadow = reelShadowClassNameGenerator({ showShadow: false, direction: 'right' })

      return `${base} ${shadow}`
    }, [align, className, fixed, vAlign])
    const actualStyle = useMemo(
      () => ({
        ...style,
        width: convertContentWidth(contentWidth),
      }),
      [style, contentWidth],
    )

    const sortLabel = useMemo(
      () =>
        sort &&
        (decorators?.sortDirectionIconAlt?.(SORT_DIRECTION_LABEL[sort], { sort }) ||
          SORT_DIRECTION_LABEL[sort]),
      [decorators, sort],
    )
    const ariaSort = useMemo<AriaAttributes['aria-sort'] | undefined>(
      () => (sort ? (sort === 'none' ? 'none' : `${sort}ending`) : undefined),
      [sort],
    )

    return (
      <th {...props} aria-sort={ariaSort} className={actualClassName} style={actualStyle}>
        {sort ? (
          <MemoizedSortButton align={align} onSort={onSort} sortLabel={sortLabel}>
            {children}
          </MemoizedSortButton>
        ) : (
          children
        )}
      </th>
    )
  },
)

const sortButtonClassNameGenerator = tv({
  base: '-shr-mx-1 -shr-my-0.75 shr-inline-flex shr-w-full shr-gap-x-0.5 shr-px-1 shr-py-0.75 shr-font-bold shr-items-center shr-justify-between',
  variants: {
    align: {
      left: '',
      right: 'shr-justify-end',
    },
  },
})

const MemoizedSortButton = memo<
  Pick<ActualProps, 'align' | 'onSort'> &
    PropsWithChildren<{
      sortLabel: ReactNode
    }>
>(({ align, onSort, sortLabel, children }) => {
  const className = useMemo(() => sortButtonClassNameGenerator({ align }), [align])

  return (
    <UnstyledButton onClick={onSort} className={className}>
      {children}
      <SortIcon />
      <VisuallyHiddenText>{sortLabel}</VisuallyHiddenText>
    </UnstyledButton>
  )
})

const sortIconClassNameGenerator = tv({
  slots: {
    wrapper: 'shr-inline-flex shr-flex-col',
    upIcon: [
      'shr-text-base',
      '[[aria-sort="none"]_&]:shr-text-disabled',
      '[[aria-sort="ascending"]_&]:shr-text-black',
      '[[aria-sort="descending"]_&]:shr-text-disabled',
    ],
    downIcon: [
      '-shr-mt-em shr-text-base',
      '[[aria-sort="none"]_&]:shr-text-disabled',
      '[[aria-sort="ascending"]_&]:shr-text-disabled',
      '[[aria-sort="descending"]_&]:shr-text-black',
    ],
  },
})

const SortIcon = memo(() => {
  const classNames = useMemo(() => {
    const { wrapper, upIcon, downIcon } = sortIconClassNameGenerator()

    return {
      wrapper: wrapper(),
      upIcon: upIcon(),
      downIcon: downIcon(),
    }
  }, [])

  return (
    <span className={classNames.wrapper}>
      <FaSortUpIcon className={classNames.upIcon} />
      <FaSortDownIcon className={classNames.downIcon} />
    </span>
  )
})
