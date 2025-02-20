import React, { type HTMLAttributes, memo, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { range } from '../../libs/lodash'
import { Cluster, Reel } from '../Layout'
import { Nav } from '../SectioningContent'

import { PaginationControllerItemButton } from './PaginationControllerItemButton'
import { PaginationItemButton } from './PaginationItemButton'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-Pagination shr-inline-block shr-max-w-full',
    list: 'shr-m-0.25 shr-list-none shr-ps-[unset]',
    firstListItem: 'smarthr-ui-Pagination-first',
    prevListItem: 'smarthr-ui-Pagination-prev',
    nextListItem: 'smarthr-ui-Pagination-next',
    lastListItem: 'smarthr-ui-Pagination-last',
  },
  variants: {
    withoutNumbers: {
      true: {
        firstListItem: 'shr-mr-0.5',
        prevListItem: 'shr-mr-0',
        nextListItem: 'shr-ml-0',
        lastListItem: 'shr-ml-0.5',
      },
      false: {
        prevListItem: 'shr-mr-0.5',
        nextListItem: 'shr-ml-0.5',
      },
    },
  },
})

type BaseProps = {
  /** 全ページ数 */
  total: number
  /** 現在のページ */
  current: number
  /** ボタンを押下したときに発火するコールバック関数 */
  onClick: (pageNumber: number) => void
  /** 現在のページの前後に表示するページ番号のボタンの数 */
  padding?: number
  /** `true` のとき、ページ番号のボタンを表示しない */
  withoutNumbers?: boolean
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof BaseProps>
type Props = BaseProps & ElementProps

const BUTTON_REGEX = /^button$/i

export const Pagination: React.FC<Props> = (props) =>
  props.total > 1 ? <ActualPagination {...props} /> : null

const ActualPagination: React.FC<Props> = ({
  total,
  current,
  onClick,
  padding,
  className,
  withoutNumbers,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { wrapper, list, firstListItem, prevListItem, nextListItem, lastListItem } =
      classNameGenerator()
    const itemArg = { withoutNumbers: withoutNumbers || false }

    return {
      wrapper: wrapper({ className }),
      list: list(),
      firstListItem: firstListItem(itemArg),
      prevListItem: prevListItem(itemArg),
      nextListItem: nextListItem(itemArg),
      lastListItem: lastListItem(itemArg),
    }
  }, [className, withoutNumbers])

  const actualOnClick = useCallback(
    (e: React.MouseEvent) => {
      const button = e.nativeEvent.composedPath().find((elm) => BUTTON_REGEX.test(elm.tagName))

      if (button) {
        onClick(parseInt(button.value, 10))
      }
    },
    [onClick],
  )

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Nav {...props} className={classNames.wrapper} aria-label="ページネーション">
      {/* eslint-disable-next-line smarthr/a11y-delegate-element-has-role-presentation */}
      <Reel onClick={actualOnClick} role="presentation">
        <ItemCluster
          total={total}
          current={current}
          padding={padding}
          withoutNumbers={withoutNumbers}
          classNames={classNames}
        />
      </Reel>
    </Nav>
  )
}

const ItemCluster = memo<
  Pick<Props, 'total' | 'current' | 'padding' | 'WithoutNumbers'> & {
    classNames: {
      list: string
      firstListItem: string
      prevListItem: string
      nextListItem: string
      lastListItem: string
    }
  }
>(({ total, current, padding = 4, withoutNumbers, classNames }) => {
  const pageNumbers = useMemo(() => {
    if (withoutNumbers) {
      return []
    }

    return range(Math.max(current - padding, 1), Math.min(current + padding, total) + 1)
  }, [current, total, padding, withoutNumbers])

  const controllerAttrs = useMemo(
    () => ({
      prev: {
        disabled: current === 1,
        direction: 'prev' as const,
      },
      next: {
        disabled: current === total,
        direction: 'next' as const,
      },
    }),
    [current, total],
  )

  return (
    <Cluster as="ul" className={classNames.list}>
      <li className={classNames.firstListItem}>
        <PaginationControllerItemButton {...controllerAttrs.prev} targetPage={1} double />
      </li>
      <li className={classNames.prevListItem}>
        <PaginationControllerItemButton {...controllerAttrs.prev} targetPage={current - 1} />
      </li>
      {pageNumbers.map((page) => (
        <li key={page} className={`smarthr-ui-Pagination-${page === current ? 'current' : 'page'}`}>
          <PaginationItemButton page={page} currentPage={current} />
        </li>
      ))}
      <li className={classNames.nextListItem}>
        <PaginationControllerItemButton {...controllerAttrs.next} targetPage={current + 1} />
      </li>
      <li className={classNames.lastListItem}>
        <PaginationControllerItemButton {...controllerAttrs.next} targetPage={total} double />
      </li>
    </Cluster>
  )
})
