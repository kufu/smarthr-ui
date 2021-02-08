import React, { FC } from 'react'

import { useTheme } from '../../hooks/useTheme'

import { ItemButton } from './PaginationItem'
import {
  FaAngleDoubleLeftIcon,
  FaAngleDoubleRightIcon,
  FaChevronLeftIcon,
  FaChevronRightIcon,
  ComponentProps as IconProps,
} from '../Icon'

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
  Icon: React.ComponentType<IconProps>
  visuallyHiddenText: '最初へ' | '前へ' | '次へ' | '最後へ'
} => {
  return direction === 'prev'
    ? double
      ? { Icon: FaAngleDoubleLeftIcon, visuallyHiddenText: '最初へ' }
      : { Icon: FaChevronLeftIcon, visuallyHiddenText: '前へ' }
    : double
    ? { Icon: FaAngleDoubleRightIcon, visuallyHiddenText: '最後へ' }
    : { Icon: FaChevronRightIcon, visuallyHiddenText: '次へ' }
}

export const PaginationControllerItem: FC<Props> = ({
  direction,
  disabled,
  double = false,
  targetPage,
  onClick,
}) => {
  const theme = useTheme()
  const { Icon, ...iconProps } = getIconProps(direction, double)

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
        color={disabled ? theme.palette.TEXT_DISABLED : theme.palette.TEXT_BLACK}
        visuallyHiddenText={iconProps.visuallyHiddenText}
        size={13}
      />
    </ItemButton>
  )
}
