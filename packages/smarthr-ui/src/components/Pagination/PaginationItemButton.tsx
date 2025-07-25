import { type ComponentProps, type ElementType, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
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
  const { localize } = useIntl()
  const className = useMemo(() => classNameGenerator(), [])

  const ariaLabel = useMemo(
    () =>
      localize(
        {
          id: 'smarthr-ui/Pagination/itemButtonLabel',
          defaultText: '{page}ページ目',
        },
        { page },
      ),
    [localize, page],
  )

  const { Component, attrs } = useMemo(() => {
    const common = {
      'aria-label': ariaLabel,
      'aria-current': disabled ? 'page' : undefined,
    }

    if (hrefTemplate) {
      return {
        Component: AnchorButton,
        attrs: {
          ...common,
          // HINT: elementAsにnext/linkを設定した場合、hrefがundefinedでは
          // エラーになってしまうため、undefinedで指定されていない状態にする
          ...(disabled
            ? {
                href: undefined,
                elementAs: undefined,
              }
            : {
                href: hrefTemplate(page),
                elementAs: linkAs,
              }),
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
  }, [disabled, page, hrefTemplate, linkAs, ariaLabel])

  return (
    <Component {...attrs} size="s" className={className}>
      {page}
    </Component>
  )
}
