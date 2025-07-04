import { type ComponentProps, type ElementType, type FC, useMemo } from 'react'

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
  linkAs?: ElementType
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
  linkAs,
}) => {
  const { Icon, alt } = ICON_MAPPER[direction][double ? 'double' : 'single']

  const { Component, attrs } = useMemo(() => {
    if (hrefTemplate) {
      return {
        Component: AnchorButton,
        // HINT: elementAsにnext/linkを設定した場合、hrefがundefinedでは
        // エラーになってしまうため、undefinedで指定されていない状態にする
        attrs: (disabled
          ? {
              href: undefined,
              elementAs: undefined,
            }
          : {
              href: hrefTemplate(targetPage),
              elementAs: linkAs,
            }) as ComponentProps<typeof AnchorButton>,
      }
    }

    return {
      Component: Button,
      attrs: {
        disabled,
        value: targetPage,
      } as ComponentProps<typeof Button>,
    }
  }, [targetPage, disabled, hrefTemplate, linkAs])

  return (
    <Component {...attrs} variant="secondary" size="s" className="shr-rounded-s">
      <Icon color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} alt={alt} />
    </Component>
  )
}
