import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { ItemButton } from './PaginationItem'

interface Props {
  prevPage: number
  onClick: (pageNumber: number) => void
}

class PrevPaginationItemComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    return (
      <Button className="PaginationItem" onClick={this.onClick} theme={this.props.theme}>
        ‹
      </Button>
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
    color: ${theme.palette.TextGrey};
  `}
`
