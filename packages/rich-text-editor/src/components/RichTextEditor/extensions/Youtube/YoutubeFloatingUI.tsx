'use client'

import { useEditorState } from '@tiptap/react'
import { type FC, type RefObject, memo, useCallback } from 'react'

import { useIntl } from '../../../../intl'
import { useRovingToolbar } from '../../hooks/useRovingToolbar'
import { MediaAlignDropdown } from '../MediaAlignDropdown'
import { MediaDeleteButton } from '../MediaDeleteButton'
import { MediaSizePopover, YOUTUBE_SIZE_SPEC } from '../MediaSizePopover'
import { NodeFloatingToolbar } from '../NodeFloatingToolbar'
import { findSelectedNodePos } from '../mediaNode'

import type { Editor } from '@tiptap/react'

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
    selector: ({ editor: e }) => findSelectedNodePos(e, 'youtube'),
  })

  const handleEscape = useCallback(() => {
    editor.commands.focus()
  }, [editor])

  const { getButtonProps } = useRovingToolbar({ count: 3, onEscape: handleEscape })

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
      <MediaSizePopover {...getButtonProps(1)} editor={editor} pos={pos} spec={YOUTUBE_SIZE_SPEC} />
      <MediaDeleteButton
        {...getButtonProps(2)}
        editor={editor}
        pos={pos}
        label={localize({
          id: 'smarthr-ui/RichTextEditor/youtubeDelete',
          defaultText: 'YouTube動画を削除',
        })}
      />
    </NodeFloatingToolbar>
  )
})
