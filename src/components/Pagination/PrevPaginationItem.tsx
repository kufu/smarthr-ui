import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { ItemButton } from './PaginationItem'
import { Icon } from '../Icon'

interface Props {
  prevPage: number
  onClick: (pageNumber: number) => void
  disabled: boolean
  double?: boolean
}

class PrevPaginationItemComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    return (
      <React.Fragment>
        <Button
          square
          size="s"
          className="PaginationItem"
          onClick={this.onClick}
          theme={this.props.theme}
          disabled={this.props.disabled}
        >
          <Icon name={this.props.double ? 'fa-angle-double-left' : 'fa-chevron-left'} />
        </Button>
      </React.Fragment>
    )
  }

  private onClick = () => {
    const { onClick, prevPage } = this.props
    onClick(prevPage)
  }
}

export const PrevPaginationItem = withTheme(PrevPaginationItemComponent)

const Button = styled(ItemButton)`
  ${({ theme }: InjectedProps) => css`
    color: ${theme.palette.TEXT_GREY};
    &.PaginationItem.s.square {
      font-size: 13px;
      &:disabled {
        border-bottom-color: #c1c1c1;
        color: #c1c1c1;
      }
    }
  `}
`
