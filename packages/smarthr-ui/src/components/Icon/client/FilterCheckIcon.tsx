'use client'

import { type FC, memo } from 'react'

import { useIntl } from '../../../intl'
import { FaCircleCheckIcon } from '../FaIcon'

export const FilterCheckIcon: FC<{
  alt?: string
}> = memo(({ alt }) => {
  const { localize } = useIntl()

  // HINT: altに揃えたいが、styleが複雑になってしまうためaria-labelを利用している
  const actualAlt =
    alt ||
    localize({
      id: 'smarthr-ui/FilterDropdown/status',
      defaultText: '適用中',
    })

  return (
    <FaCircleCheckIcon
      className="shr-absolute shr-bottom-[2px] shr-right-[-4px] shr-h-[0.5em] shr-w-[0.5em]"
      aria-label={actualAlt}
    />
  )
})
