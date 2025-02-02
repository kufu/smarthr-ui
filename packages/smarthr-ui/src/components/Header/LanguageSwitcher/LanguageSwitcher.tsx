'use client'

import React, { HTMLAttributes, ReactNode, useCallback, useMemo } from 'react'
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
  const styles = useMemo(() => {
    const { languageButton, languageItemsList, languageItem, switchButton } = appLauncher()

    return {
      languageButton: languageButton(),
      languageItemsList: languageItemsList(),
      languageItem: languageItem(),
      switchButton: switchButton({ invert, enableNew }),
    }
  }, [enableNew, invert])

  const handleLanguageSelect = useMemo(
    () =>
      onLanguageSelect
        ? (e: React.MouseEvent<HTMLButtonElement>) => {
            onLanguageSelect(e.currentTarget.value)
          }
        : undefined,
    [onLanguageSelect],
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!ARROW_KEY_REGEX.test(e.key)) {
      return
    }

    e.preventDefault()

    const buttons = tabbable(e.currentTarget)
    const i = buttons.indexOf(e.target as HTMLElement)
    let buttonAt = 0

    if (ARROW_UPS_REGEX.test(e.key)) {
      buttonAt = i - 1
    } else if (i + 1 === buttons.length) {
      buttonAt = i + 1
    }

    buttons.at(buttonAt)?.focus()
  }, [])

  return (
    <Dropdown {...rest}>
      <MemoizedDropdownTrigger
        narrow={narrow}
        invert={invert}
        className={styles.switchButton}
        label={decoratedTexts.triggerLabel}
      />
      <DropdownContent onKeyDown={handleKeyDown} role="presentation">
        <ul className={styles.languageItemsList}>
          {locales.map(([code, label]) => (
            <LanguageListItemButton
              key={code}
              code={code}
              className={styles.languageItem}
              buttonStyle={styles.languageButton}
              current={currentLang === code}
              handleLanguageSelect={handleLanguageSelect}
              iconAlt={decoratedTexts.checkIconAlt}
            >
              {label}
            </LanguageListItemButton>
          ))}
        </ul>
      </DropdownContent>
    </Dropdown>
  )
}

const LanguageListItemButton = React.memo<{
  code: string
  children: string
  className: string
  buttonStyle: string
  current: boolean
  iconAlt: ReactNode
  handleLanguageSelect?: (e: React.MouseEvent<HTMLButtonElement>) => void
}>(({ code, children, buttonStyle, className, current, iconAlt, handleLanguageSelect }) => (
  <li key={code} className={className} aria-current={current} lang={code}>
    <Button
      value={code}
      onClick={handleLanguageSelect}
      wide
      prefix={current ? <FaCheckIcon color="MAIN" alt={iconAlt} /> : null}
      className={buttonStyle}
    >
      {children}
    </Button>
  </li>
))

const MemoizedDropdownTrigger = React.memo<
  Pick<Props, 'narrow' | 'invert'> & { className: string; label: ReactNode }
>(({ narrow, invert, className, label }) => (
  <DropdownTrigger>
    {narrow ? (
      <Button square suffix={<FaCaretDownIcon />} className={className}>
        {invert ? <LanguageIcon alt={label} /> : <FaGlobeIcon alt={label} />}
      </Button>
    ) : (
      <Button
        prefix={invert ? <LanguageIcon /> : <FaGlobeIcon />}
        suffix={<FaCaretDownIcon />}
        className={className}
      >
        {label}
      </Button>
    )}
  </DropdownTrigger>
))
