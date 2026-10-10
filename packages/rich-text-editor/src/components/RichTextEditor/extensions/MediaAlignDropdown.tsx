'use client'

import { useEditorState } from '@tiptap/react'
import { type FC, type KeyboardEvent, memo, useMemo } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import {
  ToolbarListboxDropdown,
  type ToolbarListboxOption,
} from '../Toolbar/ToolbarListboxDropdown'
import { ALIGN_OPTIONS, getAlignIcon } from '../Toolbar/alignOptions'

import { IMAGE_TOOLBAR_BUTTON_CLASS_NAME } from './Image/imageToolbarStyle'

import type { Editor } from '@tiptap/react'

// 両端揃えは段落用。画像・動画には意味がない
const MEDIA_ALIGN_OPTIONS = ALIGN_OPTIONS.filter((option) => option.value !== 'justify')

type Props = {
  editor: Editor
  nodeName: 'image' | 'youtube'
  pos: number
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const MediaAlignDropdown: FC<Props> = memo(({ editor, nodeName, pos, ...rest }) => {
  const { localize } = useIntl()
  const align = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      const node = e.state.doc.nodeAt(pos)

      // pos が新しい値で届く前の一瞬、同じ位置にある表のセルの align を読まないようにする
      return node?.type.name === nodeName ? (node.attrs.align ?? null) : null
    },
  })
  const currentOption =
    MEDIA_ALIGN_OPTIONS.find((option) => option.value === align) ?? MEDIA_ALIGN_OPTIONS[0]

  const options = useMemo<readonly ToolbarListboxOption[]>(
    () =>
      MEDIA_ALIGN_OPTIONS.map((option) => ({
        key: option.value,
        label: localize({ id: option.labelId, defaultText: option.defaultText }),
        content: getAlignIcon(option.value),
      })),
    [localize],
  )

  const label = localize({ id: 'smarthr-ui/RichTextEditor/mediaAlign', defaultText: '配置' })

  const latest = useLatest({ nodeName, pos })

  const functions = useMemo(
    () => ({
      handleSelect: (index: number) => {
        const { value } = MEDIA_ALIGN_OPTIONS[index]

        editor
          .chain()
          .setNodeSelection(latest.pos)
          .updateAttributes(latest.nodeName, { align: value === 'left' ? null : value })
          .run()
      },
    }),
    [editor, latest],
  )

  return (
    <ToolbarListboxDropdown
      {...rest}
      selectedIndex={MEDIA_ALIGN_OPTIONS.indexOf(currentOption)}
      valueLabel={localize({ id: currentOption.labelId, defaultText: currentOption.defaultText })}
      triggerContent={
        <>
          {getAlignIcon(currentOption.value)}
          {label}
        </>
      }
      appearance="icons"
      triggerClassName={IMAGE_TOOLBAR_BUTTON_CLASS_NAME}
      handleSelect={functions.handleSelect}
      label={label}
      options={options}
    />
  )
})
