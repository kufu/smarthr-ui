'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import {
  FaAlignCenterIcon,
  FaAlignJustifyIcon,
  FaAlignLeftIcon,
  FaAlignRightIcon,
  FaCaretDownIcon,
} from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useIsApplePlatform } from '../hooks/useIsApplePlatform'
import { useToolbarDropdown } from '../hooks/useToolbarDropdown'
import { useToolbarState } from '../hooks/useToolbarState'

import { ToolbarTooltip } from './ToolbarTooltip'
import { toAriaKeyShortcuts } from './shortcutKeys'
import { TOOLBAR_ITEM_CLASS_NAME } from './toolbarItemStyle'

// shortcut は @tiptap/extension-text-align の既定バインドと対応する。
// Tiptap は拡張のキーバインドを外部へ公開していないため二重管理になる。
const ALIGN_OPTIONS = [
  {
    value: 'left',
    labelId: 'smarthr-ui/RichTextEditor/alignLeft',
    defaultText: '左揃え',
    shortcut: 'Mod-Shift-L',
  },
  {
    value: 'center',
    labelId: 'smarthr-ui/RichTextEditor/alignCenter',
    defaultText: '中央揃え',
    shortcut: 'Mod-Shift-E',
  },
  {
    value: 'right',
    labelId: 'smarthr-ui/RichTextEditor/alignRight',
    defaultText: '右揃え',
    shortcut: 'Mod-Shift-R',
  },
  {
    value: 'justify',
    labelId: 'smarthr-ui/RichTextEditor/alignJustify',
    defaultText: '両端揃え',
    shortcut: 'Mod-Shift-J',
  },
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
      TOOLBAR_ITEM_CLASS_NAME,
      'smarthr-ui-RichTextEditor-TextAlignDropdown',
      'shr-text-sm',
    ],
    listbox: [
      'shr-border-shorthand shr-flex shr-items-center shr-gap-0.25 shr-rounded-m shr-bg-white shr-p-0.25 shr-shadow-layer-3',
    ],
    option: [
      'shr-flex shr-cursor-pointer shr-items-center shr-justify-center shr-rounded-m shr-border-none shr-bg-transparent shr-p-0.5 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
  },
})

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const TextAlignDropdown: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const isApple = useIsApplePlatform()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const listboxRef = useRef<HTMLDivElement>(null)

    const currentAlign = state.currentTextAlign ?? 'left'
    const currentOption = ALIGN_OPTIONS.find((o) => o.value === currentAlign) ?? ALIGN_OPTIONS[0]
    const currentLabel = localize({
      id: currentOption.labelId,
      defaultText: currentOption.defaultText,
    })

    const classNames = classNameGenerator()

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
      [currentAlign, onKeyDownProp, setIsOpen],
    )

    const handleOptionKeyDown = useCallback(
      (e: KeyboardEvent) => {
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
      },
      [setIsOpen, triggerRef],
    )

    return (
      <>
        <ToolbarTooltip label={dropdownLabel} suppressed={isOpen || disabled}>
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
            onFocus={onFocusProp}
            className={classNames.trigger()}
          >
            {getAlignIcon(currentAlign)}
            <FaCaretDownIcon className="shr-shrink-0 shr-text-xs" />
          </button>
        </ToolbarTooltip>
        {renderDropdown(
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
                <ToolbarTooltip key={option.value} label={label} shortcut={option.shortcut}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-label={label}
                    aria-keyshortcuts={toAriaKeyShortcuts(option.shortcut, isApple)}
                    className={`${classNames.option()} ${isSelected ? 'shr-bg-white-darken' : ''}`}
                    onClick={() => selectOption(option.value)}
                    onKeyDown={handleOptionKeyDown}
                  >
                    {getAlignIcon(option.value)}
                  </button>
                </ToolbarTooltip>
              )
            })}
          </div>,
        )}
      </>
    )
  },
)
