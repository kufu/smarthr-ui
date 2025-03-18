import { useCallback } from 'react'

import { translate } from '../multilingualization'

import { useLocale } from './useLocale'

import type { Messages } from '../multilingualization/messages'

export const useTranslate = () => {
  const { locale } = useLocale()

  return useCallback(
    <ID extends keyof Messages>(id: ID) => translate(id, locale?.selectedLocale),
    [locale?.selectedLocale],
  )
}
