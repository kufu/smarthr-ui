'use client'

import {
  type FC,
  type KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FaCaretDownIcon } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { tv } from '../../../../libs/tv'
import { useRichTextEditorContext } from '../../context/RichTextEditorContext'
import { getEditorColor, setEditorColor } from '../../extensions/Table/tableColor'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'
import { useToolbarValue } from '../../hooks/useToolbarState'
import { ToolbarTooltip } from '../ToolbarTooltip'
import { TOOLBAR_ITEM_CLASS_NAME } from '../toolbarItemStyle'

import { ColorPickerPalette } from './ColorPickerPalette'
import { ColorSwatchFace } from './ColorSwatch'
import { DEFAULT_BACKGROUND_COLOR, EDITOR_BACKGROUND_COLORS } from './backgroundColors'
import { normalizeHex } from './normalizeHex'
import { DEFAULT_COLOR, EDITOR_COLORS } from './textColors'
import { useCurrentColorLabel } from './useCurrentColorLabel'

import type { Editor } from '@tiptap/react'

const RECENT_LIMIT = 5

const CONFIGS = {
  color: {
    colors: EDITOR_COLORS,
    defaultColor: DEFAULT_COLOR,
    className: 'smarthr-ui-RichTextEditor-ColorPickerButton',
    readCurrentColor: (e: Editor) => getEditorColor(e, 'color'),
    messages: {
      label: { id: 'smarthr-ui/RichTextEditor/color', defaultText: '文字色' },
      reset: { id: 'smarthr-ui/RichTextEditor/colorReset', defaultText: '色をリセット' },
      standardSection: {
        id: 'smarthr-ui/RichTextEditor/colorStandardSection',
        defaultText: '標準の色',
      },
      customSection: {
        id: 'smarthr-ui/RichTextEditor/colorCustomSection',
        defaultText: 'カスタム',
      },
      recentSection: { id: 'smarthr-ui/RichTextEditor/colorRecentSection', defaultText: '履歴' },
      editButton: { id: 'smarthr-ui/RichTextEditor/colorEditButton', defaultText: '色を編集' },
      // 未設定は黒が適用された状態と等価なため、パレットの選択状態と揃えて黒として読み上げる
      unset: { id: 'smarthr-ui/RichTextEditor/colorBlack', defaultText: '黒' },
      customSwatch: {
        id: 'smarthr-ui/RichTextEditor/colorCustomSwatchLabel',
        defaultText: 'カスタム: {color}',
      },
      recentSwatch: {
        id: 'smarthr-ui/RichTextEditor/colorRecentSwatchLabel',
        defaultText: '履歴: {color}',
      },
    },
  },
  backgroundColor: {
    colors: EDITOR_BACKGROUND_COLORS,
    defaultColor: DEFAULT_BACKGROUND_COLOR,
    className: 'smarthr-ui-RichTextEditor-BackgroundColorPickerButton',
    readCurrentColor: (e: Editor) => getEditorColor(e, 'backgroundColor'),
    messages: {
      label: { id: 'smarthr-ui/RichTextEditor/backgroundColor', defaultText: '背景色' },
      reset: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorReset',
        defaultText: '背景色をリセット',
      },
      standardSection: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorStandardSection',
        defaultText: '標準の色',
      },
      customSection: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorCustomSection',
        defaultText: 'カスタム',
      },
      recentSection: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorRecentSection',
        defaultText: '履歴',
      },
      editButton: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorEditButton',
        defaultText: '背景色を編集',
      },
      // 背景色パレットに白のスウォッチは無く、未設定はどの色も選ばれていない状態なので「なし」を読み上げる
      unset: { id: 'smarthr-ui/RichTextEditor/backgroundColorNone', defaultText: 'なし' },
      customSwatch: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorCustomSwatchLabel',
        defaultText: '背景色カスタム: {color}',
      },
      recentSwatch: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorRecentSwatchLabel',
        defaultText: '背景色履歴: {color}',
      },
    },
  },
} as const

const classNameGenerator = tv({
  slots: {
    trigger: TOOLBAR_ITEM_CLASS_NAME,
  },
})

