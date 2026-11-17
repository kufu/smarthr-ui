import { Editor, type JSONContent } from '@tiptap/core'
import { NodeSelection, TextSelection } from '@tiptap/pm/state'
import { CellSelection } from '@tiptap/pm/tables'
import { describe, expect, it, onTestFinished } from 'vitest'

import { configureExtensions } from '../configureExtensions'

import { blockRangeAt } from './blockRange'

import type { RichTextFeature } from '../../types'

const FEATURES: RichTextFeature[] = ['blockActions', 'bulletList', 'table', 'image', 'heading']

const paragraph = (text?: string): JSONContent =>
  text ? { type: 'paragraph', content: [{ type: 'text', text }] } : { type: 'paragraph' }
const heading = (text: string): JSONContent => ({
  type: 'heading',
  attrs: { level: 2 },
  content: [{ type: 'text', text }],
})
const image: JSONContent = { type: 'image', attrs: { src: '/a.png', alt: 'ロゴ' } }
const list = (items: string[]): JSONContent => ({
  type: 'bulletList',
  content: items.map((text) => ({ type: 'listItem', content: [paragraph(text)] })),
})
const cell = (text: string): JSONContent => ({ type: 'tableCell', content: [paragraph(text)] })
const table: JSONContent = {
  type: 'table',
  content: [
    { type: 'tableRow', content: [cell('x'), cell('y')] },
    { type: 'tableRow', content: [cell('z'), cell('w')] },
  ],
}

const createEditor = (content: JSONContent[], features = FEATURES) => {
  const editor = new Editor({
    extensions: configureExtensions({ features }),
    content: { type: 'doc', content },
  })

  onTestFinished(() => editor.destroy())

  return editor
}

const outline = (editor: Editor) => {
  const result: string[] = []

  editor.state.doc.forEach((node) => {
    result.push(node.textContent || node.type.name)
  })

  return result
}

const textPos = (editor: Editor, text: string, offset = 0) => {
  let found = -1

  editor.state.doc.descendants((node, pos) => {
    if (found === -1 && node.isText && node.text === text) found = pos + offset
  })

  if (found === -1) throw new Error(`${text} が見つかりません`)

  return found
}

const caret = (editor: Editor) => {
  const { $head } = editor.state.selection

  return { text: $head.parent.textContent, offset: $head.parentOffset }
}

const topLevelPos = (editor: Editor, index: number) => blockRangeAt(editor.state.doc, index).from

