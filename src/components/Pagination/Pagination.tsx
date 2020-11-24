import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { range } from '../../libs/lodash'
import { Theme, useTheme } from '../../hooks/useTheme'

import { PaginationItem } from './PaginationItem'
import { PaginationControllerItem } from './PaginationControllerItem'

interface Props {
  total: number
  current: number
  onClick: (pageNumber: number) => void
  padding?: number
  className?: string
  withoutNumbers?: boolean
}

export const Pagination: FC<Props> = ({
  total,
  current,
  onClick,
  padding = 4,
  className = '',
  withoutNumbers = false,
}) => {
  const theme = useTheme()

  if (total <= 1) return null

  const prevPage = (
    <>
      <li className="prevDouble">
        <PaginationControllerItem
          onClick={onClick}
          direction="prev"
          targetPage={1}
          disabled={current === 1}
          double
        />
      </li>
      <li className="prev">
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
        <li key={`pagination-${page}`}>
          <PaginationItem page={page} currentPage={current} onClick={onClick} />
        </li>
      ))
    : null

  const nextPage = (
    <>
      <li className="next">
        <PaginationControllerItem
          onClick={onClick}
          direction="next"
          targetPage={current + 1}
          disabled={current === total}
        />
      </li>
      <li className="nextDouble">
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
    <Wrapper className={className} aria-label="ページネーション">
      <List className={withoutNumbers ? 'withoutNumbers' : ''} themes={theme}>
        {prevPage}
        {pages}
        {nextPage}
      </List>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  display: inline-block;
`
const List = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: flex;
      margin: 0;
      padding: 0;
      > li {
        list-style: none;
        margin-left: ${pxToRem(space.XXS)};
        &.prev {
          margin-right: ${pxToRem(space.XS)};
          + li {
            margin-left: 0;
          }
        }
        &.next {
          margin-left: ${pxToRem(space.XS)};
        }
        &.prevDouble {
          margin-left: 0;
        }
      }
      &.withoutNumbers {
        > li {
          &.prev {
            margin-left: ${pxToRem(space.XS)};
            margin-right: 0;
          }
          &.next {
            margin-left: ${pxToRem(space.XXS)};
          }
          &.nextDouble {
            margin-left: ${pxToRem(space.XS)};
          }
        }
      }
    `
  }}
`
