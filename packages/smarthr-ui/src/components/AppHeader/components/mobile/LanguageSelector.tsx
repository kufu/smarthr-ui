import { type FC, type MouseEvent, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCheckIcon, FaXmarkIcon } from '../../../Icon'
import { Section } from '../../../SectioningContent'
import { type Locale, localeMap } from '../../multilingualization'
import { CommonButton } from '../common/CommonButton'

import type { LocaleProps } from '../../types'

const classNameGenerator = tv({
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
  const classNames = useMemo(() => {
    const { header, headerTitle, buttonWrapper, button } = classNameGenerator()

    return {
      header: header(),
      headerTitle: headerTitle(),
      buttonWrapper: buttonWrapper(),
      button: button(),
    }
  }, [])

  const onClickLocale = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      locale.onSelectLocale(e.currentTarget.value as Locale)
    },
    [locale],
  )

  return (
    <Section>
      <div className={classNames.header}>
        <Heading className={classNames.headerTitle}>Language</Heading>
        <Button type="button" size="s" square onClick={onClickClose}>
          <FaXmarkIcon alt="close" />
        </Button>
      </div>

      <div className={classNames.buttonWrapper}>
        {Object.keys(localeMap).map((localeKey) => (
          <CommonButton
            key={localeKey}
            elementAs="button"
            type="button"
            value={localeKey}
            onClick={onClickLocale}
            prefix={localeKey === locale.selectedLocale && <FaCheckIcon color="MAIN" />}
            className={classNames.button}
          >
            {localeMap[localeKey as Locale]}
          </CommonButton>
        ))}
      </div>
    </Section>
  )
}
