'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { FaCheckIcon, FaChevronDownIcon } from '../../Icon'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { useToolbarState } from '../hooks/useToolbarState'

import { DEFAULT_COLOR, EDITOR_COLORS } from './colors'

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-ColorPickerButton',
      'shr-inline-flex shr-cursor-pointer shr-items-center shr-gap-0.25',
      'shr-rounded-m shr-border-none shr-bg-transparent shr-p-0.5',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
    colorIndicator: 'shr-h-[3px] shr-w-full shr-rounded-full',
    palette: [
      'shr-absolute shr-left-0 shr-top-full shr-z-overlap shr-mt-0.25',
      'shr-border-shorthand shr-flex shr-flex-col shr-gap-0.5 shr-rounded-m shr-bg-white shr-p-0.75 shr-shadow-layer-3',
    ],
    swatchRow: 'shr-flex shr-gap-0.5',
    swatch: [
      'shr-relative shr-inline-flex shr-items-center shr-justify-center',
      'shr-border-shorthand shr-h-[1.75em] shr-w-[1.75em] shr-cursor-pointer shr-rounded-full',
      'hover:shr-scale-110 hover:shr-shadow-layer-1',
      'focus-visible:shr-focus-indicator',
    ],
    resetButton: [
      'shr-border-shorthand shr-cursor-pointer shr-rounded-m shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
    ],
  },
})

type Props = {
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ColorPickerButton: FC<Props> = memo(
  ({ tabIndex = -1, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const paletteRef = useRef<HTMLDivElement>(null)

    const currentColor = (state as Record<string, unknown>).currentColor as string | null

    const classNames = classNameGenerator()

    const applyColor = useCallback(
      (color: string) => {
        editor.chain().focus().setColor(color).run()
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [editor],
    )

    const removeColor = useCallback(() => {
      editor.chain().focus().unsetColor().run()
      setIsOpen(false)
      triggerRef.current?.focus()
    }, [editor])

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
              paletteRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
            })
            break
          default:
            onKeyDownProp?.(e)
        }
      },
      [onKeyDownProp],
    )

    const handlePaletteKeyDown = useCallback((e: KeyboardEvent) => {
      const buttons = paletteRef.current?.querySelectorAll<HTMLButtonElement>('button')
      if (!buttons) return
      const idx = Array.from(buttons).indexOf(e.currentTarget as HTMLButtonElement)

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          e.stopPropagation()
          buttons[(idx + 1) % buttons.length]?.focus()
          break
        case 'ArrowLeft':
          e.preventDefault()
          e.stopPropagation()
          buttons[(idx - 1 + buttons.length) % buttons.length]?.focus()
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
            !paletteRef.current?.contains(e.target as Node)
          ) {
            setIsOpen(false)
          }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
      return undefined
    }, [isOpen])

    const colorLabel = localize({
      id: 'smarthr-ui/RichTextEditor/color',
      defaultText: '文字色',
    })
    const resetLabel = localize({
      id: 'smarthr-ui/RichTextEditor/colorReset',
      defaultText: '色をリセット',
    })

    return (
      <span className="shr-relative shr-inline-block">
        <button
          ref={(el) => {
            triggerRef.current = el
            refProp?.(el)
          }}
          type="button"
          aria-label={colorLabel}
          aria-expanded={isOpen}
          tabIndex={tabIndex}
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
              style={{ backgroundColor: currentColor ?? '#23221e' }}
            />
          </span>
          <FaChevronDownIcon className="shr-text-xs" />
        </button>
        {isOpen && (
          <div
            ref={paletteRef}
            role="group"
            aria-label={colorLabel}
            className={classNames.palette()}
          >
            <div className={classNames.swatchRow()}>
              {EDITOR_COLORS.map((color) => {
                const label = localize({ id: color.labelId, defaultText: color.defaultText })
                const isSelected =
                  currentColor === color.value ||
                  (currentColor === null && color.value === DEFAULT_COLOR)
                return (
                  <button
                    key={color.value}
                    type="button"
                    aria-label={label}
                    aria-pressed={isSelected}
                    className={classNames.swatch()}
                    style={{ backgroundColor: color.value }}
                    onClick={() => applyColor(color.value)}
                    onKeyDown={handlePaletteKeyDown}
                  >
                    {isSelected && (
                      <FaCheckIcon className="shr-text-xs shr-text-white shr-drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
                    )}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              className={classNames.resetButton()}
              onClick={removeColor}
              onKeyDown={handlePaletteKeyDown}
            >
              {resetLabel}
            </button>
          </div>
        )}
      </span>
    )
  },
)
