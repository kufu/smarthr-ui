import { useCallback } from 'react'

import { translate } from '../multilingualization'
import { Messages } from '../multilingualization/messages'

import { useLocale } from './useLocale'

export const useTranslate = () => {
  const { locale } = useLocale()

  return useCallback(
    <ID extends keyof Messages>(id: ID) => translate(id, locale?.selectedLocale),
    [locale?.selectedLocale],
  )
}
