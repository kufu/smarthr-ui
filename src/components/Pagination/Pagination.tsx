import * as React from 'react'
import styled from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { range } from '../../libs/lodash'

import { NextPaginationItem } from './NextPaginationItem'
import { PaginationItem } from './PaginationItem'
import { PrevPaginationItem } from './PrevPaginationItem'

interface Props {
  total: number
  current: number
  onClick: (pageNumber: number) => void
  padding?: number
  className?: string
  withoutNumbers?: boolean
}

const PaginationComponent: React.FC<Props & InjectedProps> = ({
  total,
  current,
  onClick,
  padding = 4,
  className = '',
  withoutNumbers = false,
  theme,
}) => {
  if (total <= 1) return null

  const prevPage = (
    <React.Fragment>
      <li className="prevDouble">
        <PrevPaginationItem onClick={onClick} prevPage={1} disabled={current === 1} double />
      </li>
      <li className="prev">
        <PrevPaginationItem onClick={onClick} prevPage={current - 1} disabled={current === 1} />
      </li>
    </React.Fragment>
  )

  const pages = !withoutNumbers
    ? [
        ...range(current - padding, current).filter(page => page >= 1),
        ...range(current, current + padding + 1).filter(page => page <= total),
      ].map(page => (
        <li key={`pagination-${page}`}>
          <PaginationItem page={page} currentPage={current} onClick={onClick} />
        </li>
      ))
    : null

  const nextPage = (
    <React.Fragment>
      <li className="next">
        <NextPaginationItem onClick={onClick} nextPage={current + 1} disabled={current === total} />
      </li>
      <li className="nextDouble">
        <NextPaginationItem
          onClick={onClick}
          nextPage={total}
          disabled={current === total}
          double
        />
      </li>
    </React.Fragment>
  )

  return (
    <Wrapper className={className}>
      <List theme={theme} className={withoutNumbers ? 'withoutNumbers' : ''}>
        {prevPage}
        {pages}
        {nextPage}
      </List>
    </Wrapper>
  )
}

export const Pagination = withTheme(PaginationComponent)

const Wrapper = styled.div`
  display: inline-block;
`
const List = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  > li {
    list-style: none;
    margin: 0 4px;
    &.prev {
      margin-right: 12px;
    }
    &.next {
      margin-left: 12px;
    }
    &.prevDouble {
      margin-left: 0;
    }
    &.nextDouble {
      margin-right: 0;
    }
  }
  &.withoutNumbers {
    > li {
      &.prev {
        margin-right: 4px;
      }
      &.next {
        margin-left: 4px;
      }
      &.prevDouble {
        margin-right: 12px;
      }
      &.nextDouble {
        margin-left: 12px;
      }
    }
  }
`
