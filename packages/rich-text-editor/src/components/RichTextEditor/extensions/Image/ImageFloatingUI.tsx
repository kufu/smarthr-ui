'use client'

import { useEditorState } from '@tiptap/react'
import { type FC, type RefObject, memo, useCallback } from 'react'
import { FaTrashCanIcon } from 'smarthr-ui'

import { useIntl } from '../../../../intl'
import { useRovingToolbar } from '../../hooks/useRovingToolbar'
import { MediaAlignDropdown } from '../MediaAlignDropdown'
import { IMAGE_SIZE_SPEC, MediaSizePopover } from '../MediaSizePopover'
import { NodeFloatingToolbar } from '../NodeFloatingToolbar'

import { ImageAltPopover } from './ImageAltPopover'
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

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

export const ImageFloatingUI: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const pos = useEditorState({
    editor,
    selector: ({ editor: e }) => (e.isActive('image') ? findSelectedImagePos(e) : null),
  })

  const handleDelete = useCallback(() => {
    if (pos !== null) {
      editor.chain().focus().setNodeSelection(pos).deleteSelection().run()
    }
  }, [editor, pos])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const { getButtonProps } = useRovingToolbar({ count: 4, onEscape: handleEscape })

  if (pos === null) return null

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
    <NodeFloatingToolbar
      containerRef={containerRef}
      editor={editor}
      nodeName="image"
      pos={pos}
      resolveElement={resolveImageElement}
      className="smarthr-ui-RichTextEditor-ImageFloatingUI"
      label={toolbarLabel}
    >
      <ImageAltPopover {...getButtonProps(0)} editor={editor} pos={pos} />
      <MediaSizePopover {...getButtonProps(1)} editor={editor} pos={pos} spec={IMAGE_SIZE_SPEC} />
      <MediaAlignDropdown {...getButtonProps(2)} editor={editor} nodeName="image" pos={pos} />
      <button
        {...getButtonProps(3)}
        type="button"
        className={IMAGE_TOOLBAR_BUTTON_CLASS_NAME}
        aria-label={deleteLabel}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleDelete}
      >
        <FaTrashCanIcon alt="" />
        {deleteShortLabel}
      </button>
    </NodeFloatingToolbar>
  )
})
