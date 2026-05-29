'use client'

import {
  type ChangeEvent,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { type locales, useIntl } from '../../../../intl'
import { FaCheckIcon } from '../../../Icon'

const SWATCHES_PER_ROW = 6
const PALETTE_BUTTON_CLASSES = [
  'shr-border-shorthand shr-cursor-pointer shr-rounded-m shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
  'hover:shr-bg-white-darken',
  'focus-visible:shr-focus-indicator',
]

/**
 * 色値を #rrggbb 形式の小文字 hex に正規化する。
 * - #rgb → #rrggbb（短縮形を展開）
 * - #rrggbb → そのまま小文字化
 * - rgb(r, g, b) / rgba(r, g, b, a) → #rrggbb
 * - それ以外（hsl、color()、名前色、null、空文字）→ fallback
 */
export const normalizeHex = (color: string | null | undefined, fallback: string): string => {
  if (!color) return fallback
  const trimmed = color.trim()
  const short = trimmed.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)
  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase()
  }
  const long = trimmed.match(/^#([0-9a-f]{6})$/i)
  if (long) return `#${long[1].toLowerCase()}`
  const rgb = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (rgb) {
    const toHex = (n: string) =>
      Math.max(0, Math.min(255, parseInt(n, 10)))
        .toString(16)
        .padStart(2, '0')
    return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`
  }
  return fallback
}

const classNameGenerator = tv({
  slots: {
    palette: [
      'shr-border-shorthand shr-flex shr-flex-col shr-gap-1 shr-rounded-m shr-bg-white shr-p-0.75 shr-shadow-layer-3',
    ],
    section: 'shr-flex shr-flex-col shr-gap-0.5',
    sectionTitle: 'shr-text-xs shr-font-bold shr-text-grey',
    swatchRow: 'shr-flex shr-gap-0.5',
    swatch: [
      'shr-relative shr-inline-flex shr-items-center shr-justify-center',
      'shr-border-shorthand shr-h-[1.75em] shr-w-[1.75em] shr-cursor-pointer shr-rounded-full',
      'hover:shr-scale-110 hover:shr-shadow-layer-1',
      'focus-visible:shr-focus-indicator',
    ],
    customRow: 'shr-flex shr-items-center shr-gap-0.5',
    editButton: PALETTE_BUTTON_CLASSES,
    resetButton: PALETTE_BUTTON_CLASSES,
    hiddenInput: 'shr-sr-only',
  },
})

type LocaleKey = keyof typeof locales.ja
type LocaleDefaultText<K extends LocaleKey> = (typeof locales.ja)[K]

export type ColorPaletteEntry = {
  value: string
  labelId: LocaleKey
  defaultText: LocaleDefaultText<LocaleKey>
}

type Props = {
  paletteRef: RefObject<HTMLDivElement>
  triggerRef: RefObject<HTMLButtonElement>
  setIsOpen: (open: boolean) => void
  colors: readonly ColorPaletteEntry[]
  defaultColor: string
  currentColor: string | null
  recentColors: string[]
  pushRecent: (hex: string) => void
  customColor: string
  setCustomColor: (hex: string) => void
  onApplyColor: (hex: string) => void
  onUnsetColor: () => void
  dialogLabel: string
  standardSectionLabel: string
  customSectionLabel: string
  recentSectionLabel: string
  editButtonLabel: string
  resetButtonLabel: string
  recentSwatchLabel: (color: string) => string
}

export const ColorPickerPalette: FC<Props> = memo(
  ({
    paletteRef,
    triggerRef,
    setIsOpen,
    colors,
    defaultColor,
    currentColor,
    recentColors,
    pushRecent,
    customColor,
    setCustomColor,
    onApplyColor,
    onUnsetColor,
    dialogLabel,
    standardSectionLabel,
    customSectionLabel,
    recentSectionLabel,
    editButtonLabel,
    resetButtonLabel,
    recentSwatchLabel,
  }) => {
    const { localize } = useIntl()
    const hiddenInputRef = useRef<HTMLInputElement>(null)

    const classNames = classNameGenerator()

    const applyStandardColor = useCallback(
      (color: string) => {
        onApplyColor(color)
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [onApplyColor, setIsOpen, triggerRef],
    )

    const applyRecentColor = useCallback(
      (color: string) => {
        onApplyColor(color)
        pushRecent(color)
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [onApplyColor, pushRecent, setIsOpen, triggerRef],
    )

    const handleEditButtonClick = useCallback(() => {
      hiddenInputRef.current?.click()
    }, [])

    const handleHiddenInputInput = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCustomColor(e.target.value)
      },
      [setCustomColor],
    )

    // popup マウント時に native の change イベントを listen し、ピッカー確定時のみ適用
    useEffect(() => {
      const el = hiddenInputRef.current
      if (!el) return
      const handler = () => {
        const next = el.value
        onApplyColor(next)
        pushRecent(next)
        setIsOpen(false)
        triggerRef.current?.focus()
      }
      el.addEventListener('change', handler)
      return () => el.removeEventListener('change', handler)
    }, [onApplyColor, pushRecent, setIsOpen, triggerRef])

    const removeColor = useCallback(() => {
      onUnsetColor()
      setIsOpen(false)
      triggerRef.current?.focus()
    }, [onUnsetColor, setIsOpen, triggerRef])

    const handleSwatchKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const swatches =
          paletteRef.current?.querySelectorAll<HTMLButtonElement>('[data-color-swatch]')
        if (!swatches) return
        const arr = Array.from(swatches)
        const idx = arr.indexOf(e.currentTarget as HTMLButtonElement)
        if (idx === -1) return

        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault()
            e.stopPropagation()
            arr[Math.min(idx + 1, arr.length - 1)]?.focus()
            break
          case 'ArrowLeft':
            e.preventDefault()
            e.stopPropagation()
            arr[Math.max(idx - 1, 0)]?.focus()
            break
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            arr[Math.min(idx + SWATCHES_PER_ROW, arr.length - 1)]?.focus()
            break
          case 'ArrowUp':
            e.preventDefault()
            e.stopPropagation()
            arr[Math.max(idx - SWATCHES_PER_ROW, 0)]?.focus()
            break
          case 'Tab':
            break
        }
      },
      [paletteRef],
    )

    const onDelegateKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(false)
          triggerRef.current?.focus()
        }
      },
      [setIsOpen, triggerRef],
    )

    const onDelegateBlur = useCallback(
      (e: FocusEvent<HTMLDivElement>) => {
        if (!paletteRef.current?.contains(e.relatedTarget as Node | null)) {
          setIsOpen(false)
        }
      },
      [paletteRef, setIsOpen],
    )

    const firstRow = colors.slice(0, SWATCHES_PER_ROW)
    const secondRow = colors.slice(SWATCHES_PER_ROW)

    const currentNormalized = currentColor ? normalizeHex(currentColor, defaultColor) : null
    const recentSelectedIndex = currentNormalized
      ? recentColors.findIndex((c) => normalizeHex(c, defaultColor) === currentNormalized)
      : -1
    const customSelected =
      recentSelectedIndex === -1 &&
      currentNormalized !== null &&
      normalizeHex(customColor, defaultColor) === currentNormalized &&
      !colors.some((c) => normalizeHex(c.value, defaultColor) === currentNormalized)

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <div
        ref={paletteRef}
        role="dialog"
        aria-label={dialogLabel}
        className={classNames.palette()}
        onKeyDown={onDelegateKeyDown}
        onBlur={onDelegateBlur}
      >
        {/* 標準パレットセクション */}
        <div role="group" aria-label={standardSectionLabel} className={classNames.section()}>
          <div className={classNames.swatchRow()}>
            {firstRow.map((color) => {
              const label = localize({ id: color.labelId, defaultText: color.defaultText })
              const isSelected =
                recentSelectedIndex === -1 &&
                !customSelected &&
                (normalizeHex(color.value, defaultColor) === currentNormalized ||
                  (currentColor === null && color.value === defaultColor))
              return (
                <button
                  key={color.value}
                  type="button"
                  data-color-swatch="standard"
                  aria-label={label}
                  aria-pressed={isSelected}
                  className={classNames.swatch()}
                  style={{ backgroundColor: color.value }}
                  onClick={() => applyStandardColor(color.value)}
                  onKeyDown={handleSwatchKeyDown}
                >
                  {isSelected && (
                    <FaCheckIcon
                      className="shr-text-xs shr-text-white shr-drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                      style={{ color: `contrast-color(${color.value})` }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          {secondRow.length > 0 && (
            <div className={classNames.swatchRow()}>
              {secondRow.map((color) => {
                const label = localize({ id: color.labelId, defaultText: color.defaultText })
                const isSelected =
                  recentSelectedIndex === -1 &&
                  !customSelected &&
                  normalizeHex(color.value, defaultColor) === currentNormalized
                return (
                  <button
                    key={color.value}
                    type="button"
                    data-color-swatch="standard"
                    aria-label={label}
                    aria-pressed={isSelected}
                    className={classNames.swatch()}
                    style={{ backgroundColor: color.value }}
                    onClick={() => applyStandardColor(color.value)}
                    onKeyDown={handleSwatchKeyDown}
                  >
                    {isSelected && (
                      <FaCheckIcon
                        className="shr-text-xs shr-text-white shr-drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                        style={{ color: `contrast-color(${color.value})` }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* カスタムセクション */}
        <div role="group" aria-label={customSectionLabel} className={classNames.section()}>
          <span className={classNames.sectionTitle()}>{customSectionLabel}</span>
          <div className={classNames.customRow()}>
            <span
              className={classNames.swatch()}
              style={{ backgroundColor: customColor }}
              aria-hidden="true"
            >
              {customSelected && (
                <FaCheckIcon
                  className="shr-text-xs shr-text-white shr-drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                  style={{ color: `contrast-color(${customColor})` }}
                />
              )}
            </span>
            <button
              type="button"
              className={classNames.editButton()}
              onClick={handleEditButtonClick}
            >
              {editButtonLabel}
            </button>
            {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
            <input
              ref={hiddenInputRef}
              type="color"
              name="customColor"
              value={customColor}
              onChange={handleHiddenInputInput}
              aria-hidden="true"
              tabIndex={-1}
              className={classNames.hiddenInput()}
            />
          </div>
        </div>

        {/* 履歴セクション（0件のとき非表示） */}
        {recentColors.length > 0 && (
          <div role="group" aria-label={recentSectionLabel} className={classNames.section()}>
            <span className={classNames.sectionTitle()}>{recentSectionLabel}</span>
            <div className={classNames.swatchRow()}>
              {recentColors.map((color, idx) => {
                const isSelected = idx === recentSelectedIndex
                return (
                  <button
                    key={color}
                    type="button"
                    data-color-swatch="recent"
                    aria-label={recentSwatchLabel(color)}
                    aria-pressed={isSelected}
                    className={classNames.swatch()}
                    style={{ backgroundColor: color }}
                    onClick={() => applyRecentColor(color)}
                    onKeyDown={handleSwatchKeyDown}
                  >
                    {isSelected && (
                      <FaCheckIcon
                        className="shr-text-xs shr-text-white shr-drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                        style={{ color: `contrast-color(${color})` }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <button type="button" className={classNames.resetButton()} onClick={removeColor}>
          {resetButtonLabel}
        </button>
      </div>
    )
  },
)
