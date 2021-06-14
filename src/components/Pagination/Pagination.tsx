import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { range } from '../../libs/lodash'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

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

export const Pagination: VFC<Props> = ({
  total,
  current,
  onClick,
  padding = 4,
  className = '',
  withoutNumbers = false,
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  if (total <= 1) return null

  const prevPage = (
    <>
      <li className={classNames.start}>
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
        <li key={`pagination-${page}`} className={classNames.page}>
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
      <li className={classNames.end}>
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
    <Wrapper className={`${className} ${classNames.wrapper}`} aria-label="ページネーション">
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
  ${({ themes: { spacingByChar } }) => {
    const classNames = useClassNames()

    return css`
      display: flex;
      margin: 0;
      padding: 0;
      > li {
        list-style: none;
        :not(:first-child) {
          margin-left: ${spacingByChar(0.5)};
        }
        &.${classNames.prev} + li {
          margin-left: ${spacingByChar(1)};
        }
        &.${classNames.next} {
          margin-left: ${spacingByChar(1)};
        }
      }
      &.withoutNumbers {
        > li {
          &.${classNames.prev} {
            margin-left: ${spacingByChar(1)};
          }
          &.${classNames.next} {
            margin-left: ${spacingByChar(0.5)};
          }
          &.${classNames.end} {
            margin-left: ${spacingByChar(1)};
          }
        }
      }
    `
  }}
`
