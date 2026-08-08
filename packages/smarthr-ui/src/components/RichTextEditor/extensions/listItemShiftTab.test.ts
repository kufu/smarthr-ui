import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { describe, expect, it } from 'vitest'

import { patchListItemShiftTab } from './listItemShiftTab'

const createEditor = (content: string) =>
  new Editor({
    extensions: [
      StarterKit.extend({
        addExtensions() {
          return (this.parent?.() ?? []).map(patchListItemShiftTab)
        },
      }),
    ],
    content,
  })

/** 指定したテキストを持つノードの内側にカーソルを置く */
const placeCursorIn = (editor: Editor, text: string) => {
  let pos = -1

  editor.state.doc.descendants((node, nodePos) => {
    if (pos === -1 && node.isText && node.text === text) {
      pos = nodePos + 1
    }
  })

  if (pos === -1) throw new Error(`テキスト "${text}" が見つかりません`)

  editor.commands.setTextSelection(pos)
}

const countNodes = (editor: Editor, typeName: string) => {
  let count = 0

  editor.state.doc.descendants((node) => {
    if (node.type.name === typeName) count++
  })

  return count
}

describe('patchListItemShiftTab', () => {
  it('listItem 以外の拡張は同一参照のまま返す', () => {
    const editor = createEditor('<p>hello</p>')
    const paragraph = editor.extensionManager.extensions.find((e) => e.name === 'paragraph')!

    expect(patchListItemShiftTab(paragraph)).toBe(paragraph)

    editor.destroy()
  })

  it('トップレベルのリスト項目では Shift-Tab でリストが解除されない', () => {
    const editor = createEditor('<ul><li><p>A</p></li></ul>')
    placeCursorIn(editor, 'A')

    editor.commands.keyboardShortcut('Shift-Tab')

    expect(editor.isActive('bulletList')).toBe(true)
    expect(countNodes(editor, 'bulletList')).toBe(1)

    editor.destroy()
  })

  it('ネストしたリスト項目では Shift-Tab で1段解除される', () => {
    const editor = createEditor('<ul><li><p>A</p><ul><li><p>B</p></li></ul></li></ul>')
    expect(countNodes(editor, 'bulletList')).toBe(2)
    placeCursorIn(editor, 'B')

    editor.commands.keyboardShortcut('Shift-Tab')

    // B が親リストの兄弟項目に持ち上がるので、入れ子の bulletList が消える
    expect(countNodes(editor, 'bulletList')).toBe(1)
    expect(countNodes(editor, 'listItem')).toBe(2)

    editor.destroy()
  })

  it('Tab によるネストは従来どおり動く', () => {
    const editor = createEditor('<ul><li><p>A</p></li><li><p>B</p></li></ul>')
    placeCursorIn(editor, 'B')

    editor.commands.keyboardShortcut('Tab')

    expect(countNodes(editor, 'bulletList')).toBe(2)

    editor.destroy()
  })

  it('Enter によるリスト項目の分割は従来どおり動く', () => {
    const editor = createEditor('<ul><li><p>A</p></li></ul>')
    placeCursorIn(editor, 'A')

    editor.commands.keyboardShortcut('Enter')

    expect(countNodes(editor, 'listItem')).toBe(2)

    editor.destroy()
  })
})
