import React, { HTMLAttributes, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { range } from '../../libs/lodash'
import { Cluster, Reel } from '../Layout'
import { Nav } from '../SectioningContent'

import { PaginationControllerItemButton } from './PaginationControllerItemButton'
import { PaginationItemButton } from './PaginationItemButton'

const pagination = tv({
  slots: {
    wrapper: ['shr-inline-block', 'shr-max-w-full', 'smarthr-ui-Pagination'],
    list: ['shr-m-0.25'],
    firstListItem: ['smarthr-ui-Pagination-first'],
    prevListItem: ['smarthr-ui-Pagination-prev'],
    nextListItem: ['smarthr-ui-Pagination-next'],
    lastListItem: ['smarthr-ui-Pagination-last'],
  },
  variants: {
    withoutNumbers: {
      true: {
        firstListItem: ['shr-mr-0.5'],
        prevListItem: ['shr-mr-0'],
        nextListItem: ['shr-ml-0'],
        lastListItem: ['shr-ml-0.5'],
      },
      false: {
        prevListItem: ['shr-mr-0.5'],
        nextListItem: ['shr-ml-0.5'],
      },
    },
  },
  compoundSlots: [
    {
      slots: ['firstListItem', 'prevListItem', 'nextListItem', 'lastListItem'],
      class: ['shr-list-none'],
    },
  ],
})

type Props = {
  /** 全ページ数 */
  total: number
  /** 現在のページ */
  current: number
  /** ボタンを押下したときに発火するコールバック関数 */
  onClick: (pageNumber: number) => void
  /** 現在のページの前後に表示するページ番号のボタンの数 */
  padding?: number
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** `true` のとき、ページ番号のボタンを表示しない */
  withoutNumbers?: boolean
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const Pagination: React.FC<Props & ElementProps> = ({
  total,
  current,
  onClick,
  padding = 4,
  className = '',
  withoutNumbers = false,
  ...props
}) => {
  const { wrapper, list, firstListItem, prevListItem, nextListItem, lastListItem } = pagination()

  const {
    wrapperStyle,
    listStyle,
    firstListItemStyle,
    prevListItemStyle,
    nextListItemStyle,
    lastListItemStyle,
  } = useMemo(
    () => ({
      wrapperStyle: wrapper({ className }),
      listStyle: list(),
      firstListItemStyle: firstListItem({ withoutNumbers }),
      prevListItemStyle: prevListItem({ withoutNumbers }),
      nextListItemStyle: nextListItem({ withoutNumbers }),
      lastListItemStyle: lastListItem({ withoutNumbers }),
    }),
    [
      className,
      withoutNumbers,
      wrapper,
      list,
      firstListItem,
      prevListItem,
      nextListItem,
      lastListItem,
    ],
  )

  if (total <= 1) return null

  const prevPage = (
    <>
      <li className={firstListItemStyle}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="prev"
          targetPage={1}
          disabled={current === 1}
          double
        />
      </li>
      <li className={prevListItemStyle}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="prev"
          targetPage={current - 1}
          disabled={current === 1}
        />
      </li>
    </>
  )

  const pages = !withoutNumbers
    ? [
        ...range(current - padding, current).filter((page) => page >= 1),
        ...range(current, current + padding + 1).filter((page) => page <= total),
      ].map((page) => (
        <li
          key={`pagination-${page}`}
          className={
            page === current ? 'smarthr-ui-Pagination-current' : 'smarthr-ui-Pagination-page'
          }
        >
          <PaginationItemButton page={page} currentPage={current} onClick={onClick} />
        </li>
      ))
    : null

  const nextPage = (
    <>
      <li className={nextListItemStyle}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="next"
          targetPage={current + 1}
          disabled={current === total}
        />
      </li>
      <li className={lastListItemStyle}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="next"
          targetPage={total}
          disabled={current === total}
          double
        />
      </li>
    </>
  )

  return (
    <Nav {...props} className={wrapperStyle} aria-label="ページネーション">
      <Reel>
        <Cluster as="ul" className={listStyle}>
          {prevPage}
          {pages}
          {nextPage}
        </Cluster>
      </Reel>
    </Nav>
  )
}
