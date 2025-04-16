import { type MouseEvent, memo, useCallback, useMemo } from 'react'
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
  onClickClose: () => void
}

const LOCALE_KEYS = Object.keys(localeMap)

export const LanguageSelector = memo<Props>(({ locale, onClickClose }) => {
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
      <SelectorHeading
        onClickClose={onClickClose}
        wrapperClassName={classNames.header}
        className={classNames.headerTitle}
      />
      <div className={classNames.buttonWrapper}>
        {LOCALE_KEYS.map((localeKey) => (
          <LocaleButton
            key={localeKey}
            value={localeKey as Locale}
            onClick={onClickLocale}
            selected={localeKey === locale.selectedLocale}
            className={classNames.button}
          />
        ))}
      </div>
    </Section>
  )
})

const SelectorHeading = memo<
  Pick<Props, 'onClickClose'> & { wrapperClassName: string; className: string }
>(({ onClickClose, wrapperClassName, className }) => (
  <div className={wrapperClassName}>
    <Heading className={className}>Language</Heading>
    <Button type="button" size="s" onClick={onClickClose}>
      <FaXmarkIcon alt="close" />
    </Button>
  </div>
))

const LocaleButton = memo<{
  value: Locale
  selected: boolean
  className: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}>(({ value, selected, className, onClick }) => (
  <CommonButton
    elementAs="button"
    type="button"
    value={value}
    onClick={onClick}
    prefix={selected && <FaCheckIcon color="MAIN" />}
    className={className}
  >
    {localeMap[value]}
  </CommonButton>
))
