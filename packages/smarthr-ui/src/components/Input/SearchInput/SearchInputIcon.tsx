'use client'

import { useMemo } from 'react'

import { useIntl } from '../../../intl'
import { FaMagnifyingGlassIcon } from '../../Icon'

export const SearchInputIcon = () => {
  const { localize } = useIntl()

  const iconAlt = useMemo(
    () =>
      localize({
        id: 'smarthr-ui/SearchInput/iconAlt',
        defaultText: '検索',
      }),
    [localize],
  )

  return <FaMagnifyingGlassIcon alt={iconAlt} color="TEXT_GREY" />
}
