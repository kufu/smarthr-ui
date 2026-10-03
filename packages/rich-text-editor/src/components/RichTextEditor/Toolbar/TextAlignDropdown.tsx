'use client'

import { type FC, type KeyboardEvent, memo, useMemo } from 'react'
import {
  FaAlignCenterIcon,
  FaAlignJustifyIcon,
  FaAlignLeftIcon,
  FaAlignRightIcon,
} from 'smarthr-ui'

import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { readers, useToolbarValue } from '../hooks/useToolbarState'

import { ToolbarListboxDropdown, type ToolbarListboxOption } from './ToolbarListboxDropdown'

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

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const TextAlignDropdown: FC<Props> = memo((props) => {
  const { editor } = useRichTextEditorContext()
  const { localize } = useIntl()
  const currentTextAlign = useToolbarValue(editor, readers.currentTextAlign)

  const currentAlign = currentTextAlign ?? 'left'
  const currentOption = ALIGN_OPTIONS.find((o) => o.value === currentAlign) ?? ALIGN_OPTIONS[0]
  const currentLabel = localize({
    id: currentOption.labelId,
    defaultText: currentOption.defaultText,
  })

  const options = useMemo<readonly ToolbarListboxOption[]>(
    () =>
      ALIGN_OPTIONS.map((option) => ({
        key: option.value,
        label: localize({ id: option.labelId, defaultText: option.defaultText }),
        content: getAlignIcon(option.value),
        shortcut: option.shortcut,
      })),
    [localize],
  )

  const functions = useMemo(
    () => ({
      handleSelect: (index: number) => {
        const { value } = ALIGN_OPTIONS[index]

        if (value === 'left') {
          editor.chain().focus().unsetTextAlign().run()
        } else {
          editor.chain().focus().setTextAlign(value).run()
        }
      },
    }),
    [editor],
  )

  return (
    <ToolbarListboxDropdown
      {...props}
      selectedIndex={ALIGN_OPTIONS.findIndex((o) => o.value === currentAlign)}
      valueLabel={currentLabel}
      triggerContent={getAlignIcon(currentAlign)}
      appearance="icons"
      triggerClassName="smarthr-ui-RichTextEditor-TextAlignDropdown"
      handleSelect={functions.handleSelect}
      label={localize({
        id: 'smarthr-ui/RichTextEditor/textAlignDropdownLabel',
        defaultText: 'テキスト配置',
      })}
      options={options}
    />
  )
})
