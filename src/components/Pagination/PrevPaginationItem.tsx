import * as React from 'react'

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
    const { theme, double, disabled } = this.props
    return (
      <ItemButton
        square
        size="s"
        className="paginationItem"
        onClick={this.onClick}
        theme={theme}
        disabled={disabled}
      >
        <Icon
          name={double ? 'fa-angle-double-left' : 'fa-chevron-left'}
          color={disabled ? theme.palette.TEXT_DISABLED : theme.palette.TEXT_BLACK}
          size={13}
        />
      </ItemButton>
    )
  }

  private onClick = () => {
    const { onClick, prevPage } = this.props
    onClick(prevPage)
  }
}

export const PrevPaginationItem = withTheme(PrevPaginationItemComponent)
