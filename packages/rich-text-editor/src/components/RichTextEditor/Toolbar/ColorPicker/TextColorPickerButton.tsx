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
import { normalizeHex } from './normalizeHex'
import { DEFAULT_COLOR, EDITOR_COLORS } from './textColors'
import { useCurrentColorLabel } from './useCurrentColorLabel'

const RECENT_LIMIT = 5

const classNameGenerator = tv({
  slots: {
    trigger: [TOOLBAR_ITEM_CLASS_NAME, 'smarthr-ui-RichTextEditor-ColorPickerButton'],
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
        setEditorColor(editor, 'color', hex)
      },
      [editor],
    )

    const onUnsetColor = useCallback(() => {
      setEditorColor(editor, 'color', null)
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
    const blackLabel = localize({
      id: 'smarthr-ui/RichTextEditor/colorBlack',
      defaultText: '黒',
    })
    const customSwatchLabel = useCallback(
      (color: string) =>
        localize(
          {
            id: 'smarthr-ui/RichTextEditor/colorCustomSwatchLabel',
            defaultText: 'カスタム: {color}',
          },
          { color },
        ),
      [localize],
    )
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

    // 未設定は黒が適用された状態と等価なため、パレットの選択状態と揃えて黒として読み上げる
    const currentColorLabel = useCurrentColorLabel({
      currentColor,
      colors: EDITOR_COLORS,
      defaultColor: DEFAULT_COLOR,
      unsetLabel: blackLabel,
    })

    return (
      <>
        <ToolbarTooltip suppressed={isOpen || disabled} label={colorLabel}>
          <button
            ref={(el) => {
              triggerRef.current = el
              refProp?.(el)
            }}
            type="button"
            disabled={disabled}
            tabIndex={tabIndex}
            className={classNames.trigger()}
            aria-label={`${colorLabel}: ${currentColorLabel}`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onKeyDown={handleTriggerKeyDown}
            onClick={() => setIsOpen((prev) => !prev)}
            onFocus={onFocusProp}
          >
            <ColorSwatchFace
              appearance="color"
              size="S"
              color={currentColor ?? DEFAULT_COLOR}
              aria-hidden="true"
            />
            <FaCaretDownIcon className="shr-text-xs" />
          </button>
        </ToolbarTooltip>
        {renderDropdown(
          <ColorPickerPalette
            paletteRef={paletteRef}
            triggerRef={triggerRef}
            appearance="color"
            colors={EDITOR_COLORS}
            defaultColor={DEFAULT_COLOR}
            currentColor={currentColor}
            recentColors={recentColors}
            pushRecent={pushRecent}
            customColor={customColor}
            dialogLabel={colorLabel}
            standardSectionLabel={standardSectionLabel}
            customSectionLabel={customSectionLabel}
            recentSectionLabel={recentSectionLabel}
            editButtonLabel={editButtonLabel}
            resetButtonLabel={resetLabel}
            customSwatchLabel={customSwatchLabel}
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
