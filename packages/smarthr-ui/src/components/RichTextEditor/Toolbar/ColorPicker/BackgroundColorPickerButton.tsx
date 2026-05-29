'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { FaChevronDownIcon, FaHighlighterIcon } from '../../../Icon'
import { useRichTextEditorContext } from '../../context/RichTextEditorContext'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'
import { useToolbarState } from '../../hooks/useToolbarState'

import { ColorPickerPalette, normalizeHex } from './ColorPickerPalette'
import { DEFAULT_BACKGROUND_COLOR, EDITOR_BACKGROUND_COLORS } from './backgroundColors'

const RECENT_LIMIT = 5

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-RichTextEditor-BackgroundColorPickerButton',
      'shr-inline-flex shr-cursor-pointer shr-items-center shr-gap-0.25',
      'shr-rounded-m shr-border-none shr-bg-transparent shr-p-0.5',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-cursor-default disabled:shr-text-disabled disabled:hover:shr-bg-transparent',
    ],
    // border-shorthand で白(#fff)時にも視認できるようにする
    colorIndicator: 'shr-border-shorthand shr-h-[3px] shr-w-full shr-rounded-full',
  },
})

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const BackgroundColorPickerButton: FC<Props> = memo(
  ({ tabIndex = -1, disabled, onKeyDown: onKeyDownProp, onFocus: onFocusProp, ref: refProp }) => {
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const state = useToolbarState(editor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const paletteRef = useRef<HTMLDivElement>(null)
    const [recentColors, setRecentColors] = useState<string[]>([])
    const [customColor, setCustomColor] = useState<string>(DEFAULT_BACKGROUND_COLOR)

    const currentColor = state.currentBackgroundColor

    const classNames = classNameGenerator()

    const pushRecent = useCallback((hex: string) => {
      const normalized = normalizeHex(hex, DEFAULT_BACKGROUND_COLOR)
      setRecentColors((prev) => {
        const without = prev.filter((c) => normalizeHex(c, DEFAULT_BACKGROUND_COLOR) !== normalized)
        return [normalized, ...without].slice(0, RECENT_LIMIT)
      })
    }, [])

    const onApplyColor = useCallback(
      (hex: string) => {
        editor.chain().focus().setBackgroundColor(hex).run()
      },
      [editor],
    )

    const onUnsetColor = useCallback(() => {
      editor.chain().focus().unsetBackgroundColor().run()
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
        setCustomColor(normalizeHex(currentColor, DEFAULT_BACKGROUND_COLOR))
      }
    }, [isOpen, currentColor])

    const backgroundColorLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColor',
      defaultText: '背景色',
    })
    const resetLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColorReset',
      defaultText: '背景色をリセット',
    })
    const standardSectionLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColorStandardSection',
      defaultText: '標準の色',
    })
    const customSectionLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColorCustomSection',
      defaultText: 'カスタム',
    })
    const recentSectionLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColorRecentSection',
      defaultText: '履歴',
    })
    const editButtonLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColorEditButton',
      defaultText: '背景色を編集',
    })
    const recentSwatchLabel = useCallback(
      (color: string) =>
        localize(
          {
            id: 'smarthr-ui/RichTextEditor/backgroundColorRecentSwatchLabel',
            defaultText: '背景色履歴: {color}',
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
            aria-label={backgroundColorLabel}
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
              <FaHighlighterIcon className="shr-text-base" aria-hidden />
              <span
                className={classNames.colorIndicator()}
                style={{ backgroundColor: currentColor ?? DEFAULT_BACKGROUND_COLOR }}
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
            colors={EDITOR_BACKGROUND_COLORS}
            defaultColor={DEFAULT_BACKGROUND_COLOR}
            currentColor={currentColor}
            recentColors={recentColors}
            pushRecent={pushRecent}
            customColor={customColor}
            setCustomColor={setCustomColor}
            onApplyColor={onApplyColor}
            onUnsetColor={onUnsetColor}
            dialogLabel={backgroundColorLabel}
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
