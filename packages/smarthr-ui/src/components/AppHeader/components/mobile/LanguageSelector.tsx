import React, { type FC } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../..'
import { Localizer } from '../../../../intl/Localizer'
import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCheckIcon, FaXmarkIcon } from '../../../Icon'
import { Section } from '../../../SectioningContent'
import { CommonButton } from '../common/CommonButton'

import type { LocaleProps } from '../../types'

type Locale = 'ja' | 'en-us' | 'id-id' | 'pt' | 'vi' | 'ko' | 'zh-cn' | 'zh-tw'

const languageSelector = tv({
  slots: {
    header: [
      'shr-flex shr-justify-between shr-gap-1 shr-items-center shr-px-1 shr-py-0.75 shr-border-b-shorthand',
    ],
    headerTitle: ['[&&]:shr-text-base shr-font-normal'],
    buttonWrapper: ['shr-p-0.5'],
    button: ['[&&:not(:has(svg))]:shr-ps-2.5'],
  },
})

type Props = {
  locale: LocaleProps
  onClickClose: (isOpen: boolean) => void
}

export const LanguageSelector: FC<Props> = ({ locale, onClickClose }) => {
  const { header, headerTitle, buttonWrapper, button } = languageSelector()
  const { localize } = useIntl()

  const onClickButton = (selectedLocale: Locale) => {
    locale.onSelectLocale(selectedLocale)
  }

  return (
    <Section>
      <div className={header()}>
        <Heading className={headerTitle()}>
          <Localizer id="smarthr-ui/AppHeader/language" defaultText="日本語" values={{}} />
        </Heading>

        <Button
          type="button"
          size="s"
          square
          onClick={() => {
            onClickClose(false)
          }}
        >
          <FaXmarkIcon
            role="img"
            aria-label={localize({
              id: 'smarthr-ui/AppHeader/closeMenu',
              defaultText: 'メニューを閉じる',
            })}
          />
        </Button>
      </div>

      <div className={buttonWrapper()}>
        {Object.entries({
          ja: '日本語',
          'id-id': 'Bahasa Indonesia',
          'en-us': 'English',
          pt: 'Português',
          vi: 'Tiếng Việt',
          ko: '한국어',
          'zh-cn': '简体中文',
          'zh-tw': '繁體中文',
        }).map(([localeKey, label]) => (
          <CommonButton
            key={localeKey}
            elementAs="button"
            className={button()}
            type="button"
            onClick={() => onClickButton(localeKey as Locale)}
            prefix={localeKey === locale.selectedLocale && <FaCheckIcon color="MAIN" />}
          >
            {label}
          </CommonButton>
        ))}
      </div>
    </Section>
  )
}
