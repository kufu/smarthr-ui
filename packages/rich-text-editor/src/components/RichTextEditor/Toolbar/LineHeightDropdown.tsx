'use client'

import { type FC, type KeyboardEvent, memo, useMemo } from 'react'
import { FaTextHeightIcon } from 'smarthr-ui'

import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { readers, useToolbarValue } from '../hooks/useToolbarState'

import { ToolbarListboxDropdown, type ToolbarListboxOption } from './ToolbarListboxDropdown'

// value=null はデフォルト（unset）。それ以外は LineHeight 拡張の allowlist と一致させる。
const LINE_HEIGHT_OPTIONS = [
  { value: '1', label: '1' },
  { value: '1.25', label: '1.25' },
  { value: '1.5', label: '1.5' },
  { value: null, label: '1.75' }, // デフォルト = unset（ラベルに「標準」を付加）
  { value: '2', label: '2' },
] as const

const DEFAULT_INDEX = LINE_HEIGHT_OPTIONS.findIndex((o) => o.value === null)

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const LineHeightDropdown: FC<Props> = memo((props) => {
  const { editor } = useRichTextEditorContext()
  const { localize } = useIntl()
  const currentLineHeight = useToolbarValue(editor, readers.currentLineHeight)

  // '1.75' は CSS デフォルト(RELAXED)と同値のため、デフォルト(null=未指定)として扱う。
  // これにより HTML/JSON 由来で attrs.lineHeight='1.75' が入っても「1.75（標準）」が選択表示になる。
  const currentValue = currentLineHeight === '1.75' ? null : currentLineHeight

  const defaultSuffix = localize({
    id: 'smarthr-ui/RichTextEditor/lineHeightDefaultSuffix',
    defaultText: '標準',
  })

  const options = useMemo<readonly ToolbarListboxOption[]>(
    () =>
      LINE_HEIGHT_OPTIONS.map((option) => {
        const label = option.value === null ? `${option.label}（${defaultSuffix}）` : option.label

        return { key: option.label, label, content: <span>{label}</span> }
      }),
    [defaultSuffix],
  )

  const currentOption = LINE_HEIGHT_OPTIONS.find((o) => o.value === currentValue)
  const currentLabel =
    currentOption && currentOption.value !== null ? currentOption.label : `1.75（${defaultSuffix}）`

  const functions = useMemo(
    () => ({
      handleSelect: (index: number) => {
        const { value } = LINE_HEIGHT_OPTIONS[index]

        if (value === null) {
          editor.chain().focus().unsetLineHeight().run()
        } else {
          editor.chain().focus().setLineHeight(value).run()
        }
      },
    }),
    [editor],
  )

  return (
    <ToolbarListboxDropdown
      {...props}
      selectedIndex={LINE_HEIGHT_OPTIONS.findIndex((o) => o.value === currentValue)}
      valueLabel={currentLabel}
      triggerContent={
        // viewBox が 576x512 と横長で、react-icons は幅と高さの小さいほうに合わせて
        // 縮小するため、16px では高さが 12.4px にしかならない。他のアイコンと同じ
        // 14px にするには 18px が要る。text-lg は 19.2px で行き過ぎる
        <FaTextHeightIcon className="shr-text-[18px]" />
      }
      fallbackIndex={DEFAULT_INDEX}
      appearance="list"
      triggerClassName="smarthr-ui-RichTextEditor-LineHeightDropdown"
      listboxClassName="shr-min-w-[7em]"
      handleSelect={functions.handleSelect}
      label={localize({
        id: 'smarthr-ui/RichTextEditor/lineHeightDropdownLabel',
        defaultText: '行送り',
      })}
      options={options}
    />
  )
})
