'use client'

import { type FC, type KeyboardEvent, memo, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { useRichTextEditorContext } from '../context/RichTextEditorContext'
import { readers, useToolbarValue } from '../hooks/useToolbarState'

import { ToolbarListboxDropdown, type ToolbarListboxOption } from './ToolbarListboxDropdown'

const ALL_OPTIONS = [
  { level: null, labelId: 'smarthr-ui/RichTextEditor/headingNormal', defaultText: '標準テキスト' },
  { level: 1, labelId: 'smarthr-ui/RichTextEditor/heading1', defaultText: '見出し1' },
  { level: 2, labelId: 'smarthr-ui/RichTextEditor/heading2', defaultText: '見出し2' },
  { level: 3, labelId: 'smarthr-ui/RichTextEditor/heading3', defaultText: '見出し3' },
  { level: 4, labelId: 'smarthr-ui/RichTextEditor/heading4', defaultText: '見出し4' },
] as const

// 選択肢を実際の見出しの見た目で見せる。値は styles.ts のエディタ本文と揃える。
// ボタン本体ではなくラベルにだけ付けるのは、ボタンの文字サイズを継承する
// チェックアイコンまで大きくならないようにするため。
const OPTION_LABEL_CLASS_NAMES = {
  normal: 'shr-text-base shr-leading-tight',
  1: 'shr-text-2xl shr-leading-tight',
  2: 'shr-text-xl shr-leading-tight',
  3: 'shr-text-lg shr-leading-tight',
  4: 'shr-text-base shr-font-bold shr-leading-tight',
} as const

type Props = {
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const HeadingDropdown: FC<Props> = memo((props) => {
  const { editor, headingLevels } = useRichTextEditorContext()
  const { localize } = useIntl()
  const currentLevel = useToolbarValue(editor, readers.currentHeadingLevel)

  const allowedOptions = useMemo(
    () => ALL_OPTIONS.filter((o) => o.level === null || headingLevels.includes(o.level)),
    [headingLevels],
  )

  const options = useMemo<readonly ToolbarListboxOption[]>(
    () =>
      allowedOptions.map((option) => {
        const label = localize({ id: option.labelId, defaultText: option.defaultText })

        return {
          key: String(option.level ?? 'normal'),
          label,
          content: (
            <span className={OPTION_LABEL_CLASS_NAMES[option.level ?? 'normal']}>{label}</span>
          ),
        }
      }),
    [allowedOptions, localize],
  )

  // 選択肢は許可レベルで絞るが、表示は許可外のレベルでも実際の見出しを出す
  const currentOption = ALL_OPTIONS.find((o) => o.level === currentLevel) ?? ALL_OPTIONS[0]
  const currentLabel = localize({
    id: currentOption.labelId,
    defaultText: currentOption.defaultText,
  })

  const latest = useLatest({ allowedOptions })

  const functions = useMemo(
    () => ({
      handleSelect: (index: number) => {
        const { level } = latest.allowedOptions[index]

        if (level === null) {
          editor.chain().focus().setParagraph().run()
        } else {
          // 選択は冪等にする。toggle だと同じレベルを選び直したときに段落へ戻ってしまう
          editor.chain().focus().setHeading({ level }).run()
        }
      },
    }),
    [editor, latest],
  )

  return (
    <ToolbarListboxDropdown
      {...props}
      selectedIndex={allowedOptions.findIndex((o) => o.level === currentLevel)}
      valueLabel={currentLabel}
      triggerContent={<span className="shr-flex-1">{currentLabel}</span>}
      appearance="heading"
      triggerClassName="smarthr-ui-RichTextEditor-HeadingDropdown shr-min-w-[9em] shr-text-left shr-text-sm"
      handleSelect={functions.handleSelect}
      label={localize({
        id: 'smarthr-ui/RichTextEditor/headingDropdownLabel',
        defaultText: '書式',
      })}
      options={options}
    />
  )
})
