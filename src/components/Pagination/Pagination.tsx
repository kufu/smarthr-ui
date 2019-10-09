import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { range } from '../../libs/lodash'

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
  ${({ theme }: InjectedProps) => {
    const { size } = theme
    return css`
      display: flex;
      margin: 0;
      padding: 0;
      > li {
        list-style: none;
        margin-left: ${size.pxToRem(size.space.XXS)};
        &.prev {
          margin-right: ${size.pxToRem(size.space.XS)};
          + li {
            margin-left: 0;
          }
        }
        &.next {
          margin-left: ${size.pxToRem(size.space.XS)};
        }
        &.prevDouble {
          margin-left: 0;
        }
      }
      &.withoutNumbers {
        > li {
          &.prev {
            margin-left: ${size.pxToRem(size.space.XS)};
            margin-right: 0;
          }
          &.next {
            margin-left: ${size.pxToRem(size.space.XXS)};
          }
          &.nextDouble {
            margin-left: ${size.pxToRem(size.space.XS)};
          }
        }
      }
    `
  }}
`
