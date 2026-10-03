import { Editor } from '@tiptap/core'
import { columnResizingPluginKey, tableEditingKey } from '@tiptap/pm/tables'
import { afterEach, describe, expect, it } from 'vitest'

import { configureExtensions } from '../configureExtensions'
import { reconfigureEditorOperations, rememberManagedPlugins } from '../reconfigureEditorOperations'

import type { RichTextFeature } from '../../types'
import type { JSONContent } from '@tiptap/core'

const cell = (text: string): JSONContent => ({
  type: 'tableCell',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
})

// 2行目のセルが1つ足りない表。fixTables は編集されたときに空のセルで埋める
const UNEVEN_TABLE: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'table',
      content: [
        { type: 'tableRow', content: [cell('A1'), cell('B1')] },
        { type: 'tableRow', content: [cell('A2')] },
      ],
    },
  ],
}

let editor: Editor | null = null

const createEditor = (runtime: { features: RichTextFeature[] }) => {
  const element = document.createElement('div')
  document.body.appendChild(element)
  editor = new Editor({
    element,
    extensions: configureExtensions({ getRuntimeOptions: () => runtime }),
    content: UNEVEN_TABLE,
  })
  rememberManagedPlugins(editor)

  return editor
}

const typeIntoCell = (target: Editor, text: string, cellText: string) => {
  let pos = -1
  target.state.doc.descendants((node, p) => {
    if (node.isText && node.text === text) pos = p + node.nodeSize
  })
  target.chain().setTextSelection(pos).insertContent(cellText).run()
}

const rowLengths = (target: Editor) =>
  (target.getJSON() as JSONContent).content![0].content!.map((row) => row.content!.length)

afterEach(() => {
  editor?.destroy()
  editor = null
})

describe('features に table が無いときの表の編集', () => {
  it('表の構造を直す処理は残す', () => {
    const target = createEditor({ features: ['bold'] })

    typeIntoCell(target, 'A2', 'x')

    expect(tableEditingKey.getState(target.state)).not.toBeUndefined()
    expect(rowLengths(target)).toEqual([2, 2])
  })

  it('列幅の変更は外す', () => {
    const target = createEditor({ features: ['bold'] })

    expect(columnResizingPluginKey.getState(target.state)).toBeUndefined()
  })

  it('features が後から変わっても、構造を直す処理は残り列幅の変更だけが切り替わる', () => {
    const runtime: { features: RichTextFeature[] } = { features: ['table'] }
    const target = createEditor(runtime)

    expect(columnResizingPluginKey.getState(target.state)).not.toBeUndefined()

    runtime.features = ['bold']
    reconfigureEditorOperations(target)

    expect(columnResizingPluginKey.getState(target.state)).toBeUndefined()
    typeIntoCell(target, 'A2', 'x')
    expect(rowLengths(target)).toEqual([2, 2])

    runtime.features = ['table']
    reconfigureEditorOperations(target)

    expect(columnResizingPluginKey.getState(target.state)).not.toBeUndefined()
  })

  it('features に table があれば従来どおり両方を持つ', () => {
    const target = createEditor({ features: ['table'] })

    typeIntoCell(target, 'A2', 'x')

    expect(columnResizingPluginKey.getState(target.state)).not.toBeUndefined()
    expect(rowLengths(target)).toEqual([2, 2])
  })
})
