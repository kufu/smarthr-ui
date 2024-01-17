import React, { useMemo } from 'react'

import { Button } from '../Button'

type Props = {
  page: number
  currentPage: number
  onClick: (pageNumber: number) => void
}

export const PaginationItemButton: React.FC<Props> = ({ page, currentPage, onClick }) => {
  const isCurrent = useMemo(() => page === currentPage, [page, currentPage])

  return (
    <Button
      square
      size="s"
      className="shr-rounded-s aria-current-page:shr-cursor-default aria-current-page:shr-border-solid aria-current-page:shr-border-main aria-current-page:shr-bg-main aria-current-page:shr-text-white"
      aria-current={isCurrent ? 'page' : undefined}
      aria-label={`${page}ページ目`}
      onClick={isCurrent ? undefined : () => onClick(page)}
      disabled={isCurrent}
    >
      {page}
    </Button>
  )
}
