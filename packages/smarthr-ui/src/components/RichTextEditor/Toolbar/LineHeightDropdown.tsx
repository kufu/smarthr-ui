'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { FaCaretDownIcon, FaCheckIcon, FaTextHeightIcon } from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

// value=null はデフォルト（unset）。それ以外は LineHeight 拡張の allowlist と一致させる。
const LINE_HEIGHT_OPTIONS = [
  { value: '1', label: '1' },
  { value: '1.25', label: '1.25' },
  { value: '1.5', label: '1.5' },
  { value: null, label: '1.75' }, // デフォルト = unset（ラベルに「標準」を付加）
  { value: '2', label: '2' },
] as const

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-LineHeightDropdown',
      'shr-inline-flex shr-items-center shr-gap-0.25',
      'shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-default disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
    ],
    listbox: [
      'shr-border-shorthand shr-max-h-[20em] shr-min-w-[7em] shr-overflow-y-auto shr-rounded-m shr-bg-white shr-py-0.25 shr-shadow-layer-3',
    ],
    option: [
      'shr-flex shr-w-full shr-cursor-pointer shr-items-center shr-gap-0.5 shr-border-none shr-bg-transparent shr-px-0.75 shr-py-0.5 shr-text-left shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    checkIcon: 'shr-w-[1em] shr-shrink-0',
    tooltip: [
      'shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr--translate-x-1/2 shr-whitespace-nowrap shr-rounded-m shr-bg-black shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-white',
      'shr-opacity-0 shr-transition-opacity',
    ],
  },
  variants: {
    tooltipVisible: {
      true: {
        tooltip: 'shr-opacity-100',
      },
    },
  },
})

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const LineHeightDropdown: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const listboxRef = useRef<HTMLDivElement>(null)

    // '1.75' は CSS デフォルト(RELAXED)と同値のため、デフォルト(null=未指定)として扱う。
    // これにより HTML/JSON 由来で attrs.lineHeight='1.75' が入っても「1.75（標準）」が選択表示になる。
    const currentValue = state.currentLineHeight === '1.75' ? null : state.currentLineHeight

    const tooltipVisible = (isHovered || isFocused) && !isOpen
    const classNames = classNameGenerator({ tooltipVisible })

    const dropdownLabel = localize({
      id: 'smarthr-ui/RichTextEditor/lineHeightDropdownLabel',
      defaultText: '行送り',
    })
    const defaultSuffix = localize({
      id: 'smarthr-ui/RichTextEditor/lineHeightDefaultSuffix',
      defaultText: '標準',
    })

    const currentOption = LINE_HEIGHT_OPTIONS.find((o) => o.value === currentValue)
    const currentLabel =
      currentOption && currentOption.value !== null
        ? currentOption.label
        : `1.75（${defaultSuffix}）`

    const selectOption = useCallback(
      (value: string | null) => {
        if (value === null) {
          editor.chain().focus().unsetLineHeight().run()
        } else {
          editor.chain().focus().setLineHeight(value).run()
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
              const currentIndex = LINE_HEIGHT_OPTIONS.findIndex((o) => o.value === currentValue)
              const target = listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
              const defaultIndex = LINE_HEIGHT_OPTIONS.findIndex((o) => o.value === null)
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
      [currentValue, onKeyDownProp, setIsOpen],
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
          case 'Escape':
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(false)
            triggerRef.current?.focus()
            break
          case 'Tab':
            setIsOpen(false)
            break
        }
      },
      [setIsOpen, triggerRef],
    )

    return (
      <>
        <span
          className="shr-relative shr-inline-block"
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          <button
            ref={(el) => {
              triggerRef.current = el
              refProp?.(el)
            }}
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={`${dropdownLabel}: ${currentLabel}`}
            tabIndex={tabIndex}
            disabled={disabled}
            onKeyDown={handleTriggerKeyDown}
            onClick={() => setIsOpen((prev) => !prev)}
            onFocus={() => {
              setIsFocused(true)
              onFocusProp?.()
            }}
            onBlur={() => setIsFocused(false)}
            className={classNames.trigger()}
          >
            <FaTextHeightIcon />
            <FaCaretDownIcon className="shr-shrink-0 shr-text-xs" />
          </button>
          <span aria-hidden="true" className={classNames.tooltip()}>
            {dropdownLabel}
          </span>
        </span>
        {renderDropdown(
          <div
            ref={listboxRef}
            role="listbox"
            aria-label={dropdownLabel}
            className={classNames.listbox()}
          >
            {LINE_HEIGHT_OPTIONS.map((option) => {
              const isSelected = option.value === currentValue
              const optionLabel =
                option.value === null ? `${option.label}（${defaultSuffix}）` : option.label

              return (
                <button
                  key={option.label}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={classNames.option()}
                  onClick={() => selectOption(option.value)}
                  onKeyDown={handleOptionKeyDown}
                >
                  <span className={classNames.checkIcon()}>
                    {isSelected && <FaCheckIcon className="shr-text-main" />}
                  </span>
                  <span>{optionLabel}</span>
                </button>
              )
            })}
          </div>,
        )}
      </>
    )
  },
)
