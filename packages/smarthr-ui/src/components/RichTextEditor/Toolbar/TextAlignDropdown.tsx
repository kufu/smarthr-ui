'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import {
  FaAlignCenterIcon,
  FaAlignJustifyIcon,
  FaAlignLeftIcon,
  FaAlignRightIcon,
  FaChevronDownIcon,
} from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarState } from '../hooks/useToolbarState'

const ALIGN_OPTIONS = [
  { value: 'left', labelId: 'smarthr-ui/RichTextEditor/alignLeft', defaultText: '左揃え' },
  { value: 'center', labelId: 'smarthr-ui/RichTextEditor/alignCenter', defaultText: '中央揃え' },
  { value: 'right', labelId: 'smarthr-ui/RichTextEditor/alignRight', defaultText: '右揃え' },
  { value: 'justify', labelId: 'smarthr-ui/RichTextEditor/alignJustify', defaultText: '両端揃え' },
] as const

const getAlignIcon = (value: string) => {
  switch (value) {
    case 'center':
      return <FaAlignCenterIcon />
    case 'right':
      return <FaAlignRightIcon />
    case 'justify':
      return <FaAlignJustifyIcon />
    default:
      return <FaAlignLeftIcon />
  }
}

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-TextAlignDropdown',
      'shr-inline-flex shr-items-center shr-gap-0.25',
      'shr-cursor-pointer shr-rounded-m shr-border-none shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    listbox: [
      'shr-absolute shr-left-0 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr-border-shorthand shr-flex shr-items-center shr-gap-0.25 shr-rounded-m shr-bg-white shr-p-0.25 shr-shadow-layer-3',
    ],
    option: [
      'shr-flex shr-cursor-pointer shr-items-center shr-justify-center shr-rounded-m shr-border-none shr-bg-transparent shr-p-0.5 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    optionWrapper: 'shr-group shr-relative shr-inline-block',
    tooltip: [
      'shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr--translate-x-1/2 shr-whitespace-nowrap shr-rounded-m shr-bg-black shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-white',
      'shr-opacity-0 shr-transition-opacity',
    ],
    optionTooltip: [
      'shr-pointer-events-none shr-absolute shr-left-1/2 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr--translate-x-1/2 shr-whitespace-nowrap shr-rounded-m shr-bg-black shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-white',
      'shr-opacity-0 shr-transition-opacity group-focus-within:shr-opacity-100 group-hover:shr-opacity-100',
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
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const TextAlignDropdown: FC<Props> = memo(
  ({ tabIndex = -1, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const [isOpen, setIsOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const listboxRef = useRef<HTMLDivElement>(null)

    const currentAlign = state.currentTextAlign ?? 'left'
    const currentOption = ALIGN_OPTIONS.find((o) => o.value === currentAlign) ?? ALIGN_OPTIONS[0]
    const currentLabel = localize({
      id: currentOption.labelId,
      defaultText: currentOption.defaultText,
    })

    const tooltipVisible = (isHovered || isFocused) && !isOpen
    const classNames = classNameGenerator({ tooltipVisible })

    const dropdownLabel = localize({
      id: 'smarthr-ui/RichTextEditor/textAlignDropdownLabel',
      defaultText: 'テキスト配置',
    })

    const selectOption = useCallback(
      (value: string) => {
        if (value === 'left') {
          editor.chain().focus().unsetTextAlign().run()
        } else {
          editor.chain().focus().setTextAlign(value).run()
        }
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [editor],
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
              const currentIndex = ALIGN_OPTIONS.findIndex((o) => o.value === currentAlign)
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
      [currentAlign, onKeyDownProp],
    )

    const handleOptionKeyDown = useCallback((e: KeyboardEvent) => {
      const buttons = listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]')
      if (!buttons) return
      const currentIndex = Array.from(buttons).indexOf(e.currentTarget as HTMLButtonElement)

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          e.stopPropagation()
          buttons[(currentIndex + 1) % buttons.length]?.focus()
          break
        case 'ArrowLeft':
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
    }, [])

    useEffect(() => {
      if (isOpen) {
        const handleClickOutside = (e: MouseEvent) => {
          if (
            !triggerRef.current?.contains(e.target as Node) &&
            !listboxRef.current?.contains(e.target as Node)
          ) {
            setIsOpen(false)
          }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
      return undefined
    }, [isOpen])

    return (
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
          onKeyDown={handleTriggerKeyDown}
          onClick={() => setIsOpen((prev) => !prev)}
          onFocus={() => {
            setIsFocused(true)
            onFocusProp?.()
          }}
          onBlur={() => setIsFocused(false)}
          className={classNames.trigger()}
        >
          {getAlignIcon(currentAlign)}
          <FaChevronDownIcon className="shr-shrink-0 shr-text-xs" />
        </button>
        <span aria-hidden="true" className={classNames.tooltip()}>
          {dropdownLabel}
        </span>
        {isOpen && (
          <div
            ref={listboxRef}
            role="listbox"
            aria-label={dropdownLabel}
            aria-orientation="horizontal"
            className={classNames.listbox()}
          >
            {ALIGN_OPTIONS.map((option) => {
              const label = localize({ id: option.labelId, defaultText: option.defaultText })
              const isSelected = option.value === currentAlign

              return (
                <span key={option.value} className={classNames.optionWrapper()}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-label={label}
                    className={`${classNames.option()} ${isSelected ? 'shr-bg-white-darken' : ''}`}
                    onClick={() => selectOption(option.value)}
                    onKeyDown={handleOptionKeyDown}
                  >
                    {getAlignIcon(option.value)}
                  </button>
                  <span aria-hidden="true" className={classNames.optionTooltip()}>
                    {label}
                  </span>
                </span>
              )
            })}
          </div>
        )}
      </span>
    )
  },
)
