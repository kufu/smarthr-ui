import React, { VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'

type Props = {
  page: number
  currentPage: number
  onClick: (pageNumber: number) => void
}

export const PaginationItem: VFC<Props> = ({ page, currentPage, onClick }) => {
  const theme = useTheme()

  if (page === currentPage) {
    return (
      <ItemButton
        className="active"
        themes={theme}
        aria-current="page"
        aria-label={`${page}ページ目`}
        disabled
      >
        {page}
      </ItemButton>
    )
  }

  return (
    <ItemButton onClick={() => onClick(page)} themes={theme} aria-label={`${page}ページ目`}>
      {page}
    </ItemButton>
  )
}

export const ItemButton = styled(Button).attrs({
  square: true,
  size: 's',
})<{ themes: Theme }>`
  ${({ themes: { color, radius } }) => css`
    border-radius: ${radius.s};
    &.active {
      cursor: default;
      outline: none;
      border: 1px solid ${color.MAIN};
      background-color: ${color.MAIN};
      color: ${color.TEXT_WHITE};
    }
  `}
`
