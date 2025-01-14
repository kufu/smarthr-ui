import React, { useMemo } from 'react'

import { Button } from '../Button'

type Props = {
  page: number
  currentPage: number
  onClick: (pageNumber: number) => void
}

export const PaginationItemButton: React.FC<Props> = ({ page, currentPage, onClick }) => {
  const attrs = useMemo(() => {
    if (page === currentPage) {
      return {
        'aria-current': 'page',
        disabled: true,
      }
    }

    return {
      disabled: false,
    }
  }, [currentPage, page])

  return (
    <Button
      {...attrs}
      aria-label={`${page}ページ目`}
      onClick={() => onClick(page)}
      square
      size="s"
      className="shr-rounded-s aria-current-page:shr-cursor-default aria-current-page:shr-border-solid aria-current-page:shr-border-main aria-current-page:shr-bg-main aria-current-page:shr-text-white"
    >
      {page}
    </Button>
  )
}
