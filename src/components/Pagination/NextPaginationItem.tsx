import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { ItemButton } from './PaginationItem'
import { Icon } from '../Icon'

interface Props {
  nextPage: number
  onClick: (pageNumber: number) => void
  disabled: boolean
  double?: boolean
}

class NextPaginationItemComponent extends React.PureComponent<Props & InjectedProps> {
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
          <Icon name={this.props.double ? 'fa-angle-double-right' : 'fa-chevron-right'} />
        </Button>
      </React.Fragment>
    )
  }

  private onClick = () => {
    const { onClick, nextPage } = this.props
    onClick(nextPage)
  }
}

export const NextPaginationItem = withTheme(NextPaginationItemComponent)

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
