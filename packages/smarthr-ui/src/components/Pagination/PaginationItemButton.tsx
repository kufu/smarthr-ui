import { type ElementType, type FC, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { AnchorButton, Button } from '../Button'

const classNameGenerator = tv({
  base: [
    'shr-rounded-s',
    'aria-current-page:[&&&]:shr-cursor-default aria-current-page:[&&&]:shr-bg-main aria-current-page:[&&&]:shr-text-white',
    'aria-current-page:focus-visible:[&&&]:shr-focus-indicator',
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
    [page, localize],
  )

  const commonAttr = {
    variant: 'secondary',
    size: 'S',
    'aria-label': ariaLabel,
    'aria-current': disabled ? 'page' : undefined,
    className,
    children: page,
  } as const

  if (hrefTemplate) {
    return (
      <AnchorButton
        {...commonAttr}
        href={disabled ? undefined : hrefTemplate(page)}
        elementAs={disabled ? undefined : linkAs}
      />
    )
  }

  return <Button {...commonAttr} disabled={disabled} value={page} />
}
