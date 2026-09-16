'use client'

import { memo } from 'react'

import { useIntl } from '../../../intl'
import { FaCircleCheckIcon } from '../../Icon'

import type { FC } from 'react'

type Props = {
  className?: string
  iconAlt?: string
}

export const FilteredIcon: FC<Props> = memo(({ className, iconAlt }) => {
  const { localize } = useIntl()

  const alt =
    iconAlt ||
    localize({
      id: 'smarthr-ui/FilterDropdown/status',
      defaultText: '適用中',
    })

  return <FaCircleCheckIcon className={className} aria-label={alt} />
})
