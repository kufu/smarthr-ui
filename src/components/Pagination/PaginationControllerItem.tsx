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

const getIconProps = (
  direction: 'prev' | 'next',
  double: boolean,
): {
  name: 'fa-angle-double-left' | 'fa-chevron-left' | 'fa-angle-double-right' | 'fa-chevron-right'
  visuallyHiddenText: '最初へ' | '前へ' | '次へ' | '最後へ'
} => {
  return direction === 'prev'
    ? double
      ? { name: 'fa-angle-double-left', visuallyHiddenText: '最初へ' }
      : { name: 'fa-chevron-left', visuallyHiddenText: '前へ' }
    : double
    ? { name: 'fa-angle-double-right', visuallyHiddenText: '最後へ' }
    : { name: 'fa-chevron-right', visuallyHiddenText: '次へ' }
}

export const PaginationControllerItem: FC<Props> = ({
  direction,
  disabled,
  double = false,
  targetPage,
  onClick,
}) => {
  const theme = useTheme()
  const iconProps = getIconProps(direction, double)

  return (
    <ItemButton
      square
      size="s"
      className="paginationItem"
      onClick={() => onClick(targetPage)}
      disabled={disabled}
      themes={theme}
      aria-label={iconProps.visuallyHiddenText}
    >
      <Icon
        name={iconProps.name}
        color={disabled ? theme.palette.TEXT_DISABLED : theme.palette.TEXT_BLACK}
        visuallyHiddenText={iconProps.visuallyHiddenText}
        size={13}
      />
    </ItemButton>
  )
}
