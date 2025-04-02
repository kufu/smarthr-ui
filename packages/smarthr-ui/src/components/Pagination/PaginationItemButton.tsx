import { type ComponentProps, type ElementType, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton, Button } from '../Button'

const classNameGenerator = tv({
  base: [
    'shr-rounded-s',
    'aria-current-page:[&&&]:shr-cursor-default aria-current-page:[&&&]:shr-bg-main aria-current-page:[&&&]:shr-text-white',
    'aria-current-page:[&&&]:shr-border-solid aria-current-page:[&&&]:shr-border-main',
  ],
})

type Props = {
  page: number
  disabled: boolean
  hrefTemplate?: (pageNumber: number) => string
  linkAs?: ElementType
}

export const PaginationItemButton: FC<Props> = ({ page, disabled, hrefTemplate, linkAs }) => {
  const className = useMemo(() => classNameGenerator(), [])
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
          elementAs: linkAs,
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
  }, [disabled, page, hrefTemplate, linkAs])

  return (
    <Component {...attrs} square size="s" className={className}>
      {page}
    </Component>
  )
}
