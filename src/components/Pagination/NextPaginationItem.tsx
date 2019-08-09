import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { ItemButton } from './PaginationItem'

interface Props {
  nextPage: number
  onClick: (pageNumber: number) => void
}

class NextPaginationItemComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    return (
      <Button className="PaginationItem" onClick={this.onClick} theme={this.props.theme}>
        ›
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
    color: ${theme.palette.TEXT_GREY};
  `}
`
