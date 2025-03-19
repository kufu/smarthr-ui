import { tv } from 'tailwind-variants'

import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCheckIcon, FaXmarkIcon } from '../../../Icon'
import { Section } from '../../../SectioningContent'
import { type Locale, localeMap } from '../../multilingualization'
import { CommonButton } from '../common/CommonButton'

import type { LocaleProps } from '../../types'
import type { FC } from 'react'

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

  const onClickButton = (selectedLocale: Locale) => {
    locale.onSelectLocale(selectedLocale)
  }

  return (
    <Section>
      <div className={header()}>
        <Heading className={headerTitle()}>Language</Heading>

        <Button
          type="button"
          size="s"
          square
          onClick={() => {
            onClickClose(false)
          }}
        >
          <FaXmarkIcon role="img" aria-label="close" />
        </Button>
      </div>

      <div className={buttonWrapper()}>
        {Object.keys(localeMap).map((localeKey) => (
          <CommonButton
            key={localeKey}
            elementAs="button"
            className={button()}
            type="button"
            onClick={() => onClickButton(localeKey as Locale)}
            prefix={localeKey === locale.selectedLocale && <FaCheckIcon color="MAIN" />}
          >
            {localeMap[localeKey as Locale]}
          </CommonButton>
        ))}
      </div>
    </Section>
  )
}
