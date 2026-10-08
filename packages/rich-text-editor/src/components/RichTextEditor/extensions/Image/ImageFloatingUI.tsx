'use client'

import { useEditorState } from '@tiptap/react'
import { type FC, type RefObject, memo, useCallback } from 'react'
import { FaTrashCanIcon } from 'smarthr-ui'

import { useIntl } from '../../../../intl'
import { tv } from '../../../../libs/tv'
import { useNodeRect } from '../../hooks/useNodeRect'
import { useRovingToolbar } from '../../hooks/useRovingToolbar'

import { ImageAltPopover } from './ImageAltPopover'
import { ImageWidthPopover } from './ImageWidthPopover'
import { IMAGE_TOOLBAR_BUTTON_CLASS_NAME } from './imageToolbarStyle'
import { resolveImageElement } from './resolveImageElement'

import type { Editor } from '@tiptap/react'

const findSelectedImagePos = (editor: Editor): number | null => {
  const { state } = editor
  const { from } = state.selection
  const node = state.doc.nodeAt(from)
  if (node && node.type.name === 'image') return from
  return null
}

const classNameGenerator = tv({
  slots: {
    bar: [
      'smarthr-ui-RichTextEditor-ImageFloatingUI',
      'shr-rte-absolute shr-rte-z-0',
      'shr-rte-inline-flex shr-rte-items-center shr-rte-gap-0.25',
      'shr-rte-border-shorthand shr-rte-rounded-m shr-rte-bg-white shr-rte-p-0.25 shr-rte-shadow-layer-2',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { bar } = classNameGenerator()

  return {
    bar: bar(),
  }
})()

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

const BAR_GAP = 6
const BAR_HEIGHT = 36

export const ImageFloatingUI: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const pos = useEditorState({
    editor,
    selector: ({ editor: e }) => (e.isActive('image') ? findSelectedImagePos(e) : null),
  })

  const info = useNodeRect(editor, containerRef, pos, resolveImageElement)

  const handleDelete = useCallback(() => {
    if (pos !== null) {
      editor.chain().setNodeSelection(pos).deleteSelection().run()
    }
  }, [editor, pos])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const { getButtonProps } = useRovingToolbar({ count: 3, onEscape: handleEscape })

  if (pos === null || !info) return null

  const idealTop = info.rect.top - BAR_HEIGHT - BAR_GAP
  const top = Math.max(idealTop, info.viewport.top)
  const left = info.rect.left

  const toolbarLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageToolbar',
    defaultText: '画像の操作',
  })
  const deleteLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageDelete',
    defaultText: '画像を削除',
  })
  const deleteShortLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageDeleteShort',
    defaultText: '削除',
  })
  return (
    <div role="toolbar" className={CLASS_NAMES.bar} style={{ top, left }} aria-label={toolbarLabel}>
      <ImageAltPopover {...getButtonProps(0)} editor={editor} pos={pos} />
      <ImageWidthPopover {...getButtonProps(1)} editor={editor} pos={pos} />
      <button
        {...getButtonProps(2)}
        type="button"
        className={IMAGE_TOOLBAR_BUTTON_CLASS_NAME}
        aria-label={deleteLabel}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleDelete}
      >
        <FaTrashCanIcon alt="" />
        {deleteShortLabel}
      </button>
    </div>
  )
})
