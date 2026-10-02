'use client'

import { memo } from 'react'

import { useIntl } from '../../../intl'
import { FaCircleCheckIcon } from '../../Icon'

import type { FC } from 'react'

type Props = {
  className?: string
  alt?: string
}

export const FilteredIcon: FC<Props> = memo(({ className, alt }) => {
  const { localize } = useIntl()

  // HINT: altに揃えたいが、styleが複雑になってしまうためaria-labelを利用している
  const actualAlt =
    alt ||
    localize({
      id: 'smarthr-ui/FilterDropdown/status',
      defaultText: '適用中',
    })

  return <FaCircleCheckIcon className={className} aria-label={actualAlt} />
})