describe('moveBlocks', () => {
  it('キャレットのあるブロックを上へ・下へ動かし、キャレットはブロックの中の同じ位置に残る', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')])
    editor.commands.setTextSelection(textPos(editor, 'bb', 1))

    expect(editor.commands.moveBlocks({ to: 'up' })).toBe(true)
    expect(outline(editor)).toEqual(['bb', 'aa', 'cc'])
    expect(caret(editor)).toEqual({ text: 'bb', offset: 1 })

    expect(editor.commands.moveBlocks({ to: 'down' })).toBe(true)
    expect(editor.commands.moveBlocks({ to: 'down' })).toBe(true)
    expect(outline(editor)).toEqual(['aa', 'cc', 'bb'])
    expect(caret(editor)).toEqual({ text: 'bb', offset: 1 })
  })

  it('1 回の移動は 1 回の取り消しで戻り、続けて動かしても 1 回ずつ戻る', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')])
    editor.commands.setTextSelection(textPos(editor, 'cc', 2))

    editor.commands.moveBlocks({ to: 'up' })
    editor.commands.moveBlocks({ to: 'up' })
    expect(outline(editor)).toEqual(['cc', 'aa', 'bb'])

    editor.commands.undo()
    expect(outline(editor)).toEqual(['aa', 'cc', 'bb'])
    expect(caret(editor)).toEqual({ text: 'cc', offset: 2 })

    editor.commands.undo()
    expect(outline(editor)).toEqual(['aa', 'bb', 'cc'])
  })

  it('リストの中のキャレットでは、リスト全体を動かし、キャレットは同じ項目に残る', () => {
    const editor = createEditor([paragraph('aa'), list(['x1', 'x2']), paragraph('cc')])
    editor.commands.setTextSelection(textPos(editor, 'x2', 1))

    editor.commands.moveBlocks({ to: 'up' })

    expect(outline(editor)).toEqual(['x1x2', 'aa', 'cc'])
    expect(caret(editor)).toEqual({ text: 'x2', offset: 1 })
    expect(editor.state.selection).toBeInstanceOf(TextSelection)
  })

  it('表のセル選択は、表を動かしたあとも同じセルを選んだまま', () => {
    const editor = createEditor([paragraph('aa'), table])
    const cellPos = (text: string) => editor.state.doc.resolve(textPos(editor, text)).before(3)
    editor.view.dispatch(
      editor.state.tr.setSelection(
        CellSelection.create(editor.state.doc, cellPos('x'), cellPos('z')),
      ),
    )

    editor.commands.moveBlocks({ to: 'up' })

    const { selection } = editor.state
    const selected: string[] = []
    ;(selection as CellSelection).forEachCell((node) => selected.push(node.textContent))
    expect(outline(editor)).toEqual(['xyzw', 'aa', 'paragraph'])
    expect(selection).toBeInstanceOf(CellSelection)
    expect(selected).toEqual(['x', 'z'])
  })

  it('画像は選んだまま動く', () => {
    const editor = createEditor([paragraph('aa'), image, paragraph('cc')])
    editor.commands.setNodeSelection(topLevelPos(editor, 1))

    editor.commands.moveBlocks({ to: 'down' })

    expect(outline(editor)).toEqual(['aa', 'cc', 'image', 'paragraph'])
    expect(editor.state.selection).toBeInstanceOf(NodeSelection)
    expect((editor.state.selection as NodeSelection).node.type.name).toBe('image')
  })

  it('複数のブロックにまたがる選択は、またがるブロックをまとめて動かし、選択の範囲を保つ', () => {
    const editor = createEditor([
      paragraph('aa'),
      paragraph('bb'),
      paragraph('cc'),
      paragraph('dd'),
    ])
    editor.commands.setTextSelection({
      from: textPos(editor, 'bb', 1),
      to: textPos(editor, 'cc', 1),
    })

    editor.commands.moveBlocks({ to: 'down' })

    expect(outline(editor)).toEqual(['aa', 'dd', 'bb', 'cc'])
    expect(
      editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to, '|'),
    ).toBe('b|c')
  })

  it('リストや表のノード選択は、動かしたあとに中の文字の選択へ戻す', () => {
    const editor = createEditor([paragraph('aa'), list(['x1', 'x2'])])
    editor.commands.setNodeSelection(topLevelPos(editor, 1))

    editor.commands.moveBlocks({ to: 'up' })

    expect(editor.state.selection).toBeInstanceOf(TextSelection)
    expect(caret(editor).text).toBe('x1')
  })

  it('次のブロックの先頭まで選んで動かすと、選択を保ち、続けて動かしても同じブロックが動く', () => {
    const editor = createEditor([
      paragraph('aa'),
      paragraph('bb'),
      paragraph('cc'),
      paragraph('dd'),
    ])
    editor.commands.setTextSelection({ from: textPos(editor, 'bb', 1), to: textPos(editor, 'dd') })

    editor.commands.moveBlocks({ to: 'up' })
    expect(outline(editor)).toEqual(['bb', 'cc', 'aa', 'dd'])
    expect(editor.state.selection.empty).toBe(false)

    editor.commands.moveBlocks({ to: 'down' })
    expect(outline(editor)).toEqual(['aa', 'bb', 'cc', 'dd'])
  })

  it('範囲を渡すと、選択の外のブロックを動かし、キャレットは動かしたブロックの先頭に置く', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), heading('cc'), paragraph('dd')])
    editor.commands.setTextSelection(textPos(editor, 'aa', 1))

    editor.commands.moveBlocks({ range: blockRangeAt(editor.state.doc, 2), to: 0 })

    expect(outline(editor)).toEqual(['cc', 'aa', 'bb', 'dd'])
    expect(caret(editor)).toEqual({ text: 'cc', offset: 0 })
  })

  it('文書が変わって位置のずれた範囲では何もしない', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb')])
    const range = blockRangeAt(editor.state.doc, 1)
    editor.commands.insertContentAt(1, 'zz')

    expect(editor.commands.moveBlocks({ range, to: 'up' })).toBe(false)
    expect(outline(editor)).toEqual(['zzaa', 'bb'])
  })

  it('先頭では上へ、末尾では下へ動かせない', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb')])
    editor.commands.setTextSelection(textPos(editor, 'aa'))

    expect(editor.can().moveBlocks({ to: 'up' })).toBe(false)
    expect(editor.can().moveBlocks({ to: 'down' })).toBe(true)
    expect(editor.commands.moveBlocks({ to: 'up' })).toBe(false)
    expect(outline(editor)).toEqual(['aa', 'bb'])

    editor.commands.setTextSelection(textPos(editor, 'bb'))
    expect(editor.can().moveBlocks({ to: 'down' })).toBe(false)
  })

  it('表を末尾へ動かしても、末尾の空の段落より下へは行かず、空の段落が増えない', () => {
    const editor = createEditor([table, paragraph('aa'), paragraph()])
    editor.commands.setTextSelection(textPos(editor, 'x'))

    editor.commands.moveBlocks({ to: 'down' })

    expect(outline(editor)).toEqual(['aa', 'xyzw', 'paragraph'])
    expect(editor.can().moveBlocks({ to: 'down' })).toBe(false)
  })

  it('表を末尾へ動かして足された空の段落も、移動と一緒に 1 回の取り消しで戻る', () => {
    const editor = createEditor([table, paragraph('aa')])
    editor.commands.setTextSelection(textPos(editor, 'x'))

    editor.commands.moveBlocks({ to: 'down' })
    expect(outline(editor)).toEqual(['aa', 'xyzw', 'paragraph'])

    editor.commands.undo()
    expect(outline(editor)).toEqual(['xyzw', 'aa'])
  })
})

