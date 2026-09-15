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
import { Button, FaXmarkIcon } from 'smarthr-ui'
import { tv } from 'tailwind-variants'

import { type typedJa, useIntl } from '../../../../intl'

import { ColorSwatch, ColorSwatchFace } from './ColorSwatch'
import { normalizeHex } from './normalizeHex'

const SWATCHES_PER_ROW = 6
const PALETTE_BUTTON_BASE_CLASSES = [
  'shr-border-shorthand shr-cursor-pointer shr-rounded-m shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-font-bold shr-text-black',
  'hover:shr-bg-white-darken',
]

const classNameGenerator = tv({
  slots: {
    palette: [
      'shr-border-shorthand shr-flex shr-flex-col shr-gap-1 shr-rounded-m shr-bg-white shr-p-0.75 shr-shadow-layer-3',
    ],
    section: 'shr-flex shr-flex-col shr-gap-0.5',
    sectionTitle: 'shr-text-xs shr-font-bold shr-text-grey',
    swatchRow: 'shr-flex shr-gap-0.5',
    customRow: 'shr-flex shr-items-center shr-gap-0.5',
    // input を重ねる基準にするため relative にする。フォーカスリングは中の input に当たるので
    // focus-visible ではなく has-[:focus-visible] で外側に出す
    editButton: [
      ...PALETTE_BUTTON_BASE_CLASSES,
      'shr-relative shr-inline-flex shr-items-center',
      'has-[:focus-visible]:shr-focus-indicator',
    ],
    // 「色を編集」の見た目に重ねる、透明な実寸の色入力。
    // sr-only で隠して button から click() を中継する形は採れない。WebKit はネイティブの
    // カラーピッカーを input の矩形にアンカーするため、clip された 1x1px の input では
    // macOS Safari で無関係な位置に表示され、iOS Safari では何も起きない
    // preflight を切っているため、m-0 を明示しないと input 既定のマージンぶん位置がずれる
    colorInput:
      'shr-absolute shr-left-0 shr-top-0 shr-m-0 shr-h-full shr-w-full shr-cursor-pointer shr-opacity-0',
  },
})

type LocaleKey = keyof typeof typedJa
type LocaleDefaultText<K extends LocaleKey> = (typeof typedJa)[K]

export type ColorPaletteEntry = {
  value: string
  labelId: LocaleKey
  defaultText: LocaleDefaultText<LocaleKey>
}

type Props = {
  paletteRef: RefObject<HTMLDivElement>
  /** スウォッチの見せ方。文字色なら白地に色付きの A で表す */
  appearance: 'color' | 'backgroundColor'
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
  /** 「色を編集」の読み上げ名。開始色が分かるよう現在の色を含める */
  editButtonAccessibleLabel: (color: string) => string
  resetButtonLabel: string
  recentSwatchLabel: (color: string) => string
}

export const ColorPickerPalette: FC<Props> = memo(
  ({
    paletteRef,
    appearance,
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
    editButtonAccessibleLabel,
    resetButtonLabel,
    recentSwatchLabel,
  }) => {
    const { localize } = useIntl()
    const colorInputRef = useRef<HTMLInputElement>(null)

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

    const applyCustomColor = useCallback(
      (hex: string) => {
        onApplyColor(hex)
        // 標準パレットから選べる色は、標準スウォッチと同じく履歴に積まない
        const normalized = normalizeHex(hex, defaultColor)
        if (!colors.some((c) => normalizeHex(c.value, defaultColor) === normalized)) {
          pushRecent(hex)
        }
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [colors, defaultColor, onApplyColor, pushRecent, setIsOpen, triggerRef],
    )

    const handleColorInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setCustomColor(e.target.value)
      },
      [setCustomColor],
    )

    // popup マウント時に native の change イベントを listen し、ピッカー確定時のみ適用
    // （native color input には確定とキャンセルを区別する手段がないため、
    //   同じ色のまま確定した場合はここを通らない。その場合はカスタムスウォッチから適用できる）
    useEffect(() => {
      const el = colorInputRef.current
      if (!el) return
      const handler = () => applyCustomColor(el.value)
      el.addEventListener('change', handler)
      return () => el.removeEventListener('change', handler)
    }, [applyCustomColor])

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
        className={classNames.palette()}
        aria-label={dialogLabel}
        onKeyDown={onDelegateKeyDown}
        onBlur={onDelegateBlur}
      >
        {/* 標準パレットセクション */}
        <div role="group" className={classNames.section()} aria-label={standardSectionLabel}>
          <div className={classNames.swatchRow()}>
            {firstRow.map((color) => {
              const label = localize({ id: color.labelId, defaultText: color.defaultText })
              const isSelected =
                recentSelectedIndex === -1 &&
                !customSelected &&
                (normalizeHex(color.value, defaultColor) === currentNormalized ||
                  (currentColor === null && color.value === defaultColor))
              return (
                <ColorSwatch
                  key={color.value}
                  selected={isSelected}
                  appearance={appearance}
                  color={color.value}
                  className="focus-visible:shr-focus-indicator"
                  data-color-swatch="standard"
                  handleKeyDown={handleSwatchKeyDown}
                  handleClick={() => applyStandardColor(color.value)}
                  label={label}
                />
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
                  <ColorSwatch
                    key={color.value}
                    selected={isSelected}
                    appearance={appearance}
                    color={color.value}
                    className="focus-visible:shr-focus-indicator"
                    data-color-swatch="standard"
                    handleKeyDown={handleSwatchKeyDown}
                    handleClick={() => applyStandardColor(color.value)}
                    label={label}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* カスタムセクション */}
        <div role="group" className={classNames.section()} aria-label={customSectionLabel}>
          <span className={classNames.sectionTitle()}>{customSectionLabel}</span>
          <div className={classNames.customRow()}>
            {/* 「色を編集」を開いたときの開始色。同じ色の再適用は履歴が担うため操作は持たせない */}
            <ColorSwatchFace appearance={appearance} color={customColor} aria-hidden="true" />
            <span className={classNames.editButton()}>
              {/* ラベルは input の aria-label で読み上げるため、見た目側は読み上げ対象から外す */}
              <span aria-hidden="true">{editButtonLabel}</span>
              <input
                ref={colorInputRef}
                type="color"
                name="customColor"
                value={customColor}
                className={classNames.colorInput()}
                aria-label={editButtonAccessibleLabel(customColor)}
                onChange={handleColorInputChange}
              />
            </span>
          </div>
        </div>

        {/* 履歴セクション（0件のとき非表示） */}
        {recentColors.length > 0 && (
          <div role="group" className={classNames.section()} aria-label={recentSectionLabel}>
            <span className={classNames.sectionTitle()}>{recentSectionLabel}</span>
            <div className={classNames.swatchRow()}>
              {recentColors.map((color, idx) => {
                const isSelected = idx === recentSelectedIndex
                return (
                  <ColorSwatch
                    key={color}
                    selected={isSelected}
                    appearance={appearance}
                    color={color}
                    className="focus-visible:shr-focus-indicator"
                    data-color-swatch="recent"
                    handleKeyDown={handleSwatchKeyDown}
                    handleClick={() => applyRecentColor(color)}
                    label={recentSwatchLabel(color)}
                  />
                )
              })}
            </div>
          </div>
        )}

        <Button
          variant="text"
          size="S"
          className="shr-self-start"
          onClick={removeColor}
          prefix={<FaXmarkIcon />}
        >
          {resetButtonLabel}
        </Button>
      </div>
    )
  },
)
