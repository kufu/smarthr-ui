import React, { VFC } from 'react'

import { useTheme } from '../../hooks/useTheme'
import {
  FaAngleDoubleLeftIcon,
  FaAngleDoubleRightIcon,
  FaChevronLeftIcon,
  FaChevronRightIcon,
  ComponentProps as IconProps,
} from '../Icon'

import { ItemButton } from './PaginationItem'

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
  alt: '最初へ' | '前へ' | '次へ' | '最後へ'
} => direction === 'prev'
    ? double
      ? { Icon: FaAngleDoubleLeftIcon, alt: '最初へ' }
      : { Icon: FaChevronLeftIcon, alt: '前へ' }
    : double
    ? { Icon: FaAngleDoubleRightIcon, alt: '最後へ' }
    : { Icon: FaChevronRightIcon, alt: '次へ' }

export const PaginationControllerItem: VFC<Props> = ({
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
      onClick={() => onClick(targetPage)}
      disabled={disabled}
      themes={theme}
      aria-label={iconProps.alt}
    >
      <Icon
        color={disabled ? theme.color.TEXT_DISABLED : theme.color.TEXT_BLACK}
        alt={iconProps.alt}
      />
    </ItemButton>
  )
}