describe('duplicateBlocks', () => {
  it('すぐ下に複製し、キャレットを複製の中の同じ位置に置く。1 回の取り消しで戻る', () => {
    const editor = createEditor([paragraph('aa'), heading('bb'), paragraph('cc')])
    editor.commands.setTextSelection(textPos(editor, 'bb', 1))

    expect(editor.commands.duplicateBlocks()).toBe(true)

    expect(outline(editor)).toEqual(['aa', 'bb', 'bb', 'cc'])
    expect(editor.state.selection.$head.index(0)).toBe(2)
    expect(caret(editor)).toEqual({ text: 'bb', offset: 1 })

    editor.commands.undo()
    expect(outline(editor)).toEqual(['aa', 'bb', 'cc'])
  })

  it('画像を複製すると、複製した画像を選ぶ', () => {
    const editor = createEditor([paragraph('aa'), image])
    editor.commands.setNodeSelection(topLevelPos(editor, 1))

    editor.commands.duplicateBlocks()

    expect(outline(editor)).toEqual(['aa', 'image', 'image', 'paragraph'])
    expect(editor.state.selection).toBeInstanceOf(NodeSelection)
    expect(editor.state.selection.from).toBe(topLevelPos(editor, 2))
  })
})

describe('deleteBlocks', () => {
  it('消したブロックの次のブロックの先頭にキャレットを置く。1 回の取り消しで戻る', () => {
    const editor = createEditor([paragraph('aa'), list(['x1', 'x2']), paragraph('cc')])
    editor.commands.setTextSelection(textPos(editor, 'x2', 1))

    expect(editor.commands.deleteBlocks()).toBe(true)

    expect(outline(editor)).toEqual(['aa', 'cc'])
    expect(caret(editor)).toEqual({ text: 'cc', offset: 0 })

    editor.commands.undo()
    expect(outline(editor)).toEqual(['aa', 'x1x2', 'cc'])
  })

  it('末尾のブロックを消すと、前のブロックの末尾にキャレットを置く', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb')])
    editor.commands.setTextSelection(textPos(editor, 'bb', 1))

    editor.commands.deleteBlocks()

    expect(outline(editor)).toEqual(['aa'])
    expect(caret(editor)).toEqual({ text: 'aa', offset: 2 })
  })

  it('すべてのブロックを消すと、空の段落が 1 つ残る', () => {
    const editor = createEditor([paragraph('aa'), table])
    editor.commands.selectAll()

    editor.commands.deleteBlocks()

    expect(outline(editor)).toEqual(['paragraph'])
    expect(editor.isEmpty).toBe(true)
    expect(editor.state.selection.from).toBe(1)
  })

  it('選択の外のブロックを消しても、キャレットは元の位置に残り、キャレットへスクロールしない', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')])
    editor.commands.setTextSelection(textPos(editor, 'cc', 1))

    const scrolled: boolean[] = []
    editor.on('transaction', ({ transaction }) => scrolled.push(transaction.scrolledIntoView))

    editor.commands.deleteBlocks({ range: blockRangeAt(editor.state.doc, 0) })

    expect(outline(editor)).toEqual(['bb', 'cc'])
    expect(caret(editor)).toEqual({ text: 'cc', offset: 1 })
    expect(scrolled).toEqual([false])
  })

  it('空の段落だけの本文では、段落に寄せなどの属性があっても消せない', () => {
    const editor = createEditor([{ type: 'paragraph', attrs: { textAlign: 'center' } }])

    expect(editor.can().deleteBlocks()).toBe(false)
    expect(editor.commands.deleteBlocks()).toBe(false)
    expect(editor.can().undo()).toBe(false)
  })
})

