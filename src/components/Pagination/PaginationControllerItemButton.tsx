import React from 'react'

import { Button } from '../Button'
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
  alt: '最初へ' | '前へ' | '次へ' | '最後へ'
} =>
  direction === 'prev'
    ? double
      ? { Icon: FaAngleDoubleLeftIcon, alt: '最初へ' }
      : { Icon: FaChevronLeftIcon, alt: '前へ' }
    : double
      ? { Icon: FaAngleDoubleRightIcon, alt: '最後へ' }
      : { Icon: FaChevronRightIcon, alt: '次へ' }

export const PaginationControllerItemButton: React.FC<Props> = ({
  direction,
  disabled,
  double = false,
  targetPage,
  onClick,
}) => {
  const { Icon, ...iconProps } = getIconProps(direction, double)

  return (
    <Button
      square
      size="s"
      className="shr-rounded-s"
      onClick={() => onClick(targetPage)}
      disabled={disabled}
      aria-label={iconProps.alt}
    >
      <Icon color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} alt={iconProps.alt} />
    </Button>
  )
}
