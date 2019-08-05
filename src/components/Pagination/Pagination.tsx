import * as React from 'react'
import styled, { css } from 'styled-components'

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
}

const PaginationComponent: React.FC<Props & InjectedProps> = ({
  total,
  current,
  onClick,
  padding = 4,
  className = '',
  theme,
}) => {
  if (total <= 1) return null

  const prevPage = current >= 2 && (
    <li>
      <PrevPaginationItem onClick={onClick} prevPage={current - 1} />
    </li>
  )
  const pages = [
    ...range(current - padding, current).filter(page => page >= 1),
    ...range(current, current + padding + 1).filter(page => page <= total),
  ].map(page => (
    <li key={`pagination-${page}`}>
      <PaginationItem page={page} currentPage={current} onClick={onClick} />
    </li>
  ))
  const nextPage = current + 1 <= total && (
    <li>
      <NextPaginationItem onClick={onClick} nextPage={current + 1} />
    </li>
  )

  return (
    <Wrapper className={className}>
      <List theme={theme}>
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
    const { frame, palette } = theme

    return css`
      display: flex;
      border-radius: ${frame.border.radius.s};
      border: 1px solid ${palette.Border};
      margin: 0;
      padding: 0;

      & > li {
        margin: 0;
        padding: 0;
        list-style: none;

        &:not(:first-child) {
          border-left: ${frame.border.default};
        }

        &:first-child > .PaginationItem {
          border-top-left-radius: ${frame.border.radius.s};
          border-bottom-left-radius: ${frame.border.radius.s};
        }

        &:last-child > .PaginationItem {
          border-top-right-radius: ${frame.border.radius.s};
          border-bottom-right-radius: ${frame.border.radius.s};
        }
      }
    `
  }}
`
