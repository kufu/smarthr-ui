import * as React from 'react'

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
          name={double ? 'fa-angle-double-right' : 'fa-chevron-right'}
          color={disabled ? theme.palette.TEXT_DISABLED : theme.palette.TEXT_BLACK}
          size={13}
        />
      </ItemButton>
    )
  }

  private onClick = () => {
    const { onClick, nextPage } = this.props
    onClick(nextPage)
  }
}

export const NextPaginationItem = withTheme(NextPaginationItemComponent)
