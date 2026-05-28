'use client'

import {
  type ChangeEvent,
  type FC,
  type FocusEvent,
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { FaCheckIcon, FaChevronDownIcon } from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

import { DEFAULT_COLOR, EDITOR_COLORS } from './colors'

const RECENT_LIMIT = 5
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
 * - それ以外（hsl、color()、名前色、null、空文字）→ DEFAULT_COLOR
 *
 * Tiptap の textStyle.color はブラウザの css value 文字列をそのまま保存するため、
 * 初期 HTML 由来で rgb(...) や 短縮 hex が来ることがある。
 * <input type="color"> の value は #rrggbb 6桁小文字しか受け付けないので正規化が必要。
 */
const normalizeHex = (color: string | null | undefined): string => {
  if (!color) return DEFAULT_COLOR
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
  return DEFAULT_COLOR
}

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-ColorPickerButton',
      'shr-inline-flex shr-cursor-pointer shr-items-center shr-gap-0.25',
      'shr-rounded-m shr-border-none shr-bg-transparent shr-p-0.5',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-default disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
    ],
    colorIndicator: 'shr-h-[3px] shr-w-full shr-rounded-full',
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

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ColorPickerButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const paletteRef = useRef<HTMLDivElement>(null)
    const hiddenInputRef = useRef<HTMLInputElement>(null)
    const [recentColors, setRecentColors] = useState<string[]>([])
    const [customColor, setCustomColor] = useState<string>(DEFAULT_COLOR)

    const currentColor = state.currentColor

    const classNames = classNameGenerator()

    const pushRecent = useCallback((hex: string) => {
      const normalized = normalizeHex(hex)
      setRecentColors((prev) => {
        const without = prev.filter((c) => normalizeHex(c) !== normalized)
        return [normalized, ...without].slice(0, RECENT_LIMIT)
      })
    }, [])

    const applyStandardColor = useCallback(
      (color: string) => {
        editor.chain().focus().setColor(color).run()
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [editor, setIsOpen, triggerRef],
    )

    const applyRecentColor = useCallback(
      (color: string) => {
        editor.chain().focus().setColor(color).run()
        pushRecent(color)
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [editor, pushRecent, setIsOpen, triggerRef],
    )

    const handleEditButtonClick = useCallback(() => {
      hiddenInputRef.current?.click()
    }, [])

    // React の onChange (実体は input イベント) → プレビュー追従のみ
    const handleHiddenInputInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setCustomColor(e.target.value)
    }, [])

    // native の change イベント（ピッカー確定時のみ発火）→ 適用 + 履歴 + 閉
    // popup が開いて hidden input が DOM にマウントされたタイミングで listener を付け直す
    useEffect(() => {
      if (!isOpen) return
      const el = hiddenInputRef.current
      if (!el) return
      const handler = () => {
        const next = el.value
        editor.chain().focus().setColor(next).run()
        pushRecent(next)
        setIsOpen(false)
        triggerRef.current?.focus()
      }
      el.addEventListener('change', handler)
      return () => el.removeEventListener('change', handler)
    }, [isOpen, editor, pushRecent, setIsOpen, triggerRef])

    const removeColor = useCallback(() => {
      editor.chain().focus().unsetColor().run()
      setIsOpen(false)
      triggerRef.current?.focus()
    }, [editor, setIsOpen, triggerRef])

    const handleTriggerKeyDown = useCallback(
      (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
            requestAnimationFrame(() => {
              paletteRef.current
                ?.querySelector<HTMLButtonElement>('[data-color-swatch="standard"]')
                ?.focus()
            })
            break
          default:
            onKeyDownProp?.(e)
        }
      },
      [onKeyDownProp, setIsOpen],
    )

    const handleSwatchKeyDown = useCallback((e: KeyboardEvent) => {
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
          // Tab は閉じない。popup 内の通常 Tab 順に従って「色を編集」「リセット」へ流れる
          // Escape はバブルアップして palette の onKeyDown で一元処理する
          break
      }
    }, [])

    // Escape を popup 全体で一元処理（スウォッチ・editButton・resetButton どこにフォーカスがあっても閉じる）
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

    // popup 外へフォーカスが抜けたら閉じる（Tab で resetButton の次へ抜けた場合の ghost popup 対策）
    // relatedTarget が null（ウィンドウ外/devtools へのフォーカス）や trigger 等の palette 外要素なら閉じる
    // OS native color picker 起動中は hidden input が palette 内要素のため閉じない
    // ユーザーが意図的に Tab で抜けた場合はフォーカスを戻さない
    const onDelegateBlur = useCallback(
      (e: FocusEvent<HTMLDivElement>) => {
        if (!paletteRef.current?.contains(e.relatedTarget as Node | null)) {
          setIsOpen(false)
        }
      },
      [setIsOpen],
    )

    // popup を開いたときに、エディタの currentColor があればカスタム色プレビューを同期する
    useEffect(() => {
      if (isOpen && currentColor) {
        setCustomColor(normalizeHex(currentColor))
      }
    }, [isOpen, currentColor])

    const colorLabel = localize({
      id: 'smarthr-ui/RichTextEditor/color',
      defaultText: '文字色',
    })
    const resetLabel = localize({
      id: 'smarthr-ui/RichTextEditor/colorReset',
      defaultText: '色をリセット',
    })
    const standardSectionLabel = localize({
      id: 'smarthr-ui/RichTextEditor/colorStandardSection',
      defaultText: '標準の色',
    })
    const customSectionLabel = localize({
      id: 'smarthr-ui/RichTextEditor/colorCustomSection',
      defaultText: 'カスタム',
    })
    const recentSectionLabel = localize({
      id: 'smarthr-ui/RichTextEditor/colorRecentSection',
      defaultText: '履歴',
    })
    const editButtonLabel = localize({
      id: 'smarthr-ui/RichTextEditor/colorEditButton',
      defaultText: '色を編集',
    })

    const firstRow = EDITOR_COLORS.slice(0, SWATCHES_PER_ROW)
    const secondRow = EDITOR_COLORS.slice(SWATCHES_PER_ROW)

    // 選択状態判定: 履歴 > カスタム > 標準 の優先順位で #rrggbb 正規化して比較する
    const currentNormalized = currentColor ? normalizeHex(currentColor) : null
    const recentSelectedIndex = currentNormalized
      ? recentColors.findIndex((c) => normalizeHex(c) === currentNormalized)
      : -1
    const customSelected =
      recentSelectedIndex === -1 &&
      currentNormalized !== null &&
      normalizeHex(customColor) === currentNormalized &&
      !EDITOR_COLORS.some((c) => normalizeHex(c.value) === currentNormalized)

    return (
      <>
        <span className="shr-relative shr-inline-block">
          <button
            ref={(el) => {
              triggerRef.current = el
              refProp?.(el)
            }}
            type="button"
            aria-label={colorLabel}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            tabIndex={tabIndex}
            disabled={disabled}
            onKeyDown={handleTriggerKeyDown}
            onClick={() => setIsOpen((prev) => !prev)}
            onFocus={onFocusProp}
            className={classNames.trigger()}
          >
            <span className="shr-flex shr-flex-col shr-items-center shr-gap-[2px]">
              {/* eslint-disable-next-line smarthr/require-i18n-text */}
              <span aria-hidden className="shr-text-base shr-font-bold shr-leading-none">
                A
              </span>
              <span
                className={classNames.colorIndicator()}
                style={{ backgroundColor: currentColor ?? DEFAULT_COLOR }}
              />
            </span>
            <FaChevronDownIcon className="shr-text-xs" />
          </button>
        </span>
        {renderDropdown(
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <div
            ref={paletteRef}
            role="dialog"
            aria-label={colorLabel}
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
                    (normalizeHex(color.value) === currentNormalized ||
                      (currentColor === null && color.value === DEFAULT_COLOR))
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
              <div className={classNames.swatchRow()}>
                {secondRow.map((color) => {
                  const label = localize({ id: color.labelId, defaultText: color.defaultText })
                  const isSelected =
                    recentSelectedIndex === -1 &&
                    !customSelected &&
                    normalizeHex(color.value) === currentNormalized
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
                    const label = localize(
                      {
                        id: 'smarthr-ui/RichTextEditor/colorRecentSwatchLabel',
                        defaultText: '履歴: {color}',
                      },
                      { color },
                    )
                    const isSelected = idx === recentSelectedIndex
                    return (
                      <button
                        key={color}
                        type="button"
                        data-color-swatch="recent"
                        aria-label={label}
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
              {resetLabel}
            </button>
          </div>,
        )}
      </>
    )
  },
)
