'use client'

import { type FC, type KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
import { FaCaretDownIcon } from 'smarthr-ui'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../../intl'
import { useRichTextEditorContext } from '../../context/RichTextEditorContext'
import { setEditorColor } from '../../extensions/Table/tableColor'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'
import { useToolbarState } from '../../hooks/useToolbarState'
import { ToolbarTooltip } from '../ToolbarTooltip'
import { TOOLBAR_ITEM_CLASS_NAME } from '../toolbarItemStyle'

import { ColorPickerPalette } from './ColorPickerPalette'
import { ColorSwatchFace } from './ColorSwatch'
import { DEFAULT_BACKGROUND_COLOR, EDITOR_BACKGROUND_COLORS } from './backgroundColors'
import { normalizeHex } from './normalizeHex'
import { useCurrentColorLabel } from './useCurrentColorLabel'

const RECENT_LIMIT = 5

const classNameGenerator = tv({
  slots: {
    trigger: [TOOLBAR_ITEM_CLASS_NAME, 'smarthr-ui-RichTextEditor-BackgroundColorPickerButton'],
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
        setEditorColor(editor, 'backgroundColor', hex)
      },
      [editor],
    )

    const onUnsetColor = useCallback(() => {
      setEditorColor(editor, 'backgroundColor', null)
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
    const noneLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColorNone',
      defaultText: 'なし',
    })
    const editButtonAccessibleLabel = useCallback(
      (color: string) =>
        localize(
          {
            id: 'smarthr-ui/RichTextEditor/backgroundColorEditButtonWithCurrent',
            defaultText: '背景色を編集（現在の色: {color}）',
          },
          { color },
        ),
      [localize],
    )
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

    // 背景色パレットに白のスウォッチは無く、未設定はどの色も選ばれていない状態なので「なし」を読み上げる
    const currentColorLabel = useCurrentColorLabel({
      currentColor,
      colors: EDITOR_BACKGROUND_COLORS,
      defaultColor: DEFAULT_BACKGROUND_COLOR,
      unsetLabel: noneLabel,
    })

    return (
      <>
        <ToolbarTooltip suppressed={isOpen || disabled} label={backgroundColorLabel}>
          <button
            ref={(el) => {
              triggerRef.current = el
              refProp?.(el)
            }}
            type="button"
            disabled={disabled}
            tabIndex={tabIndex}
            className={classNames.trigger()}
            aria-label={`${backgroundColorLabel}: ${currentColorLabel}`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onKeyDown={handleTriggerKeyDown}
            onClick={() => setIsOpen((prev) => !prev)}
            onFocus={onFocusProp}
          >
            <ColorSwatchFace
              appearance="backgroundColor"
              size="S"
              color={currentColor ?? DEFAULT_BACKGROUND_COLOR}
              aria-hidden="true"
            />
            <FaCaretDownIcon className="shr-text-xs" />
          </button>
        </ToolbarTooltip>
        {renderDropdown(
          <ColorPickerPalette
            paletteRef={paletteRef}
            triggerRef={triggerRef}
            appearance="backgroundColor"
            colors={EDITOR_BACKGROUND_COLORS}
            defaultColor={DEFAULT_BACKGROUND_COLOR}
            currentColor={currentColor}
            recentColors={recentColors}
            pushRecent={pushRecent}
            customColor={customColor}
            dialogLabel={backgroundColorLabel}
            standardSectionLabel={standardSectionLabel}
            customSectionLabel={customSectionLabel}
            recentSectionLabel={recentSectionLabel}
            editButtonLabel={editButtonLabel}
            resetButtonLabel={resetLabel}
            editButtonAccessibleLabel={editButtonAccessibleLabel}
            recentSwatchLabel={recentSwatchLabel}
            setIsOpen={setIsOpen}
            setCustomColor={setCustomColor}
            onApplyColor={onApplyColor}
            onUnsetColor={onUnsetColor}
          />,
        )}
      </>
    )
  },
)
