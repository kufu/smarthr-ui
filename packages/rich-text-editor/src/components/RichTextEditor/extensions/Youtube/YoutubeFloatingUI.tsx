'use client'

import { useEditorState } from '@tiptap/react'
import { type FC, type RefObject, memo, useCallback } from 'react'
import { FaTrashCanIcon } from 'smarthr-ui'

import { useIntl } from '../../../../intl'
import { useRovingToolbar } from '../../hooks/useRovingToolbar'
import { IMAGE_TOOLBAR_BUTTON_CLASS_NAME } from '../Image/imageToolbarStyle'
import { MediaAlignDropdown } from '../MediaAlignDropdown'
import { NodeFloatingToolbar } from '../NodeFloatingToolbar'

import type { Editor } from '@tiptap/react'

const findSelectedYoutubePos = (editor: Editor): number | null => {
  const { from } = editor.state.selection
  const node = editor.state.doc.nodeAt(from)

  return node && node.type.name === 'youtube' ? from : null
}

const resolveYoutubeElement = (dom: Node | null): HTMLElement | null =>
  dom instanceof HTMLElement ? dom : null

type Props = {
  editor: Editor
  containerRef: RefObject<HTMLElement | null>
}

export const YoutubeFloatingUI: FC<Props> = memo(({ editor, containerRef }) => {
  const { localize } = useIntl()
  const pos = useEditorState({
    editor,
    selector: ({ editor: e }) => (e.isActive('youtube') ? findSelectedYoutubePos(e) : null),
  })

  const handleDelete = useCallback(() => {
    if (pos !== null) {
      editor.chain().focus().setNodeSelection(pos).deleteSelection().run()
    }
  }, [editor, pos])

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const { getButtonProps } = useRovingToolbar({ count: 2, onEscape: handleEscape })

  if (pos === null) return null

  return (
    <NodeFloatingToolbar
      containerRef={containerRef}
      editor={editor}
      nodeName="youtube"
      pos={pos}
      resolveElement={resolveYoutubeElement}
      className="smarthr-ui-RichTextEditor-YoutubeFloatingUI"
      label={localize({
        id: 'smarthr-ui/RichTextEditor/youtubeToolbar',
        defaultText: 'YouTube動画の操作',
      })}
    >
      <MediaAlignDropdown {...getButtonProps(0)} editor={editor} nodeName="youtube" pos={pos} />
      <button
        {...getButtonProps(1)}
        type="button"
        className={IMAGE_TOOLBAR_BUTTON_CLASS_NAME}
        aria-label={localize({
          id: 'smarthr-ui/RichTextEditor/youtubeDelete',
          defaultText: 'YouTube動画を削除',
        })}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleDelete}
      >
        <FaTrashCanIcon alt="" />
        {localize({ id: 'smarthr-ui/RichTextEditor/imageDeleteShort', defaultText: '削除' })}
      </button>
    </NodeFloatingToolbar>
  )
})
