'use client'

import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  memo,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Checkbox, FaCaretDownIcon } from 'smarthr-ui'

import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { normalizeHex } from '../../../../libs/normalizeHex'
import { tv } from '../../../../libs/tv'
import { useRichTextEditorContext } from '../../context/RichTextEditorContext'
import { readBlockBackgroundTarget } from '../../extensions/BlockBackground/BlockBackground'
import { getEditorColor, setEditorColor } from '../../extensions/Table/tableColor'
import { useToolbarDropdown } from '../../hooks/useToolbarDropdown'
import { useToolbarValue } from '../../hooks/useToolbarState'
import { ToolbarTooltip } from '../ToolbarTooltip'
import { TOOLBAR_ITEM_CLASS_NAME } from '../toolbarItemStyle'

import { ColorPickerPalette } from './ColorPickerPalette'
import { ColorSwatchFace } from './ColorSwatch'
import { DEFAULT_BACKGROUND_COLOR, EDITOR_BACKGROUND_COLORS } from './backgroundColors'
import { isPlainArrowKey } from './swatchFocusTarget'
import { DEFAULT_COLOR, EDITOR_COLORS } from './textColors'

import type { RovingButtonProps } from '../../hooks/useRovingToolbar'
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
      reset: { id: 'smarthr-ui/RichTextEditor/colorReset', defaultText: '文字色をリセット' },
      standardSection: {
        id: 'smarthr-ui/RichTextEditor/colorStandardSection',
        defaultText: '標準の色',
      },
      customSection: {
        id: 'smarthr-ui/RichTextEditor/colorCustomSection',
        defaultText: 'カスタム',
      },
      recentSection: {
        id: 'smarthr-ui/RichTextEditor/colorRecentSection',
        defaultText: '最近使った色',
      },
      editButton: { id: 'smarthr-ui/RichTextEditor/colorEditButton', defaultText: 'その他の色' },
      // 未設定は黒が適用された状態と等価なため、パレットの選択状態と揃えて黒として読み上げる
      unset: { id: 'smarthr-ui/RichTextEditor/colorBlack', defaultText: '黒' },
      customSwatch: {
        id: 'smarthr-ui/RichTextEditor/colorCustomSwatchLabel',
        defaultText: 'カスタム：{color}',
      },
      recentSwatch: {
        id: 'smarthr-ui/RichTextEditor/colorRecentSwatchLabel',
        defaultText: '履歴：{color}',
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
        defaultText: '最近使った色',
      },
      editButton: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorEditButton',
        defaultText: 'その他の背景色',
      },
      // 背景色パレットに白のスウォッチは無く、未設定はどの色も選ばれていない状態なので「なし」を読み上げる
      unset: { id: 'smarthr-ui/RichTextEditor/backgroundColorNone', defaultText: 'なし' },
      customSwatch: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorCustomSwatchLabel',
        defaultText: 'カスタム：{color}',
      },
      recentSwatch: {
        id: 'smarthr-ui/RichTextEditor/backgroundColorRecentSwatchLabel',
        defaultText: '履歴：{color}',
      },
    },
  },
} as const

const classNameGenerator = tv({
  slots: {
    trigger: TOOLBAR_ITEM_CLASS_NAME,
  },
})

const CLASS_NAMES = (() => {
  const { trigger } = classNameGenerator()

  return {
    color: trigger({ className: CONFIGS.color.className }),
    backgroundColor: trigger({ className: CONFIGS.backgroundColor.className }),
  }
})()

type Props = RovingButtonProps & {
  attribute: keyof typeof CONFIGS
  disabled?: boolean
}

/**
 * 塗り先（文字か、本文の幅全体か）を毎トランザクション購読せず開いたときに読むのは、
 * 開いている間は本文も選択も変わらない（本文を押すと閉じる）ため
 */
type BlockScope = { available: boolean; checked: boolean; color: string | null }

const STANDARD_SWATCH_SELECTOR = '[data-color-swatch="standard"]'

