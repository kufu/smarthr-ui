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

const ICON_MAPPER = {
  prev: {
    single: { Icon: FaChevronLeftIcon, alt: '前へ' },
    double: { Icon: FaAngleDoubleLeftIcon, alt: '最初へ' },
  },
  next: {
    single: { Icon: FaChevronRightIcon, alt: '次へ' },
    double: { Icon: FaAngleDoubleRightIcon, alt: '最後へ' },
  },
}

export const PaginationControllerItemButton: React.FC<Props> = ({
  direction,
  disabled,
  double,
  targetPage,
  onClick,
}) => {
  const { Icon, alt } = ICON_MAPPER[direction][double ? 'double' : 'single']

  return (
    <Button
      square
      size="s"
      className="shr-rounded-s"
      onClick={() => onClick(targetPage)}
      disabled={disabled}
      aria-label={alt}
    >
      <Icon color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} alt={alt} />
    </Button>
  )
}
