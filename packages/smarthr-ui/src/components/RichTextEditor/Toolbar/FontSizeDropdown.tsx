'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { FaCaretDownIcon, FaCheckIcon } from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

import { ToolbarTooltip } from './ToolbarTooltip'

const FONT_SIZES = [
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: null, label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '30px', label: '30' },
  { value: '36px', label: '36' },
  { value: '48px', label: '48' },
  { value: '60px', label: '60' },
  { value: '72px', label: '72' },
] as const

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-FontSizeDropdown',
      'shr-inline-flex shr-items-center shr-gap-0.25',
      'shr-min-w-[4em] shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-not-allowed disabled:shr-text-disabled',
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
    const currentLabel =
      FONT_SIZES.find((s) => s.value === currentValue)?.label ??
      (currentValue === null ? '16' : currentValue.replace('px', ''))
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
              const currentIndex = FONT_SIZES.findIndex((s) => s.value === currentValue)
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
        <ToolbarTooltip label={dropdownLabel} suppressed={isOpen || isDisabled}>
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
            disabled={isDisabled}
            onKeyDown={handleTriggerKeyDown}
            onClick={() => setIsOpen((prev) => !prev)}
            onFocus={onFocusProp}
            className={classNames.trigger()}
          >
            <span className="shr-flex-1">{currentLabel}</span>
            <FaCaretDownIcon className="shr-shrink-0 shr-text-xs" />
          </button>
        </ToolbarTooltip>
        {renderDropdown(
          <div
            ref={listboxRef}
            role="listbox"
            aria-label={dropdownLabel}
            className={classNames.listbox()}
          >
            {FONT_SIZES.map((option) => {
              const isSelected = option.value === currentValue

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
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>,
        )}
      </>
    )
  },
)