describe('取り消しの単位', () => {
  it.each([
    {
      name: '移動',
      run: (editor: Editor) => editor.commands.moveBlocks({ to: 'up' }),
      done: ['aa', 'ccX', 'bb'],
      undone: ['aa', 'cc', 'bb'],
    },
    {
      name: '複製',
      run: (editor: Editor) => editor.commands.duplicateBlocks(),
      done: ['aa', 'bb', 'cc', 'ccX'],
      undone: ['aa', 'bb', 'cc', 'cc'],
    },
    {
      name: '削除',
      run: (editor: Editor) => editor.chain().selectAll().deleteBlocks().run(),
      done: ['X'],
      undone: ['paragraph'],
    },
  ])('$name の直後に打った文字は、$name とは別に取り消せる', async ({ run, done, undone }) => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')])
    editor.commands.setTextSelection(textPos(editor, 'cc', 2))

    run(editor)
    await Promise.resolve()
    editor.commands.insertContent('X')
    expect(outline(editor)).toEqual(done)

    editor.commands.undo()
    expect(outline(editor)).toEqual(undone)
  })
})

describe('操作できないとき', () => {
  const run = {
    moveBlocks: (editor: Editor) => editor.commands.moveBlocks({ to: 'down' }),
    duplicateBlocks: (editor: Editor) => editor.commands.duplicateBlocks(),
    deleteBlocks: (editor: Editor) => editor.commands.deleteBlocks(),
  }

  it.each(Object.entries(run))('編集できないエディタでは %s は何もしない', (_, command) => {
    const editor = createEditor([paragraph('aa'), paragraph('bb')])
    editor.commands.setTextSelection(textPos(editor, 'aa'))
    editor.setEditable(false)

    expect(command(editor)).toBe(false)
    expect(outline(editor)).toEqual(['aa', 'bb'])
  })

  it.each(Object.entries(run))(
    'features に blockActions が無ければ %s は何もしない',
    (_, command) => {
      const editor = createEditor([paragraph('aa'), paragraph('bb')], ['bulletList'])
      editor.commands.setTextSelection(textPos(editor, 'aa'))

      expect(command(editor)).toBe(false)
      expect(outline(editor)).toEqual(['aa', 'bb'])
    },
  )
})