type Props = {
  attribute: keyof typeof CONFIGS
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ColorPickerButton: FC<Props> = memo(
  ({
    attribute,
    tabIndex = -1,
    disabled,
    onKeyDown: onKeyDownProp,
    onFocus: onFocusProp,
    ref: refProp,
  }) => {
    const { colors, defaultColor, className, readCurrentColor, messages } = CONFIGS[attribute]
    const { editor } = useRichTextEditorContext()
    const { localize } = useIntl()
    const currentColor = useToolbarValue(editor, readCurrentColor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown()
    const paletteRef = useRef<HTMLDivElement>(null)
    const [recentColors, setRecentColors] = useState<string[]>([])
    const [customColor, setCustomColor] = useState<string>(defaultColor)

    const classNames = useMemo(() => {
      const { trigger } = classNameGenerator()

      return { trigger: trigger({ className }) }
    }, [className])

    const latest = useLatest({ attribute, defaultColor, onKeyDown: onKeyDownProp })

    const functions = useMemo(
      () => ({
        pushRecent: (hex: string) => {
          const normalized = normalizeHex(hex, latest.defaultColor)
          setRecentColors((prev) => {
            const without = prev.filter((c) => normalizeHex(c, latest.defaultColor) !== normalized)
            return [normalized, ...without].slice(0, RECENT_LIMIT)
          })
        },
        handleApplyColor: (hex: string) => {
          setEditorColor(editor, latest.attribute, hex)
        },
        handleUnsetColor: () => {
          setEditorColor(editor, latest.attribute, null)
        },
        handleTriggerKeyDown: (e: KeyboardEvent) => {
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
              latest.onKeyDown?.(e)
          }
        },
      }),
      [editor, setIsOpen, latest],
    )

    useEffect(() => {
      if (isOpen && currentColor) {
        setCustomColor(normalizeHex(currentColor, defaultColor))
      }
    }, [isOpen, currentColor, defaultColor])

    const label = localize(messages.label)
    const resetLabel = localize(messages.reset)
    const standardSectionLabel = localize(messages.standardSection)
    const customSectionLabel = localize(messages.customSection)
    const recentSectionLabel = localize(messages.recentSection)
    const editButtonLabel = localize(messages.editButton)
    const unsetLabel = localize(messages.unset)
    const customSwatchLabel = useCallback(
      (color: string) => localize(messages.customSwatch, { color }),
      [localize, messages],
    )
    const recentSwatchLabel = useCallback(
      (color: string) => localize(messages.recentSwatch, { color }),
      [localize, messages],
    )

    const currentColorLabel = useCurrentColorLabel({
      currentColor,
      colors,
      defaultColor,
      unsetLabel,
    })

    return (
      <>
        <ToolbarTooltip suppressed={isOpen || disabled} label={label}>
          <button
            ref={(el) => {
              triggerRef.current = el
              refProp?.(el)
            }}
            type="button"
            disabled={disabled}
            tabIndex={tabIndex}
            className={classNames.trigger}
            aria-label={`${label}: ${currentColorLabel}`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onKeyDown={functions.handleTriggerKeyDown}
            onClick={() => setIsOpen((prev) => !prev)}
            onFocus={onFocusProp}
          >
            <ColorSwatchFace
              appearance={attribute}
              size="S"
              color={currentColor ?? defaultColor}
              aria-hidden="true"
            />
            <FaCaretDownIcon className="shr-text-xs" />
          </button>
        </ToolbarTooltip>
        {renderDropdown(
          <ColorPickerPalette
            paletteRef={paletteRef}
            triggerRef={triggerRef}
            appearance={attribute}
            colors={colors}
            defaultColor={defaultColor}
            currentColor={currentColor}
            recentColors={recentColors}
            pushRecent={functions.pushRecent}
            customColor={customColor}
            dialogLabel={label}
            standardSectionLabel={standardSectionLabel}
            customSectionLabel={customSectionLabel}
            recentSectionLabel={recentSectionLabel}
            editButtonLabel={editButtonLabel}
            resetButtonLabel={resetLabel}
            customSwatchLabel={customSwatchLabel}
            recentSwatchLabel={recentSwatchLabel}
            setIsOpen={setIsOpen}
            setCustomColor={setCustomColor}
            handleApplyColor={functions.handleApplyColor}
            handleUnsetColor={functions.handleUnsetColor}
          />,
        )}
      </>
    )
  },
)
