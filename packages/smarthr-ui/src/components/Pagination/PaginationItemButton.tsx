import React, { useMemo } from 'react'

import { Button } from '../Button'

type Props = {
  page: number
  disabled: boolean
}

export const PaginationItemButton: React.FC<Props> = ({ page, disabled }) => {
  const attrs = useMemo(() => {
    const result: {
      'aria-label': string
      disabled: boolean
      'aria-current'?: 'page'
    } = {
      'aria-label': `${page}ページ目`,
      disabled,
    }

    if (disabled) {
      result['aria-current'] = 'page'
    }

    return result
  }, [disabled, page])

  return (
    <Button
      {...attrs}
      value={page}
      square
      size="s"
      className="shr-rounded-s aria-current-page:shr-cursor-default aria-current-page:shr-border-solid aria-current-page:shr-border-main aria-current-page:shr-bg-main aria-current-page:shr-text-white"
    >
      {page}
    </Button>
  )
}
