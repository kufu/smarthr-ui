import React, { HTMLAttributes, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { range } from '../../libs/lodash'
import { Cluster, Reel } from '../Layout'
import { Nav } from '../SectioningContent'

import { PaginationControllerItemButton } from './PaginationControllerItemButton'
import { PaginationItemButton } from './PaginationItemButton'

const pagination = tv({
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
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>
type Props = BaseProps & ElementProps

export const Pagination: React.FC<Props> = (props) =>
  props.total > 1 ? <ActualPagination {...props} /> : null

const ActualPagination: React.FC<Props> = ({
  total,
  current,
  onClick,
  padding = 4,
  className,
  withoutNumbers = false,
  ...props
}) => {
  const {
    wrapperStyle,
    listStyle,
    firstListItemStyle,
    prevListItemStyle,
    nextListItemStyle,
    lastListItemStyle,
  } = useMemo(() => {
    const { wrapper, list, firstListItem, prevListItem, nextListItem, lastListItem } = pagination()
    const itemArg = { withoutNumbers }

    return {
      wrapperStyle: wrapper({ className }),
      listStyle: list(),
      firstListItemStyle: firstListItem(itemArg),
      prevListItemStyle: prevListItem(itemArg),
      nextListItemStyle: nextListItem(itemArg),
      lastListItemStyle: lastListItem(itemArg),
    }
  }, [className, withoutNumbers])

  const pageNumbers = useMemo(() => {
    if (withoutNumbers) {
      return []
    }

    return [
      ...range(Math.max(current - padding, 1), current),
      ...range(current, Math.min(current + padding, total) + 1),
    ]
  }, [current, total, padding, withoutNumbers])

  const prevAttrs = {
    disabled: current === 1,
    direction: 'prev',
  }
  const nextAttrs = {
    disabled: current === total,
    direction: 'next',
  }

  return (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Nav {...props} className={wrapperStyle} aria-label="ページネーション">
      <Reel>
        <Cluster as="ul" className={listStyle}>
          <li className={firstListItemStyle}>
            <PaginationControllerItemButton
              {...prevAttrs}
              onClick={onClick}
              targetPage={1}
              double
            />
          </li>
          <li className={prevListItemStyle}>
            <PaginationControllerItemButton
              {...prevAttrs}
              onClick={onClick}
              targetPage={current - 1}
            />
          </li>
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={page === current ? 'smarthr-ui-Pagination-current' : 'smarthr-ui-Pagination-page'}
            >
              <PaginationItemButton page={page} currentPage={current} onClick={onClick} />
            </li>
          ))}
          <li className={nextListItemStyle}>
            <PaginationControllerItemButton
              {...nextAttrs}
              onClick={onClick}
              targetPage={current + 1}
            />
          </li>
          <li className={lastListItemStyle}>
            <PaginationControllerItemButton
              {...nextAttrs}
              onClick={onClick}
              targetPage={total}
              double
            />
          </li>
        </Cluster>
      </Reel>
    </Nav>
  )
}