export const ColorPickerButton: FC<Props> = memo(
  ({
    attribute,
    tabIndex = -1,
    disabled,
    onKeyDown: onKeyDownProp,
    onFocus: onFocusProp,
    ref: refProp,
  }) => {
    const { colors, defaultColor, readCurrentColor, messages } = CONFIGS[attribute]
    const { editor, features } = useRichTextEditorContext()
    const { localize } = useIntl()
    const currentColor = useToolbarValue(editor, readCurrentColor)
    const { isOpen, setIsOpen, triggerRef, renderDropdown } = useToolbarDropdown({
      disabled,
    })
    const mergedTriggerRef = useMergeRefs(triggerRef, refProp)
    const paletteRef = useRef<HTMLDivElement>(null)
    const blockScopeRef = useRef<HTMLInputElement>(null)
    const [recentColors, setRecentColors] = useState<string[]>([])
    const [customColor, setCustomColor] = useState<string>(defaultColor)
    const [blockScope, setBlockScope] = useState<BlockScope | null>(null)
    // features の backgroundColor を見ないのは、背景色のボタンはそれがあるときにしか並ばないため
    const hasBlockScope =
      attribute === 'backgroundColor' && features.includes('blockBackgroundColor')
    const activeBlockScope = hasBlockScope ? blockScope : null

    const latest = useLatest({
      editor,
      attribute,
      defaultColor,
      currentColor,
      isOpen,
      activeBlockScope,
      hasBlockScope,
      onKeyDown: onKeyDownProp,
      setIsOpen,
      localize,
      messages,
    })

    const functions = useMemo(() => {
      const syncCustomColor = (color: string | null) => {
        if (color) setCustomColor(normalizeHex(color, latest.defaultColor))
      }

      const open = () => {
        let scope: BlockScope | null = null

        if (latest.hasBlockScope) {
          const { available, color } = readBlockBackgroundTarget(latest.editor.state)

          // 範囲を選んで開いたときに帯へ倒さないのは、範囲を選ぶのは文字を塗りたいときが多く、
          // 見出しの一部の文字を塗ったつもりで見出し全体の帯を塗り替えてしまうため
          scope = {
            available,
            color,
            checked: available && latest.editor.state.selection.empty && color !== null,
          }
        }

        setBlockScope(scope)
        syncCustomColor(scope?.checked ? scope.color : latest.currentColor)
        latest.setIsOpen(true)
      }

      const apply = (hex: string | null) => {
        if (latest.activeBlockScope?.checked) {
          latest.editor.chain().focus().setBlockBackgroundColor(hex).run()
        } else {
          setEditorColor(latest.editor, latest.attribute, hex)
        }
      }

      return {
        pushRecent: (hex: string) => {
          const normalized = normalizeHex(hex, latest.defaultColor)
          setRecentColors((prev) => {
            const without = prev.filter((c) => normalizeHex(c, latest.defaultColor) !== normalized)
            return [normalized, ...without].slice(0, RECENT_LIMIT)
          })
        },
        handleApplyColor: (hex: string) => apply(hex),
        handleUnsetColor: () => apply(null),
        handleTriggerClick: () => {
          if (latest.isOpen) latest.setIsOpen(false)
          else open()
        },
        handleTriggerKeyDown: (e: KeyboardEvent) => {
          switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
              e.preventDefault()
              e.stopPropagation()

              if (!latest.isOpen) open()

              // チェックボックスが使えるときに最初の色見本へ移さないのは、文字と幅全体のどちらに塗るかを先に読み上げるため
              requestAnimationFrame(() => {
                ;(latest.activeBlockScope?.available
                  ? blockScopeRef.current
                  : paletteRef.current?.querySelector<HTMLElement>(STANDARD_SWATCH_SELECTOR)
                )?.focus()
              })
              break
            default:
              latest.onKeyDown?.(e)
          }
        },
        handleBlockScopeKeyDown: (e: KeyboardEvent) => {
          if (!isPlainArrowKey(e)) return

          // 素通りさせないのは、ドロップダウンの外枠やページがスクロールするため
          e.preventDefault()

          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.stopPropagation()
            paletteRef.current?.querySelector<HTMLElement>(STANDARD_SWATCH_SELECTOR)?.focus()
          }
        },
        handleBlockScopeChange: (e: ChangeEvent<HTMLInputElement>) => {
          const scope = latest.activeBlockScope

          if (!scope) return

          const { checked } = e.currentTarget

          setBlockScope({ ...scope, checked })
          syncCustomColor(checked ? scope.color : latest.currentColor)
        },
        customSwatchLabel: (color: string) =>
          latest.localize(latest.messages.customSwatch, { color }),
        recentSwatchLabel: (color: string) =>
          latest.localize(latest.messages.recentSwatch, { color }),
      }
    }, [latest])

    const label = localize(messages.label)
    const resetLabel = localize(messages.reset)
    const standardSectionLabel = localize(messages.standardSection)
    const customSectionLabel = localize(messages.customSection)
    const recentSectionLabel = localize(messages.recentSection)
    const editButtonLabel = localize(messages.editButton)
    const unsetLabel = localize(messages.unset)
    const blockScopeLabel = localize({
      id: 'smarthr-ui/RichTextEditor/backgroundColorWholeWidth',
      defaultText: '幅全体に適用',
    })
    const normalizedCurrentColor =
      currentColor === null ? null : normalizeHex(currentColor, defaultColor)
    const matchedColor = colors.find(
      (color) => normalizeHex(color.value, defaultColor) === normalizedCurrentColor,
    )
    const currentColorLabel =
      normalizedCurrentColor === null
        ? unsetLabel
        : matchedColor
          ? localize({ id: matchedColor.labelId, defaultText: matchedColor.defaultText })
          : normalizedCurrentColor

    const paletteHeader = useMemo(
      () =>
        activeBlockScope ? (
          <Checkbox
            ref={blockScopeRef}
            name="blockBackgroundScope"
            disabled={!activeBlockScope.available}
            checked={activeBlockScope.checked}
            onChange={functions.handleBlockScopeChange}
            onKeyDown={functions.handleBlockScopeKeyDown}
          >
            {blockScopeLabel}
          </Checkbox>
        ) : null,
      [activeBlockScope, blockScopeLabel, functions],
    )

    return (
      <>
        <ToolbarTooltip suppressed={isOpen || disabled} label={label}>
          <button
            ref={mergedTriggerRef}
            type="button"
            disabled={disabled}
            tabIndex={tabIndex}
            className={CLASS_NAMES[attribute]}
            aria-label={`${label}: ${currentColorLabel}`}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onKeyDown={functions.handleTriggerKeyDown}
            onClick={functions.handleTriggerClick}
            onFocus={onFocusProp}
          >
            <ColorSwatchFace
              appearance={attribute}
              size="S"
              color={currentColor ?? defaultColor}
              aria-hidden="true"
            />
            <FaCaretDownIcon className="shr-rte-text-xs" />
          </button>
        </ToolbarTooltip>
        {renderDropdown(
          <ColorPickerPalette
            paletteRef={paletteRef}
            triggerRef={triggerRef}
            appearance={attribute}
            colors={colors}
            defaultColor={defaultColor}
            currentColor={activeBlockScope?.checked ? activeBlockScope.color : currentColor}
            recentColors={recentColors}
            pushRecent={functions.pushRecent}
            customColor={customColor}
            dialogLabel={label}
            standardSectionLabel={standardSectionLabel}
            customSectionLabel={customSectionLabel}
            recentSectionLabel={recentSectionLabel}
            editButtonLabel={editButtonLabel}
            resetButtonLabel={resetLabel}
            customSwatchLabel={functions.customSwatchLabel}
            recentSwatchLabel={functions.recentSwatchLabel}
            setIsOpen={setIsOpen}
            setCustomColor={setCustomColor}
            handleApplyColor={functions.handleApplyColor}
            handleUnsetColor={functions.handleUnsetColor}
            header={paletteHeader}
          />,
        )}
      </>
    )
  },
)
