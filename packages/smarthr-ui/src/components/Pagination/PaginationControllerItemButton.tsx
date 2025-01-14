import React, { useCallback } from 'react'

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

  const actualOnClick = useCallback(
    (e: React.MouseEvent) => onClick(parseInt(e.currentTarget.value, 10)),
    [],
  )

  return (
    <Button
      aria-label={alt}
      disabled={disabled}
      onClick={actualOnClick}
      value={targetPage}
      square
      size="s"
      className="shr-rounded-s"
    >
      <Icon color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} alt={alt} />
    </Button>
  )
}
