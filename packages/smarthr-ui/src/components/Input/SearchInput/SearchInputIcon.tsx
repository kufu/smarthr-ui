'use client'

import { Localizer } from '../../../intl'
import { FaMagnifyingGlassIcon } from '../../Icon'

export const SearchInputIcon = () => (
  <FaMagnifyingGlassIcon
    alt={<Localizer id="smarthr-ui/SearchInput/iconAlt" defaultText="検索" />}
    color="TEXT_GREY"
  />
)
