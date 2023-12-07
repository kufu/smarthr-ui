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
    listItem: ['shr-list-none'],
  },
  variants: {
    withoutNumbers: {
      true: {
        list: 'withoutNumbers',
        listItem: ['first:shr-mr-0.5', 'last:shr-ml-0.5'],
      },
    },
    current: {
      true: {
        listItem: ['smarthr-ui-Pagination-current'],
      },
      false: {
        listItem: ['smarthr-ui-Pagination-page'],
      },
    },
    first: {
      true: {
        listItem: ['smarthr-ui-Pagination-first'],
      },
    },
    prev: {
      true: {
        listItem: 'smarthr-ui-Pagination-prev',
      },
    },
    next: {
      true: {
        listItem: 'smarthr-ui-Pagination-next',
      },
    },
    last: {
      true: {
        listItem: ['smarthr-ui-Pagination-last'],
      },
    },
  },
  compoundVariants: [
    {
      prev: true,
      withoutNumbers: false,
      class: {
        listItem: 'shr-mr-0.5',
      },
    },
    {
      prev: true,
      withoutNumbers: true,
      class: {
        listItem: 'shr-mr-0',
      },
    },
    {
      next: true,
      withoutNumbers: false,
      class: {
        listItem: 'shr-ml-0.5',
      },
    },
    {
      next: true,
      withoutNumbers: true,
      class: {
        listItem: 'shr-ml-0',
      },
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
  const { wrapper, list, listItem } = pagination({ withoutNumbers })

  const wrapperStyle = useMemo(() => wrapper({ className }), [className])

  const listStyle = useMemo(() => list(), [withoutNumbers])

  if (total <= 1) return null

  const prevPage = (
    <>
      <li className={listItem({ first: true })}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="prev"
          targetPage={1}
          disabled={current === 1}
          double
        />
      </li>
      <li className={listItem({ prev: true })}>
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
        <li key={`pagination-${page}`} className={listItem({ current: !!current })}>
          <PaginationItemButton page={page} currentPage={current} onClick={onClick} />
        </li>
      ))
    : null

  const nextPage = (
    <>
      <li className={listItem({ next: true })}>
        <PaginationControllerItemButton
          onClick={onClick}
          direction="next"
          targetPage={current + 1}
          disabled={current === total}
        />
      </li>
      <li className={listItem({ last: true })}>
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
