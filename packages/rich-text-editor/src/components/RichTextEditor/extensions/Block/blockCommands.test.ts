import { Editor, type JSONContent } from '@tiptap/core'
import { GapCursor } from '@tiptap/pm/gapcursor'
import { AllSelection, NodeSelection, TextSelection } from '@tiptap/pm/state'
import { CellSelection } from '@tiptap/pm/tables'
import { describe, expect, it, onTestFinished, vi } from 'vitest'

import { getDetachedJSON } from '../../serializers/getDetachedJSON'
import { sanitizeRichTextJSON } from '../../serializers/sanitizeRichTextJSON'
import { toEditorContent } from '../../serializers/toEditorContent'
import { configureExtensions } from '../configureExtensions'

import { BLOCK_ANNOUNCEMENT_META } from './BlockActions'
import { type BlockRange, blockRangeAt } from './blockRange'

import type { RichTextFeature } from '../../types'
import type { BlockCatalogId } from '../blockCatalog'

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

const createEditor = (
  content: JSONContent[],
  features = FEATURES,
  allowedHeadingLevels?: ReadonlyArray<1 | 2 | 3 | 4>,
) => {
  const editor = new Editor({
    extensions: configureExtensions({ features, allowedHeadingLevels }),
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

const recordTransactions = (editor: Editor) => {
  const records: Array<{ docChanged: boolean; scrolled: boolean; meta: unknown }> = []

  editor.on('transaction', ({ transaction }) =>
    records.push({
      docChanged: transaction.docChanged,
      scrolled: transaction.scrolledIntoView,
      meta: transaction.getMeta(BLOCK_ANNOUNCEMENT_META),
    }),
  )

  return records
}

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

  it('全選択して続けて複製しても、文書の末尾の空の段落は複製せず、間に残らない', () => {
    const editor = createEditor([paragraph('aa'), heading('bb')])
    const records = recordTransactions(editor)

    editor.commands.selectAll()
    editor.commands.duplicateBlocks()
    expect(outline(editor)).toEqual(['aa', 'bb', 'aa', 'bb', 'paragraph'])

    editor.commands.selectAll()
    editor.commands.duplicateBlocks()
    expect(outline(editor)).toEqual(['aa', 'bb', 'aa', 'bb', 'aa', 'bb', 'aa', 'bb', 'paragraph'])
    expect(records.map(({ meta }) => meta).filter(Boolean)).toEqual([
      { type: 'duplicated', blockId: 'paragraph', excerpt: 'aa', count: 2 },
      { type: 'duplicated', blockId: 'paragraph', excerpt: 'aa', count: 4 },
    ])
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

  it.each([
    { name: '後ろ', selected: 0, deleted: 1, remaining: '/a.png' },
    { name: '前', selected: 1, deleted: 0, remaining: '/b.png' },
  ])(
    '選んだ画像のすぐ $name のブロックを消しても、画像を選んだままで、スクロールしない',
    ({ selected, deleted, remaining }) => {
      const imageB = { ...image, attrs: { src: '/b.png', alt: '写真' } }
      const editor = createEditor([image, imageB, paragraph('cc')])
      editor.commands.setNodeSelection(topLevelPos(editor, selected))
      const records = recordTransactions(editor)

      editor.commands.deleteBlocks({ range: blockRangeAt(editor.state.doc, deleted) })

      expect(outline(editor)).toEqual(['image', 'cc'])
      const { doc, selection } = editor.state
      expect(selection).toBeInstanceOf(NodeSelection)
      expect(doc.nodeAt(selection.from)?.attrs.src).toBe(remaining)
      expect(records.map(({ scrolled }) => scrolled)).not.toContain(true)
    },
  )

  it('ブロックの境目のギャップカーソルは、すぐ後ろのブロックを消しても残り、スクロールしない', () => {
    const editor = createEditor([table, table, table])
    const gap = editor.state.doc.resolve(topLevelPos(editor, 1))
    editor.view.dispatch(editor.state.tr.setSelection(new GapCursor(gap)))
    const records = recordTransactions(editor)

    editor.commands.deleteBlocks({ range: blockRangeAt(editor.state.doc, 1) })

    expect(outline(editor)).toEqual(['xyzw', 'xyzw', 'paragraph'])
    expect(editor.state.selection).toBeInstanceOf(GapCursor)
    expect(editor.state.selection.from).toBe(topLevelPos(editor, 1))
    expect(records.map(({ scrolled }) => scrolled)).not.toContain(true)
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

describe('convertBlocks', () => {
  const ALL: RichTextFeature[] = [
    'blockActions',
    'heading',
    'bulletList',
    'orderedList',
    'blockquote',
    'codeBlock',
    'table',
    'image',
  ]
  const CONVERSION_IDS: BlockCatalogId[] = [
    'paragraph',
    'heading1',
    'heading2',
    'heading3',
    'heading4',
    'bulletList',
    'orderedList',
    'blockquote',
    'codeBlock',
  ]
  const bullets = (...textRest: string[]) => list(textRest)
  const ordered = (...textRest: string[]) => ({ ...list(textRest), type: 'orderedList' })
  const quote = (...blockRest: JSONContent[]): JSONContent => ({
    type: 'blockquote',
    content: blockRest,
  })
  const code = (text: string): JSONContent => ({
    type: 'codeBlock',
    attrs: { language: 'js' },
    content: [{ type: 'text', text }],
  })
  const item = (...blockRest: JSONContent[]): JSONContent => ({
    type: 'listItem',
    content: blockRest,
  })

  it('範囲の中のキャレットは、変換後も同じ文字の後ろに残り、そこへスクロールする', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')], ALL)
    editor.commands.setTextSelection(textPos(editor, 'bb', 1))
    const records = recordTransactions(editor)

    expect(
      editor.commands.convertBlocks({
        range: blockRangeAt(editor.state.doc, 0, 3),
        to: 'codeBlock',
      }),
    ).toBe(true)

    expect(outline(editor)).toEqual(['aa\nbb\ncc', 'paragraph'])
    expect(editor.state.selection).toBeInstanceOf(TextSelection)
    expect(caret(editor)).toEqual({ text: 'aa\nbb\ncc', offset: 4 })
    expect(records[0].scrolled).toBe(true)
  })

  it('複数のブロックにまたがる選択は、両端が同じ文字に残る', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')], ALL)
    editor.commands.setTextSelection({
      from: textPos(editor, 'aa', 1),
      to: textPos(editor, 'cc', 1),
    })

    editor.commands.convertBlocks({ to: 'bulletList' })

    const { from, to } = editor.state.selection
    expect(outline(editor)).toEqual(['aabbcc', 'paragraph'])
    expect(editor.state.doc.textBetween(from, to, '|')).toBe('a|bb|c')
  })

  it('画像を選んでいれば、範囲を変換したあとも同じ画像を選んだまま', () => {
    const editor = createEditor([paragraph('aa'), image, paragraph('cc')], ALL)
    editor.commands.setNodeSelection(topLevelPos(editor, 1))

    editor.commands.convertBlocks({ range: blockRangeAt(editor.state.doc, 0, 3), to: 'heading1' })

    expect(outline(editor)).toEqual(['aa', 'image', 'cc', 'paragraph'])
    expect(editor.state.selection).toBeInstanceOf(NodeSelection)
    expect(editor.state.selection.from).toBe(topLevelPos(editor, 1))
  })

  it('全選択は、変換したあとも全選択のまま', () => {
    const editor = createEditor([paragraph('aa'), heading('bb')], ALL)
    editor.commands.selectAll()

    editor.commands.convertBlocks({ to: 'bulletList' })

    expect(outline(editor)).toEqual(['aabb', 'paragraph'])
    expect(editor.state.selection).toBeInstanceOf(AllSelection)
  })

  it('全選択して続けて変換しても、文書の末尾の空の段落は変換せず、ブロックが増えない', () => {
    const editor = createEditor([paragraph('aa'), heading('bb')], ALL)
    editor.commands.selectAll()
    const records = recordTransactions(editor)
    const h1 = (text: string) => ({ ...heading(text), attrs: { level: 1 } })

    editor.commands.convertBlocks({ to: 'heading1' })
    editor.commands.convertBlocks({ to: 'heading1' })

    expect(editor.state.doc.toJSON()).toEqual(
      editor.schema
        .nodeFromJSON({ type: 'doc', content: [h1('aa'), h1('bb'), paragraph()] })
        .toJSON(),
    )
    expect(records.map(({ meta }) => meta).filter(Boolean)).toEqual([
      { type: 'converted', to: 'heading1', blockId: 'paragraph', excerpt: 'aa', count: 2 },
    ])
  })

  it('全選択して段落と見出し1へ交互に変換しても、ブロックが増えない', () => {
    const editor = createEditor([paragraph('aa'), heading('bb')], ALL)
    editor.commands.selectAll()

    const steps = [
      { to: 'paragraph', type: 'paragraph' },
      { to: 'heading1', type: 'heading' },
      { to: 'paragraph', type: 'paragraph' },
      { to: 'heading1', type: 'heading' },
    ] as const

    for (const { to, type } of steps) {
      editor.commands.convertBlocks({ to })

      const { doc } = editor.state
      expect(outline(editor)).toEqual(['aa', 'bb', 'paragraph'])
      expect([doc.child(0).type.name, doc.child(1).type.name]).toEqual([type, type])
    }
  })

  it('範囲の外の選択は同じ文字に残り、スクロールしない', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')], ALL)
    editor.commands.setTextSelection(textPos(editor, 'cc', 1))
    const records = recordTransactions(editor)

    editor.commands.convertBlocks({ range: blockRangeAt(editor.state.doc, 0), to: 'heading1' })

    expect(outline(editor)).toEqual(['aa', 'bb', 'cc'])
    expect(caret(editor)).toEqual({ text: 'cc', offset: 1 })
    expect(records.map(({ scrolled }) => scrolled)).toEqual([false])
  })

  it.each([
    { name: '前', converted: 0 },
    { name: '後ろ', converted: 2 },
  ])(
    '選んだ画像のすぐ $name のブロックを変換しても、画像を選んだままで、スクロールしない',
    ({ converted }) => {
      const editor = createEditor([paragraph('aa'), image, paragraph('cc')], ALL)
      editor.commands.setNodeSelection(topLevelPos(editor, 1))
      const records = recordTransactions(editor)

      editor.commands.convertBlocks({
        range: blockRangeAt(editor.state.doc, converted),
        to: 'heading1',
      })

      expect(editor.state.doc.child(converted).type.name).toBe('heading')
      expect(editor.state.selection).toBeInstanceOf(NodeSelection)
      expect(editor.state.selection.from).toBe(topLevelPos(editor, 1))
      expect(records.map(({ scrolled }) => scrolled)).not.toContain(true)
    },
  )

  it.each([
    {
      name: '前',
      content: [bullets('xx', 'yy'), paragraph('bb'), paragraph('cc')],
      caretIn: 'yy',
      expected: ['xxyybb', 'cc'],
    },
    {
      name: '後ろ',
      content: [paragraph('aa'), paragraph('bb'), bullets('xx', 'yy')],
      caretIn: 'xx',
      expected: ['aa', 'bbxxyy', 'paragraph'],
    },
  ])(
    '$name のリストとつないでも、そのリストの中の選択は同じ文字に残る',
    ({ content, caretIn, expected }) => {
      const editor = createEditor(content, ALL)
      editor.commands.setTextSelection({
        from: textPos(editor, caretIn, 1),
        to: textPos(editor, caretIn, 2),
      })
      const records = recordTransactions(editor)

      editor.commands.convertBlocks({ range: blockRangeAt(editor.state.doc, 1), to: 'bulletList' })

      const { from, to } = editor.state.selection
      expect(outline(editor)).toEqual(expected)
      expect(editor.state.selection).toBeInstanceOf(TextSelection)
      expect(editor.state.doc.textBetween(from, to)).toBe(caretIn[1])
      expect(caret(editor)).toEqual({ text: caretIn, offset: 2 })
      expect(records.map(({ scrolled }) => scrolled)).toEqual([false])
    },
  )

  it('末尾のブロックをリストにして足された空の段落も、変換と一緒に 1 回の取り消しで戻る', () => {
    const editor = createEditor([paragraph('aa')], ALL)
    editor.commands.setTextSelection(textPos(editor, 'aa', 1))
    const original = editor.state.doc

    editor.commands.convertBlocks({ to: 'bulletList' })
    expect(outline(editor)).toEqual(['aa', 'paragraph'])

    editor.commands.undo()
    expect(editor.state.doc.eq(original)).toBe(true)
    expect(caret(editor)).toEqual({ text: 'aa', offset: 1 })
  })

  it('変換が起きたすべての組み合わせで、can と実行がそろい、1 回の取り消しで元の文書に戻る', () => {
    const cases: Array<{ content: JSONContent[]; range?: [number, number] }> = [
      { content: [paragraph('a'), paragraph('bb'), paragraph('c')] },
      { content: [paragraph('a'), heading('bb')] },
      { content: [bullets('a', 'bb')] },
      { content: [{ ...ordered('a', 'b'), attrs: { start: 3 } }] },
      { content: [list(['a']), paragraph('z')], range: [0, 1] },
      {
        content: [
          {
            type: 'bulletList',
            content: [item(paragraph('a'), bullets('a1')), item(paragraph('bb'))],
          },
        ],
      },
      {
        content: [
          { type: 'bulletList', content: [item(paragraph('a'), image), item(paragraph('b'))] },
        ],
      },
      { content: [quote(heading('a'), bullets('b', 'c'))] },
      { content: [code('x\nyy')] },
      { content: [paragraph('a'), image, paragraph('bb')] },
      { content: [image] },
      { content: [table] },
      { content: [bullets('a'), paragraph('b'), bullets('c')], range: [1, 2] },
      { content: [bullets('a'), bullets('b')] },
      { content: [paragraph('a'), table] },
    ]
    const tally = { can: 0, converted: 0, undone: 0 }

    for (const { content, range } of cases) {
      for (const to of CONVERSION_IDS) {
        const editor = createEditor(content, ALL)
        // 作った直後の文書と比べないのは、末尾が段落でないと最初の transaction で空の段落が足されるため
        editor.view.dispatch(editor.state.tr.setSelection(TextSelection.atStart(editor.state.doc)))
        const original = editor.state.doc
        const target = blockRangeAt(original, ...(range ?? [0, content.length]))

        const can = editor.can().convertBlocks({ range: target, to })

        expect(editor.commands.convertBlocks({ range: target, to })).toBe(can)

        if (can) tally.can++
        if (editor.state.doc.eq(original)) continue

        tally.converted++
        expect(() => editor.state.doc.check()).not.toThrow()

        editor.commands.undo()

        if (editor.state.doc.eq(original)) tally.undone++
      }
    }

    const docsWithCurrent = 11
    const docsWithoutCurrent = 2
    const converted =
      (CONVERSION_IDS.length - 1) * docsWithCurrent + CONVERSION_IDS.length * docsWithoutCurrent

    expect(tally).toEqual({ can: converted + docsWithCurrent, converted, undone: converted })
  })

  it('変換したあとの JSON は、sanitize を通しても、保存して読み込み直しても変わらない', () => {
    const warn = vi.spyOn(console, 'warn')
    onTestFinished(() => warn.mockRestore())
    const styled: JSONContent[] = [
      {
        type: 'heading',
        attrs: { level: 2, textAlign: 'center' },
        content: [
          {
            type: 'text',
            text: 'aa',
            marks: [
              { type: 'bold' },
              { type: 'textStyle', attrs: { color: '#ff0000', fontSize: '1.25rem' } },
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: { textAlign: 'right', lineHeight: '1.8' },
        content: [
          {
            type: 'text',
            text: 'bb',
            marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
          },
          { type: 'hardBreak' },
          { type: 'text', text: 'cc' },
        ],
      },
      { type: 'bulletList', content: [item(paragraph('dd'), bullets('d1'))] },
      { ...ordered('ee'), attrs: { start: 3 } },
      quote(heading('ff'), bullets('gg')),
      code('x\nyy'),
      image,
      table,
    ]
    let checked = 0

    for (let endIndex = 1; endIndex <= styled.length; endIndex++) {
      for (const to of CONVERSION_IDS) {
        const editor = createEditor(styled, ALL)

        expect(
          editor.commands.convertBlocks({ range: blockRangeAt(editor.state.doc, 0, endIndex), to }),
        ).toBe(true)

        const json = getDetachedJSON(editor)
        const reloaded = createEditor(toEditorContent(json).content ?? [], ALL)

        expect(sanitizeRichTextJSON(json)).toEqual(json)
        expect(getDetachedJSON(reloaded)).toEqual(json)
        checked++
      }
    }

    expect(checked).toBe(styled.length * CONVERSION_IDS.length)
    expect(warn).not.toHaveBeenCalled()
  })

  it('続けて打った文字は、変換とは別に取り消せる', async () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb'), paragraph('cc')], ALL)
    editor.commands.setTextSelection(textPos(editor, 'bb', 2))

    editor.commands.convertBlocks({ to: 'heading2' })
    await Promise.resolve()
    editor.commands.insertContent('X')
    expect(outline(editor)).toEqual(['aa', 'bbX', 'cc'])

    editor.commands.undo()
    expect(outline(editor)).toEqual(['aa', 'bb', 'cc'])
    expect(editor.state.doc.child(1).type.name).toBe('heading')

    editor.commands.undo()
    expect(editor.state.doc.child(1).type.name).toBe('paragraph')
  })

  it('すでにその種類なら true を返し、文書を変えず、読み上げの知らせも付けない', () => {
    const editor = createEditor([heading('aa'), paragraph('bb')], ALL)
    editor.commands.setTextSelection(textPos(editor, 'aa', 1))
    const original = editor.state.doc
    const records = recordTransactions(editor)

    expect(editor.can().convertBlocks({ to: 'heading2' })).toBe(true)
    expect(editor.commands.convertBlocks({ to: 'heading2' })).toBe(true)

    expect(editor.state.doc.eq(original)).toBe(true)
    expect(records.some(({ docChanged, meta }) => docChanged || meta !== undefined)).toBe(false)
    expect(editor.can().undo()).toBe(false)
  })

  it.each([
    {
      name: '1 つのブロック',
      endIndex: 1,
      expected: { blockId: 'heading2', excerpt: 'はじめに', count: 1 },
    },
    {
      name: '2 つのブロック',
      endIndex: 2,
      expected: { blockId: 'heading2', excerpt: 'はじめに', count: 2 },
    },
  ])('$name を変換すると、変換前の範囲を主語にして変換先を知らせる', ({ endIndex, expected }) => {
    const editor = createEditor([heading('はじめに'), paragraph('bb'), paragraph('cc')], ALL)
    const records = recordTransactions(editor)

    editor.commands.convertBlocks({
      range: blockRangeAt(editor.state.doc, 0, endIndex),
      to: 'paragraph',
    })

    expect(records.map(({ meta }) => meta).filter(Boolean)).toEqual([
      { ...expected, type: 'converted', to: 'paragraph' },
    ])
  })
})

describe('convertBlocks を使えないとき', () => {
  const ALL: RichTextFeature[] = ['blockActions', 'heading', 'bulletList', 'codeBlock', 'image']

  const expectRefused = (editor: Editor, options: { range?: BlockRange; to: BlockCatalogId }) => {
    const original = editor.state.doc

    expect(editor.can().convertBlocks(options)).toBe(false)
    expect(editor.commands.convertBlocks(options)).toBe(false)
    expect(editor.state.doc.eq(original)).toBe(true)
  }

  it('編集できないエディタ', () => {
    const editor = createEditor([paragraph('aa')], ALL)
    editor.setEditable(false)

    expectRefused(editor, { to: 'heading1' })
  })

  it('features に blockActions が無い', () => {
    expectRefused(createEditor([paragraph('aa')], ['heading', 'bulletList']), { to: 'heading1' })
  })

  it('features に変換先の種類が無い', () => {
    expectRefused(createEditor([paragraph('aa')], ['blockActions', 'heading']), {
      to: 'bulletList',
    })
  })

  it('見出しレベルが許されていない。許されたレベルには変換できる', () => {
    const editor = createEditor([paragraph('aa')], ALL, [2])

    expectRefused(editor, { to: 'heading1' })
    expect(editor.commands.convertBlocks({ to: 'heading2' })).toBe(true)
    expect(editor.state.doc.firstChild?.attrs.level).toBe(2)
  })

  it('文書が変わって位置のずれた範囲', () => {
    const editor = createEditor([paragraph('aa'), paragraph('bb')], ALL)
    const range = blockRangeAt(editor.state.doc, 1)
    editor.commands.insertContentAt(1, 'zz')

    expectRefused(editor, { range, to: 'heading1' })
  })

  it.each(['table', 'image', 'horizontalRule', 'youtube', 'video'] as const)(
    '変換先にならない種類 %s',
    (to) => {
      expectRefused(createEditor([paragraph('aa')], [...ALL, 'table', 'horizontalRule']), { to })
    },
  )

  it('画像だけの範囲', () => {
    const editor = createEditor([paragraph('aa'), image, paragraph('cc')], ALL)

    expectRefused(editor, { range: blockRangeAt(editor.state.doc, 1), to: 'paragraph' })
  })
})
