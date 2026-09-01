import { Localizer } from '../../intl'
import { AnchorButton, Button } from '../Button'
import { FaAnglesLeftIcon, FaAnglesRightIcon, FaChevronLeftIcon, FaChevronRightIcon } from '../Icon'

import type { ElementType, FC } from 'react'

type Props = {
  targetPage: number
  direction: 'prev' | 'next'
  disabled: boolean
  double?: boolean
  hrefTemplate?: (pageNumber: number) => string
  linkAs?: ElementType
}

const ICON_MAPPER = {
  prev: {
    single: {
      Icon: FaChevronLeftIcon,
      alt: (
        <Localizer
          id="smarthr-ui/Pagination/controllerItemButtonPreviousLabel"
          defaultText="前へ"
        />
      ),
    },
    double: {
      Icon: FaAnglesLeftIcon,
      alt: (
        <Localizer id="smarthr-ui/Pagination/controllerItemButtonFirstLabel" defaultText="最初へ" />
      ),
    },
  },
  next: {
    single: {
      Icon: FaChevronRightIcon,
      alt: (
        <Localizer id="smarthr-ui/Pagination/controllerItemButtonNextLabel" defaultText="次へ" />
      ),
    },
    double: {
      Icon: FaAnglesRightIcon,
      alt: (
        <Localizer id="smarthr-ui/Pagination/controllerItemButtonLastLabel" defaultText="最後へ" />
      ),
    },
  },
}

export const PaginationControllerItemButton: FC<Props> = ({
  direction,
  disabled,
  double,
  targetPage,
  hrefTemplate,
  linkAs,
}) => {
  const { Icon, alt } = ICON_MAPPER[direction][double ? 'double' : 'single']

  const commonAttrs = {
    variant: 'secondary',
    size: 'S',
    className: 'shr-rounded-s',
    children: <Icon alt={alt} color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} />,
  } as const

  if (hrefTemplate) {
    return (
      <AnchorButton
        {...commonAttrs}
        elementAs={disabled ? undefined : linkAs}
        href={disabled ? undefined : hrefTemplate(targetPage)}
      />
    )
  }

  return <Button {...commonAttrs} disabled={disabled} value={targetPage} />
}
