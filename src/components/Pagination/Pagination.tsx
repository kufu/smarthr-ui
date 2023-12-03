import React, { HTMLAttributes } from 'react'
import { tv } from 'tailwind-variants'

import { range } from '../../libs/lodash'
import { Reel } from '../Layout'
import { Nav } from '../SectioningContent'

import { PaginationControllerItemButton } from './PaginationControllerItemButton'
import { PaginationItemButton } from './PaginationItemButton'

const pagination = tv({
  slots: {
    wrapper: ['shr-inline-block', 'shr-max-w-full'],
    list: ['shr-flex', 'shr-items-center', 'shr-shadow-outline-margin', 'shr-gap-x-0.5', 'shr-p-0'],
    listItem: ['shr-list-none'],
  },
  variants: {
    withoutNumbers: {
      true: {
        list: [
          '[&>li.smarthr-ui-Pagination-prev]:shr-ml-0.5',
          '[&>li.smarthr-ui-Pagination-last]:shr-ml-0.5',
        ],
      },
      false: {
        list: [
          '[&>li.smarthr-ui-Pagination-prev]:shr-mr-0.5',
          '[&>li.smarthr-ui-Pagination-next]:shr-ml-0.5',
        ],
      },
    },
  },
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
  const { wrapper, list, listItem } = pagination({ withoutNumbers })

  if (total <= 1) return null

  const prevPage = (
    <>
      <li className={listItem({ className: 'smarthr-ui-Pagination-first' })}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="prev"
          targetPage={1}
          disabled={current === 1}
          double
        />
      </li>
      <li className={listItem({ className: 'smarthr-ui-Pagination-prev' })}>
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
          className={listItem({
            className:
              page === current ? 'smarthr-ui-Pagination-current' : 'smarthr-ui-Pagination-page',
          })}
        >
          <PaginationItemButton page={page} currentPage={current} onClick={onClick} />
        </li>
      ))
    : null

  const nextPage = (
    <>
      <li className={listItem({ className: 'smarthr-ui-Pagination-next' })}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="next"
          targetPage={current + 1}
          disabled={current === total}
        />
      </li>
      <li className={listItem({ className: 'smarthr-ui-Pagination-last' })}>
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
    <Nav
      {...props}
      className={wrapper({ className: `${className} smarthr-ui-pagination` })}
      aria-label="ページネーション"
    >
      <Reel>
        <ul className={list()}>
          {prevPage}
          {pages}
          {nextPage}
        </ul>
      </Reel>
    </Nav>
  )
}
