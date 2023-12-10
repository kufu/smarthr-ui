import React, { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../Button'

const paginationItem = tv({
  base: ['shr-rounded-s'],
  variants: {
    active: {
      true: [
        'active',
        'shr-bg-main',
        'focus-visible:shr-bg-main',
        'focus-visible:shr-border-main',
        'disabled:shr-cursor-default',
        'disabled:shr-outline-none',
        'disabled:shr-border-solid',
        'disabled:shr-border-main',
        'disabled:shr-bg-main',
        'disabled:shr-text-white',
      ],
    },
  },
})

type Props = {
  page: number
  currentPage: number
  onClick: (pageNumber: number) => void
}

export const PaginationItemButton: React.FC<Props> = ({ page, currentPage, onClick }) => {
  const itemStyle = useMemo(
    () => paginationItem({ active: page === currentPage }),
    [page, currentPage],
  )

  if (page === currentPage) {
    return (
      <Button
        square
        size="s"
        className={itemStyle}
        aria-current="page"
        aria-label={`${page}ページ目`}
        disabled
      >
        {page}
      </Button>
    )
  }

  return (
    <Button
      square
      size="s"
      className={itemStyle}
      onClick={() => onClick(page)}
      aria-label={`${page}ページ目`}
    >
      {page}
    </Button>
  )
}
