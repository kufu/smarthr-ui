import { Button } from '../Button'
import {
  FaAngleDoubleLeftIcon,
  FaAngleDoubleRightIcon,
  FaChevronLeftIcon,
  FaChevronRightIcon,
} from '../Icon'

import type { FC } from 'react'

type Props = {
  targetPage: number
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

export const PaginationControllerItemButton: FC<Props> = ({
  direction,
  disabled,
  double,
  targetPage,
}) => {
  const { Icon, alt } = ICON_MAPPER[direction][double ? 'double' : 'single']

  return (
    <Button
      aria-label={alt}
      disabled={disabled}
      value={targetPage}
      square
      size="s"
      className="shr-rounded-s"
    >
      <Icon color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} alt={alt} />
    </Button>
  )
}
