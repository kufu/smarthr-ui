'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { FaChevronDownIcon } from '../../../Icon'
import { useRichTextEditorContext } from '../../context/RichTextEditorContext'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'
import { useToolbarState } from '../../hooks/useToolbarState'

import { ColorPickerPalette, normalizeHex } from './ColorPickerPalette'
import { DEFAULT_COLOR, EDITOR_COLORS } from './textColors'

const RECENT_LIMIT = 5

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
  },
})

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const TextColorPickerButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const paletteRef = useRef<HTMLDivElement>(null)
    const [recentColors, setRecentColors] = useState<string[]>([])
    const [customColor, setCustomColor] = useState<string>(DEFAULT_COLOR)

    const currentColor = state.currentColor

    const classNames = classNameGenerator()

    const pushRecent = useCallback((hex: string) => {
      const normalized = normalizeHex(hex, DEFAULT_COLOR)
      setRecentColors((prev) => {
        const without = prev.filter((c) => normalizeHex(c, DEFAULT_COLOR) !== normalized)
        return [normalized, ...without].slice(0, RECENT_LIMIT)
      })
    }, [])

    const onApplyColor = useCallback(
      (hex: string) => {
        editor.chain().focus().setColor(hex).run()
      },
      [editor],
    )

    const onUnsetColor = useCallback(() => {
      editor.chain().focus().unsetColor().run()
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

    useEffect(() => {
      if (isOpen && currentColor) {
        setCustomColor(normalizeHex(currentColor, DEFAULT_COLOR))
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
    const recentSwatchLabel = useCallback(
      (color: string) =>
        localize(
          {
            id: 'smarthr-ui/RichTextEditor/colorRecentSwatchLabel',
            defaultText: '履歴: {color}',
          },
          { color },
        ),
      [localize],
    )

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
          <ColorPickerPalette
            paletteRef={paletteRef}
            triggerRef={triggerRef}
            setIsOpen={setIsOpen}
            colors={EDITOR_COLORS}
            defaultColor={DEFAULT_COLOR}
            currentColor={currentColor}
            recentColors={recentColors}
            pushRecent={pushRecent}
            customColor={customColor}
            setCustomColor={setCustomColor}
            onApplyColor={onApplyColor}
            onUnsetColor={onUnsetColor}
            dialogLabel={colorLabel}
            standardSectionLabel={standardSectionLabel}
            customSectionLabel={customSectionLabel}
            recentSectionLabel={recentSectionLabel}
            editButtonLabel={editButtonLabel}
            resetButtonLabel={resetLabel}
            recentSwatchLabel={recentSwatchLabel}
          />,
        )}
      </>
    )
  },
)
