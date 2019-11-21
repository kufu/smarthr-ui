import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

import { SecondaryButton } from '../Button'

interface Props {
  page: number
  currentPage: number
  onClick: (pageNumber: number) => void
}

export const PaginationItem: FC<Props> = ({ page, currentPage, onClick }) => {
  const theme = useTheme()

  if (page === currentPage) {
    return (
      <ItemButton square size="s" className="paginationItem active" themes={theme} disabled>
        {page}
      </ItemButton>
    )
  }

  return (
    <ItemButton
      square
      size="s"
      className="paginationItem"
      onClick={() => onClick(page)}
      themes={theme}
    >
      {page}
    </ItemButton>
  )
}

export const ItemButton = styled(SecondaryButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { MAIN } = themes.palette

    return css`
      &.paginationItem.s.square {
        line-height: 25px;
        border-radius: 4px;
        &.active {
          color: #fff;
          background-color: ${MAIN};
          border: solid 1px ${MAIN};
          cursor: default;
          outline: none;
        }
      }
    `
  }}
`
