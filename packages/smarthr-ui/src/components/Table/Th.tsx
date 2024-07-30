import React, {
  AriaAttributes,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  PropsWithChildren,
  ReactNode,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'
import { FaSortDownIcon, FaSortUpIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { fixedCellStyle } from './fixedCellStyle'

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
    fixed?: boolean
  } & VariantProps<typeof thWrapper>
>
type ElementProps = Omit<ComponentPropsWithoutRef<'th'>, keyof Props | 'onClick'>

const SORT_DIRECTION_LABEL = {
  asc: '昇順',
  desc: '降順',
  none: '並び替えなし',
}

const thWrapper = tv({
  base: [
    'smarthr-ui-Th',
    'shr-px-1 shr-py-0.75 shr-text-left shr-align-middle shr-text-sm shr-font-bold shr-leading-tight shr-text-black',
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
  },
})

const convertContentWidth = (contentWidth?: CellContentWidth) => {
  if (typeof contentWidth === 'number') {
    // Th は fontSize.S のため、rem で指定する
    return `${contentWidth}rem`
  }

  return contentWidth
}

export const Th: FC<Props & ElementProps> = ({
  children,
  sort,
  onSort,
  decorators,
  align = 'left',
  fixed = false,
  contentWidth,
  className,
  style,
  ...props
}) => {
  const styleProps = useMemo(() => {
    const thWrapperStyle = thWrapper({ className, align })
    const reelShadowStyles = fixed ? fixedCellStyle() : ''
    return {
      className: `${thWrapperStyle} ${reelShadowStyles}`.trim(),
      style: {
        ...style,
        width: convertContentWidth(contentWidth),
      },
    }
  }, [align, className, contentWidth, fixed, style])

  const sortLabel = useMemo(
    () =>
      sort &&
      (decorators?.sortDirectionIconAlt?.(SORT_DIRECTION_LABEL[sort], { sort }) ||
        SORT_DIRECTION_LABEL[sort]),
    [decorators, sort],
  )
  const ariaSortProps = useMemo<
    | {
        'aria-sort': AriaAttributes['aria-sort']
      }
    | undefined
  >(
    () =>
      sort && {
        'aria-sort': sort === 'none' ? 'none' : `${sort}ending`,
      },
    [sort],
  )

  return (
    <th {...ariaSortProps} {...props} {...styleProps}>
      {sort ? (
        <SortButton align={align} onClick={onSort}>
          {children}
          <SortIcon sort={sort} />
          <VisuallyHiddenText>{sortLabel}</VisuallyHiddenText>
        </SortButton>
      ) : (
        children
      )}
    </th>
  )
}

const sortButton = tv({
  base: [
    '-shr-mx-1 -shr-my-0.75 shr-inline-flex shr-w-full shr-gap-x-0.5 shr-px-1 shr-py-0.75 shr-font-bold shr-cursor-pointer',
    // UnstyledButton に stretch がなぜか指定されてて負けてしまうため（UnstyledButton を見直した方がよさそう）
    '[&]:shr-items-center',
  ],
  variants: {
    align: {
      left: 'shr-justify-between',
      right: 'shr-justify-end',
    },
  },
})

const SortButton: FC<ComponentProps<typeof UnstyledButton> & Pick<Props, 'align'>> = ({
  align,
  ...props
}) => {
  const sortButtonStyle = useMemo(() => sortButton({ align }), [align])
  return <UnstyledButton {...props} className={sortButtonStyle} />
}

const sortIcon = tv({
  slots: {
    wrapper: 'shr-inline-flex shr-flex-col',
    upIcon: 'shr-text-base',
    downIcon: '-shr-mt-em shr-text-base',
  },
  variants: {
    sort: {
      asc: {
        upIcon: 'shr-text-black',
        downIcon: 'shr-text-disabled',
      },
      desc: {
        upIcon: 'shr-text-disabled',
        downIcon: 'shr-text-black',
      },
      none: {
        upIcon: 'shr-text-disabled',
        downIcon: 'shr-text-disabled',
      },
    },
  },
})

const SortIcon: FC<Pick<Props, 'sort'>> = ({ sort }) => {
  const { wrapperStyle, upIconStyle, downIconStyle } = useMemo(() => {
    const sortIconStyle = sortIcon()
    return {
      wrapperStyle: sortIconStyle.wrapper(),
      upIconStyle: sortIconStyle.upIcon({ sort }),
      downIconStyle: sortIconStyle.downIcon({ sort }),
    }
  }, [sort])

  return (
    <span className={wrapperStyle}>
      <FaSortUpIcon className={upIconStyle} />
      <FaSortDownIcon className={downIconStyle} />
    </span>
  )
}
