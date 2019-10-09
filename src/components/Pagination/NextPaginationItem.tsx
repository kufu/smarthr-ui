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
      <Button
        square
        size="s"
        className="paginationItem"
        onClick={this.onClick}
        theme={this.props.theme}
        disabled={this.props.disabled}
      >
        <Icon name={this.props.double ? 'fa-angle-double-right' : 'fa-chevron-right'} />
      </Button>
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
    color: ${theme.palette.TEXT_BLACK};
    &.paginationItem.s.square {
      font-size: ${theme.size.pxToRem(13)};
      border-radius: 4px;
      &:disabled {
        color: ${theme.palette.TEXT_DISABLED};
      }
    }
  `}
`
