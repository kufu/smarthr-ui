'use client'

import {
  type FC,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../../hooks/useDecorators'
import { useIntl } from '../../../intl'
import { tabbable } from '../../../libs/tabbable'
import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../../Dropdown'
import { FaCaretDownIcon, FaCheckIcon, FaGlobeIcon, LanguageIcon } from '../../Icon'

import type { Locale } from '../../../intl/localeMap'

export type AbstractProps = {
  narrow?: boolean
  localeMap: Partial<Record<Locale, string>>
  locale?: string
  defaultLocale?: string
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<DecoratorKeyTypes>
  /** 言語切替UIで言語を選択した時に発火するコールバック関数 */
  onLanguageSelect?: (code: string) => void
} & VariantProps<typeof classNameGenerator>

type Props = AbstractProps & Omit<HTMLAttributes<HTMLElement>, keyof AbstractProps>

// トリガーはどの言語でも英語のままLanguageと表示するのが好ましいため、intlにはおかない。decoratorは一旦そのままにしている。
const DECORATOR_DEFAULT_TEXTS = {
  triggerLabel: 'Language',
} as const

type DecoratorKeyTypes = 'checkIconAlt' | keyof typeof DECORATOR_DEFAULT_TEXTS

const ARROW_KEY_REGEX = /^Arrow(Up|Down|Left|Right)$/
const ARROW_UPS_REGEX = /^Arrow(Up|Left)$/

// 配列のインデックスを循環的に移動する（最初→最後、最後→最初）
const getCircularIndex = (currentIndex: number, direction: 'up' | 'down', arrayLength: number) => {
  if (direction === 'up') {
    // 負の数を避けるため arrayLength を加算してから剰余を取る
    return (currentIndex - 1 + arrayLength) % arrayLength
  }
  // 次の要素へ移動（最後の場合は 0 に戻る）
  return (currentIndex + 1) % arrayLength
}

const onDelegateKeyDownContent = (e: KeyboardEvent<HTMLDivElement>) => {
  if (!ARROW_KEY_REGEX.test(e.key)) {
    return
  }

  e.preventDefault()

  const buttons = tabbable(e.currentTarget)
  const currentIndex = buttons.indexOf(e.target as HTMLElement)
  const direction = ARROW_UPS_REGEX.test(e.key) ? 'up' : 'down'
  const nextIndex = getCircularIndex(currentIndex, direction, buttons.length)

  buttons[nextIndex]?.focus()
}

const classNameGenerator = tv({
  slots: {
    switchButton: [
      'shr-border-none shr-bg-transparent shr-px-0.25 shr-font-normal shr-text-white shr-transition-transform shr-duration-100',
      'hover:shr-border-transparent hover:shr-bg-transparent',
      'focus-visible:shr-border-transparent focus-visible:shr-bg-transparent',
      'forced-colors:shr-border-shorthand',
      '[&_.smarthr-ui-Icon]:aria-expanded:shr-rotate-180',
    ],
    languageItemsList: ['shr-p-0.5'],
    languageItem: ['shr-flex shr-items-center'],
    languageButton: [
      'shr-justify-start shr-border-transparent shr-px-0.5 shr-font-normal',
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

export const LanguageSwitcher: FC<Props> = ({
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
  const { localize, availableLocales } = useIntl()
  const { locales, defaultCurrentLang } = useMemo(
    () => ({
      locales: Object.entries(localeMap).filter(([code]) => availableLocales.includes(code)),
      defaultCurrentLang: Object.keys(localeMap)[0],
    }),
    [localeMap, availableLocales],
  )

  const decoratorDefaultTexts = useMemo(
    () => ({
      triggerLabel: DECORATOR_DEFAULT_TEXTS.triggerLabel,
      checkIconAlt: localize({
        id: 'smarthr-ui/LanguageSwitcher/checkIconAlt',
        defaultText: '選択中',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)
  const currentLang = locale || defaultLocale || defaultCurrentLang
  const classNames = useMemo(() => {
    const { languageButton, languageItemsList, languageItem, switchButton } = classNameGenerator()

    return {
      languageButton: languageButton(),
      languageItemsList: languageItemsList(),
      languageItem: languageItem(),
      switchButton: switchButton({ invert, enableNew }),
    }
  }, [enableNew, invert])

  const onClickLanguageSelect = useMemo(
    () =>
      onLanguageSelect
        ? (e: MouseEvent<HTMLButtonElement>) => {
            onLanguageSelect(e.currentTarget.value)
          }
        : undefined,
    [onLanguageSelect],
  )

  return (
    <Dropdown {...rest}>
      <MemoizedDropdownTrigger
        narrow={narrow}
        invert={invert}
        className={classNames.switchButton}
        label={decorated.triggerLabel}
      />
      <DropdownContent onKeyDown={onDelegateKeyDownContent}>
        <ul className={classNames.languageItemsList}>
          {locales.map(([code, label]) => (
            <LanguageListItemButton
              key={code}
              code={code}
              className={classNames.languageItem}
              buttonStyle={classNames.languageButton}
              current={currentLang === code}
              onClick={onClickLanguageSelect}
              iconAlt={decorated.checkIconAlt}
            >
              {label}
            </LanguageListItemButton>
          ))}
        </ul>
      </DropdownContent>
    </Dropdown>
  )
}

const LanguageListItemButton = memo<{
  code: string
  children: string
  className: string
  buttonStyle: string
  current: boolean
  iconAlt: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}>(({ code, children, buttonStyle, className, current, iconAlt, onClick }) => (
  <li key={code} className={className} aria-current={current} lang={code}>
    <Button
      value={code}
      onClick={onClick}
      wide
      prefix={current ? <FaCheckIcon color="MAIN" alt={iconAlt} /> : null}
      className={buttonStyle}
    >
      {children}
    </Button>
  </li>
))

const MemoizedDropdownTrigger = memo<
  Pick<Props, 'narrow' | 'invert'> & { className: string; label: ReactNode }
>(({ narrow, invert, className, label }) => (
  <DropdownTrigger>
    {narrow ? (
      <Button suffix={<FaCaretDownIcon />} className={className}>
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
