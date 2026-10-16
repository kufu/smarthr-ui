import type { Editor } from '@tiptap/react'

export type MediaNodeName = 'image' | 'youtube'

export const findSelectedNodePos = (editor: Editor, nodeName: MediaNodeName): number | null => {
  if (!editor.isActive(nodeName)) return null

  const { from } = editor.state.selection

  return editor.state.doc.nodeAt(from)?.type.name === nodeName ? from : null
}
