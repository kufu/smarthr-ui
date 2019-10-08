import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { SecondaryButton } from '../Button'

interface Props {
  page: number
  currentPage: number
  onClick: (pageNumber: number) => void
}

class PaginationItemComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    const { page, currentPage, theme } = this.props

    if (page === currentPage) {
      return (
        <ItemButton square size="s" className="paginationItem active" theme={theme} disabled>
          {page}
        </ItemButton>
      )
    }

    return (
      <ItemButton square size="s" className="paginationItem" onClick={this.onClick} theme={theme}>
        {page}
      </ItemButton>
    )
  }

  private onClick = () => {
    const { onClick, page } = this.props
    onClick(page)
  }
}

export const PaginationItem = withTheme(PaginationItemComponent)

export const ItemButton = styled(SecondaryButton)`
  ${({ theme }: InjectedProps) => {
    const { palette } = theme
    return css`
      &.paginationItem.s.square {
        line-height: 25px;
        border-radius: 4px;
        &.active {
          color: #fff;
          background-color: ${palette.MAIN};
          border: solid 1px ${palette.MAIN};
          cursor: default;
          outline: none;
        }
      }
    `
  }}
`
