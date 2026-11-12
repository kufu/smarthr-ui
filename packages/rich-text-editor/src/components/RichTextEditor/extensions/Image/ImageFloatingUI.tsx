'use client'

import { useEditorState } from '@tiptap/react'
import { type FC, type RefObject, memo, useCallback } from 'react'

import { useIntl } from '../../../../intl'
import { useRovingToolbar } from '../../hooks/useRovingToolbar'
import { MediaAlignDropdown } from '../MediaAlignDropdown'
import { MediaDeleteButton } from '../MediaDeleteButton'
import { IMAGE_SIZE_SPEC, MediaSizePopover } from '../MediaSizePopover'
import { NodeFloatingToolbar } from '../NodeFloatingToolbar'
import { findSelectedNodePos } from '../mediaNode'

import { ImageAltPopover } from './ImageAltPopover'
import { resolveImageElement } from './resolveImageElement'

import type { Editor } from '@tiptap/react'

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

export const ImageFloatingUI: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const pos = useEditorState({
    editor,
    selector: ({ editor: e }) => findSelectedNodePos(e, 'image'),
  })

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
      <MediaDeleteButton {...getButtonProps(3)} editor={editor} pos={pos} label={deleteLabel} />
    </NodeFloatingToolbar>
  )
})
