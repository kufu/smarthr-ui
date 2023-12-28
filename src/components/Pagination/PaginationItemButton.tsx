import React, { useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../Button'

const paginationItem = tv({
  base: ['shr-rounded-s'],
  variants: {
    disabled: {
      true: [
        'disabled:shr-border-solid',
        'disabled:shr-border-main',
        'disabled:shr-text-white',
        '[&&&]:disabled:shr-bg-main',
        '[&&&]:disabled:shr-cursor-default',
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
  const isCurrent = useMemo(() => page === currentPage, [page, currentPage])
  const itemStyle = useMemo(() => paginationItem({ disabled: isCurrent }), [page, currentPage])

  return (
    <Button
      square
      size="s"
      className={itemStyle}
      aria-current={isCurrent ? 'page' : undefined}
      aria-label={`${page}ページ目`}
      onClick={isCurrent ? undefined : () => onClick(page)}
      disabled={isCurrent}
    >
      {page}
    </Button>
  )
}
