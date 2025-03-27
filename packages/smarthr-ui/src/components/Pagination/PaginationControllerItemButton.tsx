import { type ComponentProps, type FC, useMemo } from 'react'

import { AnchorButton, Button } from '../Button'
import {
  FaAngleDoubleLeftIcon,
  FaAngleDoubleRightIcon,
  FaChevronLeftIcon,
  FaChevronRightIcon,
} from '../Icon'

type Props = {
  targetPage: number
  direction: 'prev' | 'next'
  disabled: boolean
  double?: boolean
  hrefTemplate?: (pageNumber: number) => string
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
  hrefTemplate,
}) => {
  const { Icon, alt } = ICON_MAPPER[direction][double ? 'double' : 'single']

  const { Component, attrs } = useMemo(() => {
    if (hrefTemplate) {
      return {
        Component: AnchorButton,
        attrs: {
          href: disabled ? undefined : hrefTemplate(targetPage),
        } as ComponentProps<typeof AnchorButton>,
      }
    }

    return {
      Component: Button,
      attrs: {
        disabled,
        value: targetPage,
      } as ComponentProps<typeof Button>,
    }
  }, [targetPage, disabled, hrefTemplate])

  return (
    <Component {...attrs} square size="s" className="shr-rounded-s">
      <Icon color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} alt={alt} />
    </Component>
  )
}
