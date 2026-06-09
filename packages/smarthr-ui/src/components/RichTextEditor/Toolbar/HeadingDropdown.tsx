'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useMemo, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { FaCaretDownIcon, FaCheckIcon } from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

const ALL_OPTIONS = [
  { level: null, labelId: 'smarthr-ui/RichTextEditor/headingNormal', defaultText: '標準テキスト' },
  { level: 1, labelId: 'smarthr-ui/RichTextEditor/heading1', defaultText: '見出し1' },
  { level: 2, labelId: 'smarthr-ui/RichTextEditor/heading2', defaultText: '見出し2' },
  { level: 3, labelId: 'smarthr-ui/RichTextEditor/heading3', defaultText: '見出し3' },
  { level: 4, labelId: 'smarthr-ui/RichTextEditor/heading4', defaultText: '見出し4' },
] as const

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-HeadingDropdown',
      'shr-inline-flex shr-items-center shr-gap-0.25',
      'shr-min-w-[9em] shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-default disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
    ],
    listbox: [
      'shr-border-shorthand shr-min-w-[10em] shr-rounded-m shr-bg-white shr-py-0.25 shr-shadow-layer-3',
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

export const HeadingDropdown: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor, headingLevels } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const listboxRef = useRef<HTMLDivElement>(null)

    const options = useMemo(
      () => ALL_OPTIONS.filter((o) => o.level === null || headingLevels.includes(o.level)),
      [headingLevels],
    )

    const currentLevel = state.currentHeadingLevel
    const currentOption = options.find((o) => o.level === currentLevel) ?? options[0]
    const currentLabel = localize({
      id: currentOption.labelId,
      defaultText: currentOption.defaultText,
    })

    const tooltipVisible = (isHovered || isFocused) && !isOpen
    const classNames = classNameGenerator({ tooltipVisible })

    const selectOption = useCallback(
      (level: 1 | 2 | 3 | 4 | null) => {
        if (level === null) {
          editor.chain().focus().setParagraph().run()
        } else {
          editor.chain().focus().toggleHeading({ level }).run()
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
              const currentIndex = options.findIndex((o) => o.level === currentLevel)
              const target = listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
              target?.[currentIndex >= 0 ? currentIndex : 0]?.focus()
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
      [currentLevel, onKeyDownProp, options, setIsOpen],
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

    const dropdownLabel = localize({
      id: 'smarthr-ui/RichTextEditor/headingDropdownLabel',
      defaultText: '書式',
    })

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
            <span className="shr-flex-1">{currentLabel}</span>
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
            {options.map((option) => {
              const label = localize({ id: option.labelId, defaultText: option.defaultText })
              const isSelected = option.level === currentLevel

              return (
                <button
                  key={option.level ?? 'normal'}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={classNames.option()}
                  onClick={() => selectOption(option.level)}
                  onKeyDown={handleOptionKeyDown}
                >
                  <span className={classNames.checkIcon()}>
                    {isSelected && <FaCheckIcon className="shr-text-main" />}
                  </span>
                  <span>{label}</span>
                </button>
              )
            })}
          </div>,
        )}
      </>
    )
  },
)
