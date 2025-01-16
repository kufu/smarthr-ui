'use client'

import React, { HTMLAttributes, useMemo } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { tabbable } from '../../../libs/tabbable'
import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon, FaGlobeIcon, LanguageIcon } from '../../Icon'

import type { DecoratorsType, LocaleMap } from '../../../types'

export type Props = {
  narrow?: boolean
  localeMap: LocaleMap
  locale?: string
  defaultLocale?: string
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'triggerLabel' | 'checkIconAlt'>
  /** 言語切替UIで言語を選択した時に発火するコールバック関数 */
  onLanguageSelect?: (code: string) => void
} & VariantProps<typeof appLauncher>

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

const TRIGGER_LABEL = 'Language'
const CHECK_ICON_ALT = '選択中'
const ARROW_KEY_REGEX = /^Arrow(Up|Down|Left|Right)$/
const ARROW_UPS_REGEX = /^Arrow(Up|Left)$/

const appLauncher = tv({
  slots: {
    switchButton: [
      'shr-border-none shr-font-normal shr-text-white shr-transition-transform shr-duration-100 shr-bg-transparent shr-px-0.25',
      'hover:shr-border-transparent hover:shr-bg-transparent',
      'focus-visible:shr-border-transparent focus-visible:shr-bg-transparent',
      'forced-colors:shr-border-shorthand',
      '[&>svg]:aria-expanded:shr-rotate-180',
    ],
    languageItemsList: ['shr-p-0.5'],
    languageItem: ['shr-flex shr-items-center'],
    languageButton: [
      'shr-border-transparent shr-font-normal shr-justify-start shr-px-0.5',
      '[&:not(:has(svg))]:shr-ps-2',
      'hover:shr-border-transparent',
    ],
  },
  variants: {
    invert: {
      true: {
        switchButton: [
          'shr-text-black',
          'hover:shr-bg-white-darken',
          'focus-visible:shr-bg-white-darken',
        ],
      },
    },
    enableNew: {
      true: {
        switchButton: 'shr-px-0.5',
      },
    },
  },
})

export const LanguageSwitcher: React.FC<Props & ElementProps> = ({
  narrow,
  enableNew,
  invert = enableNew,
  decorators,
  localeMap,
  locale,
  defaultLocale,
  onLanguageSelect,
  ...rest
}) => {
  const locales = useMemo(() => Object.entries(localeMap), [localeMap])
  const decoratedTexts = useMemo(() => {
    if (!decorators) {
      return {
        triggerLabel: TRIGGER_LABEL,
        checkIconAlt: CHECK_ICON_ALT,
      }
    }

    return {
      triggerLabel: decorators.triggerLabel?.(TRIGGER_LABEL) || TRIGGER_LABEL,
      checkIconAlt: decorators.checkIconAlt?.(CHECK_ICON_ALT) || CHECK_ICON_ALT,
    }
  }, [decorators])

  const currentLang = useMemo(
    () => locale || defaultLocale || Object.keys(localeMap)[0],
    [locale, defaultLocale, localeMap],
  )

  const { languageButton, languageItemsList, languageItem, switchButton } = appLauncher()

  const handleLanguageSelect = useMemo(
    () =>
      onLanguageSelect
        ? (e: React.MouseEvent<HTMLButtonElement>) => {
            onLanguageSelect(e.currentTarget.value)
          }
        : undefined,
    [onLanguageSelect],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { key, target, currentTarget } = e

    if (!ARROW_KEY_REGEX.test(key)) {
      return
    }

    e.preventDefault()

    const buttons = tabbable(currentTarget)
    const i = buttons.indexOf(target as HTMLElement)

    if (ARROW_UPS_REGEX.test(key)) {
      buttons.at(i - 1)?.focus()
    } else if (i + 1 === buttons.length) {
      buttons.at(0)?.focus()
    } else {
      buttons.at(i + 1)?.focus()
    }
  }

  const NarrowTrigger = (
    <Button square suffix={<FaCaretDownIcon />} className={switchButton({ invert, enableNew })}>
      {invert ? (
        <LanguageIcon alt={decoratedTexts.triggerLabel} />
      ) : (
        <FaGlobeIcon alt={decoratedTexts.triggerLabel} />
      )}
    </Button>
  )

  const Trigger = (
    <Button
      prefix={invert ? <LanguageIcon /> : <FaGlobeIcon />}
      suffix={<FaCaretDownIcon />}
      className={switchButton({ invert, enableNew })}
    >
      {decoratedTexts.triggerLabel}
    </Button>
  )

  return (
    <Dropdown {...rest}>
      <DropdownTrigger>{narrow ? NarrowTrigger : Trigger}</DropdownTrigger>
      <DropdownContent onKeyDown={handleKeyDown} role="presentation">
        <ul className={languageItemsList()}>
          {locales.map(([code, label]) => {
            const isCurrent = currentLang === code
            return (
              <li key={code} className={languageItem()} aria-current={isCurrent} lang={code}>
                <Button
                  value={code}
                  onClick={handleLanguageSelect}
                  wide
                  prefix={
                    isCurrent ? (
                      <FaCheckIcon color="MAIN" alt={decoratedTexts.checkIconAlt} />
                    ) : null
                  }
                  className={languageButton()}
                >
                  {label}
                </Button>
              </li>
            )
          })}
        </ul>
      </DropdownContent>
    </Dropdown>
  )
}
