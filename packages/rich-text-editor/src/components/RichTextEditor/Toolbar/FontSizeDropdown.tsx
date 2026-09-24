'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useRef } from 'react'
import { FaCaretDownIcon, FaCheckIcon } from 'smarthr-ui'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

import { ToolbarTooltip } from './ToolbarTooltip'
import { TOOLBAR_ITEM_CLASS_NAME } from './toolbarItemStyle'

const DEFAULT_ROOT_FONT_SIZE = 16
const LENGTH_PATTERN = /^(\d+(?:\.\d+)?)(px|rem|em)$/

// value が px ではなく rem なのは、px だとブラウザのフォントサイズ設定に追従せず、
// 未指定(16)だけが追従して不整合になるため。em ではないのは、pre/code のように
// font-size を縮めた文脈でラベルと実寸がずれるのを避けるため。
// px を併記するのは、他エディタから引き継いだ px 値を選択肢へ対応づけるのに
// 文字列一致では足りず、ラベルと選択判定で同じ基準が必要なため。
const FONT_SIZES = [
  { px: 12, value: '0.75rem' },
  { px: 14, value: '0.875rem' },
  { px: 16, value: null },
  { px: 18, value: '1.125rem' },
  { px: 20, value: '1.25rem' },
  { px: 24, value: '1.5rem' },
  { px: 30, value: '1.875rem' },
  { px: 36, value: '2.25rem' },
  { px: 48, value: '3rem' },
  { px: 60, value: '3.75rem' },
  { px: 72, value: '4.5rem' },
] as const

/** 既定のルートフォントサイズ換算の表示サイズ。解釈できない単位は null */
const toPxSize = (value: string | null) => {
  if (value === null) return DEFAULT_ROOT_FONT_SIZE

  const matched = LENGTH_PATTERN.exec(value)

  if (!matched) return null

  const [, num, unit] = matched

  return Math.round(unit === 'px' ? Number(num) : Number(num) * DEFAULT_ROOT_FONT_SIZE)
}

const classNameGenerator = tv({
  slots: {
    trigger: [
      TOOLBAR_ITEM_CLASS_NAME,
      'smarthr-ui-RichTextEditor-FontSizeDropdown',
      'shr-min-w-[4em] shr-text-sm',
    ],
    listbox: [
      'shr-border-shorthand shr-max-h-[20em] shr-min-w-[5em] shr-overflow-y-auto shr-rounded-m shr-bg-white shr-py-0.25 shr-shadow-layer-3',
    ],
    option: [
      'shr-flex shr-w-full shr-cursor-pointer shr-items-center shr-gap-0.5 shr-border-none shr-bg-transparent shr-px-0.75 shr-py-0.5 shr-text-left shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    checkIcon: 'shr-w-[1em] shr-shrink-0',
  },
})

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const FontSizeDropdown: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const listboxRef = useRef<HTMLDivElement>(null)

    const currentValue = state.currentFontSize
    const currentSize = toPxSize(currentValue)
    // 解釈できない単位はそのまま見せる
    const currentLabel = currentSize ?? currentValue ?? DEFAULT_ROOT_FONT_SIZE
    const isDisabled = disabled || state.isInHeading

    const classNames = classNameGenerator()

    const dropdownLabel = localize({
      id: 'smarthr-ui/RichTextEditor/fontSizeDropdownLabel',
      defaultText: 'フォントサイズ',
    })

    const selectOption = useCallback(
      (value: string | null) => {
        if (value === null) {
          editor.chain().focus().unsetFontSize().run()
        } else {
          editor.chain().focus().setFontSize(value).run()
        }
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [editor, setIsOpen, triggerRef],
    )

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
              const currentIndex = FONT_SIZES.findIndex((s) => s.px === currentSize)
              const target = listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
              const defaultIndex = FONT_SIZES.findIndex((s) => s.value === null)
              target?.[currentIndex >= 0 ? currentIndex : defaultIndex]?.focus()
            })
            break
          case 'ArrowUp':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(true)
            requestAnimationFrame(() => {
              const buttons = listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
              buttons?.[buttons.length - 1]?.focus()
            })
            break
          default:
            onKeyDownProp?.(e)
        }
      },
      [currentSize, onKeyDownProp, setIsOpen],
    )

    const handleOptionKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const buttons = listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
        if (!buttons) return
        const currentIndex = Array.from(buttons).indexOf(e.currentTarget as HTMLButtonElement)

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            e.stopPropagation()
            buttons[(currentIndex + 1) % buttons.length]?.focus()
            break
          case 'ArrowUp':
            e.preventDefault()
            e.stopPropagation()
            buttons[(currentIndex - 1 + buttons.length) % buttons.length]?.focus()
            break
          case 'Home':
            e.preventDefault()
            e.stopPropagation()
            buttons[0]?.focus()
            break
          case 'End':
            e.preventDefault()
            e.stopPropagation()
            buttons[buttons.length - 1]?.focus()
            break
          // ポータルは body 末尾にあり Tab の既定の移動先が無いため、Escape と同じくトリガーへ戻す
          case 'Escape':
          case 'Tab':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(false)
            triggerRef.current?.focus()
            break
        }
      },
      [setIsOpen, triggerRef],
    )

    return (
      <>
        <ToolbarTooltip suppressed={isOpen || isDisabled} label={dropdownLabel}>
          <button
            ref={(el) => {
              triggerRef.current = el
              refProp?.(el)
            }}
            type="button"
            disabled={isDisabled}
            tabIndex={tabIndex}
            className={classNames.trigger()}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={`${dropdownLabel}: ${currentLabel}`}
            onKeyDown={handleTriggerKeyDown}
            onClick={() => setIsOpen((prev) => !prev)}
            onFocus={onFocusProp}
          >
            <span className="shr-flex-1">{currentLabel}</span>
            <FaCaretDownIcon className="shr-shrink-0 shr-text-xs" />
          </button>
        </ToolbarTooltip>
        {renderDropdown(
          <div
            ref={listboxRef}
            role="listbox"
            className={classNames.listbox()}
            aria-label={dropdownLabel}
          >
            {FONT_SIZES.map((option) => {
              const isSelected = option.px === currentSize

              return (
                <button
                  key={option.px}
                  role="option"
                  type="button"
                  className={classNames.option()}
                  aria-selected={isSelected}
                  onClick={() => selectOption(option.value)}
                  onKeyDown={handleOptionKeyDown}
                >
                  <span className={classNames.checkIcon()}>
                    {isSelected && <FaCheckIcon className="shr-text-main" />}
                  </span>
                  <span>{option.px}</span>
                </button>
              )
            })}
          </div>,
        )}
      </>
    )
  },
)
