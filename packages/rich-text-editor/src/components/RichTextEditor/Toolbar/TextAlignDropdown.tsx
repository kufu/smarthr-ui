'use client'

import { type FC, type KeyboardEvent, memo, useMemo } from 'react'

import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { readers, useToolbarValue } from '../hooks/useToolbarState'

import { ToolbarListboxDropdown, type ToolbarListboxOption } from './ToolbarListboxDropdown'
import { ALIGN_OPTIONS, getAlignIcon } from './alignOptions'

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
