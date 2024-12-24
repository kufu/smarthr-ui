import { Messages, translation } from './messages'
import { DEFAULT_LOCALE, Locale } from './types'

export const translate = <ID extends keyof Messages>(id: ID, locale?: Locale | null) =>
  translation[locale ?? DEFAULT_LOCALE][
    id
  ] as (typeof translation)[typeof DEFAULT_LOCALE][typeof id]
