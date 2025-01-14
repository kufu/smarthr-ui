import React, { useCallback, useMemo } from 'react'

import { Button } from '../Button'

type Props = {
  page: number
  currentPage: number
  onClick: () => void
}

export const PaginationItemButton: React.FC<Props> = ({ page, currentPage, onClick }) => {
  const attrs = useMemo(() => {
    const disabled = page === currentPage
    const result = {
      'aria-label': `${page}ページ目`,
      disabled,
    }

    if (disabled) {
      result['aria-current'] = 'page'
    }

    return result
  }, [currentPage, page])

  return (
    <Button
      {...attrs}
      onClick={onClick}
      value={page}
      square
      size="s"
      className="shr-rounded-s aria-current-page:shr-cursor-default aria-current-page:shr-border-solid aria-current-page:shr-border-main aria-current-page:shr-bg-main aria-current-page:shr-text-white"
    >
      {page}
    </Button>
  )
}
