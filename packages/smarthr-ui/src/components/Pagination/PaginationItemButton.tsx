import { type ComponentProps, type FC, useMemo } from 'react'

import { AnchorButton, Button } from '../Button'

type Props = {
  page: number
  disabled: boolean
  hrefTemplate?: (pageNumber: number) => string
}

export const PaginationItemButton: FC<Props> = ({ page, disabled, hrefTemplate }) => {
  const { Component, attrs } = useMemo(() => {
    const common = {
      'aria-label': `${page}ページ目`,
      'aria-current': disabled ? 'page' : undefined,
    }

    if (hrefTemplate) {
      return {
        Component: AnchorButton,
        attrs: {
          ...common,
          href: disabled ? undefined : hrefTemplate(page),
        } as ComponentProps<typeof AnchorButton>,
      }
    }

    return {
      Component: Button,
      attrs: {
        ...common,
        disabled,
        value: page,
      } as ComponentProps<typeof Button>,
    }
  }, [disabled, page, hrefTemplate])

  return (
    <Component
      {...attrs}
      square
      size="s"
      className="shr-rounded-s aria-current-page:[&&&]:shr-cursor-default aria-current-page:[&&&]:shr-border-solid aria-current-page:[&&&]:shr-border-main aria-current-page:[&&&]:shr-bg-main aria-current-page:[&&&]:shr-text-white"
    >
      {page}
    </Component>
  )
}
