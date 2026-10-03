'use client'

import { type FC, type KeyboardEvent, memo, useMemo } from 'react'

import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { readers, useToolbarValue } from '../hooks/useToolbarState'

import { ToolbarListboxDropdown, type ToolbarListboxOption } from './ToolbarListboxDropdown'

const DEFAULT_ROOT_FONT_SIZE = 16
const LENGTH_PATTERN = /^(\d+(?:\.\d+)?)(px|rem|em)$/

// value が px ではなく rem なのは、px だとブラウザのフォントサイズ設定に追従せず、
// 未指定(16)だけが追従して不整合になるため。em ではないのは、pre/code のように
// font-size を縮めた文脈でラベルと実寸がずれるのを避けるため。
// px を併記するのは、他エディタから引き継いだ px 値を選択肢へ対応づけるのに
// 文字列一致では足りず、ラベルと選択判定で同じ基準が必要なため。
const FONT_SIZES = [
  { px: 12, value: '0.75rem' },
  { px: 14, value: '0.875rem' },
  { px: 16, value: null },
  { px: 18, value: '1.125rem' },
  { px: 20, value: '1.25rem' },
  { px: 24, value: '1.5rem' },
  { px: 30, value: '1.875rem' },
  { px: 36, value: '2.25rem' },
  { px: 48, value: '3rem' },
  { px: 60, value: '3.75rem' },
  { px: 72, value: '4.5rem' },
] as const

/** 既定のルートフォントサイズ換算の px。解釈できない単位は null */
const toPxSize = (value: string | null) => {
  if (value === null) return DEFAULT_ROOT_FONT_SIZE

  const matched = LENGTH_PATTERN.exec(value)

  if (!matched) return null

  const [, num, unit] = matched

  return unit === 'px' ? Number(num) : Number(num) * DEFAULT_ROOT_FONT_SIZE
}

const OPTIONS: readonly ToolbarListboxOption[] = FONT_SIZES.map(({ px }) => ({
  key: String(px),
  label: String(px),
  content: <span>{px}</span>,
}))

const DEFAULT_INDEX = FONT_SIZES.findIndex((s) => s.value === null)

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const FontSizeDropdown: FC<Props> = memo(({ disabled, ...rest }) => {
  const { editor } = useRichTextEditorContext()
  const { localize } = useIntl()
  const currentValue = useToolbarValue(editor, readers.currentFontSize)
  const isInHeading = useToolbarValue(editor, readers.isInHeading)

  const currentSize = toPxSize(currentValue)
  // 端数は Froala と同じく切り捨てて見せる。選択状態は端数を含めた値で判定するため、
  // 11pt(14.67px) を選択肢の 14 と取り違えない。解釈できない単位はそのまま見せる
  const currentLabel = currentSize === null ? currentValue : Math.floor(currentSize)

  const functions = useMemo(
    () => ({
      handleSelect: (index: number) => {
        const { value } = FONT_SIZES[index]

        if (value === null) {
          editor.chain().focus().unsetFontSize().run()
        } else {
          editor.chain().focus().setFontSize(value).run()
        }
      },
    }),
    [editor],
  )

  return (
    <ToolbarListboxDropdown
      {...rest}
      disabled={disabled || isInHeading}
      selectedIndex={FONT_SIZES.findIndex((s) => s.px === currentSize)}
      valueLabel={currentLabel}
      triggerContent={<span className="shr-flex-1">{currentLabel}</span>}
      fallbackIndex={DEFAULT_INDEX}
      appearance="list"
      triggerClassName="smarthr-ui-RichTextEditor-FontSizeDropdown shr-min-w-[4em] shr-text-sm"
      listboxClassName="shr-min-w-[5em]"
      handleSelect={functions.handleSelect}
      label={localize({
        id: 'smarthr-ui/RichTextEditor/fontSizeDropdownLabel',
        defaultText: 'フォントサイズ',
      })}
      options={OPTIONS}
    />
  )
})
