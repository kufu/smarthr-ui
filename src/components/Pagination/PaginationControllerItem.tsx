import React, { FC } from 'react'

import { useTheme } from '../../hooks/useTheme'

import { ItemButton } from './PaginationItem'
import { Icon } from '../Icon'

type Props = {
  targetPage: number
  onClick: (pageNumber: number) => void
  direction: 'prev' | 'next'
  disabled: boolean
  double?: boolean
}

export const PaginationControllerItem: FC<Props> = ({
  direction,
  disabled,
  double,
  targetPage,
  onClick,
}) => {
  const theme = useTheme()

  return (
    <ItemButton
      square
      size="s"
      className="paginationItem"
      onClick={() => onClick(targetPage)}
      disabled={disabled}
      themes={theme}
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
