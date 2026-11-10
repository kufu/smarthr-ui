import { Editor } from '@tiptap/core'
import { afterEach, expect, it } from 'vitest'

import { toEditorContent } from '../../serializers/toEditorContent'
import { ALL_FEATURES, configureExtensions } from '../configureExtensions'

let editor: Editor | undefined
afterEach(() => editor?.destroy())

const countCells = (target: Editor) => {
  let count = 0
  target.state.doc.descendants((node) => {
    if (node.type.name === 'tableCell') count += 1
  })
  return count
}

it('1行目の列数が 1000 を超える表を読み込んで中を編集しても、空のセルを足さない', () => {
  const row = {
    type: 'tableRow',
    content: [600, 600].map((colspan) => ({
      type: 'tableCell',
      attrs: { colspan },
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'セル' }] }],
    })),
  }
  editor = new Editor({
    element: document.createElement('div'),
    extensions: configureExtensions({ features: ALL_FEATURES }),
    content: toEditorContent({ type: 'doc', content: [{ type: 'table', content: [row, row] }] }),
  })

  expect(countCells(editor)).toBe(4)
  expect(editor.getHTML()).not.toContain('<col')

  let textPos = -1
  editor.state.doc.descendants((node, pos) => {
    if (textPos < 0 && node.isText) textPos = pos
  })
  editor.commands.insertContentAt(textPos, '追記')

  expect(editor.getText()).toContain('追記')
  expect(countCells(editor)).toBe(4)
})
