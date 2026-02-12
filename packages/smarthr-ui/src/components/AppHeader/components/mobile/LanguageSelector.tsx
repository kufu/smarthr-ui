import { type MouseEvent, memo, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { type Locale, localeMap } from '../../../../intl/localeMap'
import { Button } from '../../../Button'
import { Heading } from '../../../Heading'
import { FaCheckIcon, FaXmarkIcon } from '../../../Icon'
import { Section } from '../../../SectioningContent'
import { CommonButton } from '../common/CommonButton'

import type { LocaleProps } from '../../types'

const classNameGenerator = tv({
  slots: {
    header: [
      'shr-border-b-shorthand shr-flex shr-items-center shr-justify-between shr-gap-1 shr-px-1 shr-py-0.75',
    ],
    headerTitle: ['shr-font-normal [&&]:shr-text-base'],
    buttonWrapper: ['shr-p-0.5'],
    button: ['[&&:not(:has(svg))]:shr-ps-2.5'],
  },
})

type Props = {
  locale: LocaleProps
  onClickClose: () => void
}

export const LanguageSelector = memo<Props>(({ locale: localeProps, onClickClose }) => {
  const { locale, availableLocales } = useIntl()
  const { locales } = useMemo(
    () => ({
      locales: Object.entries(localeMap).filter(([code]) => availableLocales.includes(code)),
    }),
    [availableLocales],
  )
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
      localeProps.onSelectLocale(e.currentTarget.value as Locale)
    },
    [localeProps],
  )

  return (
    <Section>
      <SelectorHeading
        onClickClose={onClickClose}
        wrapperClassName={classNames.header}
        className={classNames.headerTitle}
      />
      <div className={classNames.buttonWrapper}>
        {locales.map(([localeKey, label]) => (
          <LocaleButton
            key={localeKey}
            value={localeKey as Locale}
            onClick={onClickLocale}
            selected={localeKey === locale}
            className={classNames.button}
          >
            {label}
          </LocaleButton>
        ))}
      </div>
    </Section>
  )
})

const SelectorHeading = memo<
  Pick<Props, 'onClickClose'> & { wrapperClassName: string; className: string }
>(({ onClickClose, wrapperClassName, className }) => (
  <div className={wrapperClassName}>
    {/* eslint-disable-next-line smarthr/require-i18n-text */}
    <Heading className={className}>Language</Heading>
    <Button type="button" size="s" onClick={onClickClose}>
      {/* eslint-disable-next-line smarthr/require-i18n-text */}
      <FaXmarkIcon alt="close" />
    </Button>
  </div>
))

const LocaleButton = memo<{
  value: Locale
  selected: boolean
  className: string
  children: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}>(({ value, selected, className, children, onClick }) => (
  <CommonButton
    elementAs="button"
    type="button"
    value={value}
    onClick={onClick}
    prefix={selected && <FaCheckIcon color="MAIN" />}
    className={className}
  >
    {children}
  </CommonButton>
))
