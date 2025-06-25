'use client'

import { useMemo } from 'react'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { useIntl } from '../../../intl'
import { FaMagnifyingGlassIcon } from '../../Icon'

type Props = {
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

type DecoratorKeyTypes = 'iconAlt'

export const SearchInputIcon = ({ decorators }: Props) => {
  const { localize } = useIntl()

  const decoratorDefaultTexts = useMemo(
    () => ({
      iconAlt: localize({
        id: 'smarthr-ui/SearchInput/iconAlt',
        defaultText: '検索',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

  return <FaMagnifyingGlassIcon alt={decorated.iconAlt} color="TEXT_GREY" />
}
