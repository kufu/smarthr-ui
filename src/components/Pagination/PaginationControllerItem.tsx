import * as React from 'react'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

import { ItemButton } from './PaginationItem'
import { Icon } from '../Icon'

interface Props {
  targetPage: number
  onClick: (pageNumber: number) => void
  direction: 'prev' | 'next'
  disabled: boolean
  double?: boolean
}

class PaginationControllerItemComponent extends React.PureComponent<Props & InjectedProps> {
  public render() {
    const { theme, direction, disabled, double } = this.props
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
          name={
            direction === 'prev'
              ? double
                ? 'fa-angle-double-left'
                : 'fa-chevron-left'
              : double
              ? 'fa-angle-double-right'
              : 'fa-chevron-right'
          }
          color={disabled ? theme.palette.TEXT_DISABLED : theme.palette.TEXT_BLACK}
          size={13}
        />
      </ItemButton>
    )
  }

  private onClick = () => {
    const { onClick, targetPage } = this.props
    onClick(targetPage)
  }
}

export const PaginationControllerItem = withTheme(PaginationControllerItemComponent)
