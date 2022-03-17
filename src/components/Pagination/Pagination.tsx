import React, { HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { range } from '../../libs/lodash'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'
import { Reel } from '../Layout'

import { PaginationItem } from './PaginationItem'
import { PaginationControllerItem } from './PaginationControllerItem'

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

export const Pagination: VFC<Props & ElementProps> = ({
  total,
  current,
  onClick,
  padding = 4,
  className = '',
  withoutNumbers = false,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  if (total <= 1) return null

  const prevPage = (
    <>
      <li className={classNames.first}>
        <PaginationControllerItem
          onClick={onClick}
          direction="prev"
          targetPage={1}
          disabled={current === 1}
          double
        />
      </li>
      <li className={classNames.prev}>
        <PaginationControllerItem
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
          className={page === current ? classNames.current : classNames.page}
        >
          <PaginationItem page={page} currentPage={current} onClick={onClick} />
        </li>
      ))
    : null

  const nextPage = (
    <>
      <li className={classNames.next}>
        <PaginationControllerItem
          onClick={onClick}
          direction="next"
          targetPage={current + 1}
          disabled={current === total}
        />
      </li>
      <li className={classNames.last}>
        <PaginationControllerItem
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
    <Wrapper
      className={`${className} ${classNames.wrapper}`}
      aria-label="ページネーション"
      {...props}
    >
      <Reel>
        <List className={withoutNumbers ? 'withoutNumbers' : ''} themes={theme}>
          {prevPage}
          {pages}
          {nextPage}
        </List>
      </Reel>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  display: inline-block;
  max-width: 100%;
`
const List = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    const classNames = useClassNames()

    return css`
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;
      > li {
        list-style: none;
        :not(:first-child) {
          margin-left: ${spacingByChar(0.5)};
        }
      }
      &:not(.withoutNumbers) {
        > li {
          &.${classNames.prev} + li {
            margin-left: ${spacingByChar(1)};
          }
          &.${classNames.next} {
            margin-left: ${spacingByChar(1)};
          }
        }
      }
      &.withoutNumbers {
        > li {
          &.${classNames.prev} {
            margin-left: ${spacingByChar(1)};
          }
          &.${classNames.last} {
            margin-left: ${spacingByChar(1)};
          }
        }
      }
    `
  }}
`
