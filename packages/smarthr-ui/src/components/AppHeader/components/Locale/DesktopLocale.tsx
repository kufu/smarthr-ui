import { localeMap, useIntl } from '../../../../intl'
import { LanguageSwitcher } from '../../../Header'

import type { HeaderProps, LocaleProps } from '../../types'
import type { FC } from 'react'

type Props = Pick<HeaderProps, 'enableNew'> & {
  locale: LocaleProps
}

export const DesktopLocale: FC<Props> = ({ locale: localeProps, enableNew }) => {
  const { locale } = useIntl()

  return (
    <LanguageSwitcher
      localeMap={localeMap}
      locale={locale}
      enableNew={enableNew}
      onLanguageSelect={localeProps.onSelectLocale as (locale: string) => void}
    />
  )
}
