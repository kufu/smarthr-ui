import * as React from 'react'
import styled, { css } from 'styled-components'

import { hoverable } from '../../hocs/hoverable'
import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { isTouchDevice } from '../../libs/ua'

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
        <Item className="PaginationItem active" theme={theme}>
          {page}
        </Item>
      )
    }

    return (
      <ItemButton className="PaginationItem" onClick={this.onClick} theme={theme}>
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

const Item = styled.span`
  ${({ theme }: InjectedProps) => {
    const { size, palette, interaction } = theme

    return css`
      display: inline-block;
      width: 34px;
      padding: 0;
      border: none;
      background-color: #fff;
      font-size: ${size.pxToRem(size.font.TALL)};
      color: ${palette.MAIN};
      line-height: 32px;
      text-align: center;
      cursor: pointer;
      outline: 0;
      transition: ${isTouchDevice ? 'none' : `background-color ${interaction.hover.animation}`};

      &.active {
        color: #fff;
        background-color: ${palette.MAIN};
      }

      &.hover {
        color: ${palette.MAIN};
        background-color: ${palette.hoverColor('#fff')};
      }
    `
  }}
`

export const ItemButton = hoverable()(Item.withComponent('button'))
