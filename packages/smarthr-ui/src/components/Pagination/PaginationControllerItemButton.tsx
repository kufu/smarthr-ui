import { type ComponentProps, type ElementType, type FC, useMemo } from 'react'

import { Localizer } from '../../intl'
import { AnchorButton, Button } from '../Button'
import { FaAnglesLeftIcon, FaAnglesRightIcon, FaChevronLeftIcon, FaChevronRightIcon } from '../Icon'

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
    <Component {...attrs} size="s" className="shr-rounded-s">
      <Icon color={disabled ? 'TEXT_DISABLED' : 'TEXT_BLACK'} alt={alt} />
    </Component>
  )
}
