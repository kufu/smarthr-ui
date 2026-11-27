import { Editor, type JSONContent } from '@tiptap/core'
import { CellSelection } from '@tiptap/pm/tables'
import { describe, expect, it, onTestFinished } from 'vitest'

import { configureExtensions } from '../configureExtensions'
import { reconfigureEditorOperations, rememberManagedPlugins } from '../reconfigureEditorOperations'

import { readBlockBackgroundTarget } from './BlockBackground'

import type { RichTextFeature } from '../../types'
import type { RichTextRuntimeOptions } from '../runtimeOptions'
import type { Node as PMNode } from '@tiptap/pm/model'

const GREEN = '#67b27f'
const BLUE = '#0077c7'

const FEATURES: RichTextFeature[] = [
  'backgroundColor',
  'blockBackgroundColor',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'table',
]

const band = (color?: string) => (color ? { attrs: { blockBackgroundColor: color } } : {})
const p = (text?: string, color?: string): JSONContent => ({
  ...band(color),
  ...(text ? { content: [{ type: 'text', text }] } : {}),
  type: 'paragraph',
})
const h = (text: string, color?: string): JSONContent => ({
  type: 'heading',
  attrs: { ...band(color).attrs, level: 2 },
  content: [{ type: 'text', text }],
})
const list =
  (type: 'bulletList' | 'orderedList') =>
  (items: Array<string | JSONContent>, color?: string): JSONContent => ({
    ...band(color),
    type,
    content: items.map((item) => ({
      type: 'listItem',
      content: [typeof item === 'string' ? p(item) : item],
    })),
  })
const ul = list('bulletList')
const ol = list('orderedList')
const blockquote = (...blockRest: JSONContent[]): JSONContent => ({
  type: 'blockquote',
  content: blockRest,
})
const table = (cells: string[]): JSONContent => ({
  type: 'table',
  content: [
    {
      type: 'tableRow',
      content: cells.map((text) => ({ type: 'tableCell', content: [p(text)] })),
    },
  ],
})
const codeBlock = (text: string): JSONContent => ({
  type: 'codeBlock',
  content: [{ type: 'text', text }],
})
const bandedListWith = (child: JSONContent): JSONContent => ({
  type: 'bulletList',
  attrs: { blockBackgroundColor: BLUE },
  content: [{ type: 'listItem', content: [p('項目'), child] }],
})

const createEditor = (content: JSONContent[], features = FEATURES) => {
  const element = document.createElement('div')
  document.body.appendChild(element)

  const editor = new Editor({
    element,
    extensions: configureExtensions({ features }),
    content: { type: 'doc', content },
  })

  onTestFinished(() => {
    editor.destroy()
    element.remove()
  })

  return editor
}

const isList = (node: PMNode) => ['bulletList', 'orderedList'].includes(node.type.name)

// 帯の無い末尾の空の段落を比べないのは、最後のブロックが段落以外だとエディタが足すため
const outline = (editor: Editor) => {
  const nodes = [...editor.state.doc.children]
  const last = nodes.at(-1)

  if (
    last?.type.name === 'paragraph' &&
    last.content.size === 0 &&
    !last.attrs.blockBackgroundColor
  ) {
    nodes.pop()
  }

  return nodes.map((node) => {
    const text = isList(node)
      ? node.children.map((item) => item.textContent).join('|')
      : node.textContent
    const nested: string[] = []

    node.descendants((child) => {
      if (child.attrs.blockBackgroundColor) nested.push(child.attrs.blockBackgroundColor)
    })

    return [
      `${node.type.name}(${text})`,
      node.attrs.blockBackgroundColor,
      nested.length > 0 ? `入れ子:${nested.join(',')}` : null,
    ]
      .filter(Boolean)
      .join(' ')
  })
}

const textPos = (editor: Editor, text: string) => {
  let found = -1

  editor.state.doc.descendants((node, pos) => {
    if (found === -1 && node.isText && node.text === text) found = pos
  })

  if (found === -1) throw new Error(`${text} が見つかりません`)

  return found
}

const caretIn = (editor: Editor, text: string, offset = text.length) => {
  editor.commands.setTextSelection(textPos(editor, text) + offset)
}

const caretInBlock = (editor: Editor, index: number) => {
  let pos = 0

  for (let i = 0; i < index; i++) pos += editor.state.doc.child(i).nodeSize

  editor.commands.setTextSelection(pos + 1)
}

const selectTexts = (editor: Editor, from: string, to: string) => {
  editor.commands.setTextSelection({
    from: textPos(editor, from),
    to: textPos(editor, to) + to.length,
  })
}

/** insertContent で入れないのは、入力ルールが handleTextInput 経由でしか発火しないため */
const typeText = (editor: Editor, text: string) => {
  const { from, to } = editor.state.selection

  return editor.view.someProp('handleTextInput', (handler) =>
    handler(editor.view, from, to, text, () => editor.state.tr.insertText(text, from, to)),
  )
}

const pasteHTML = (editor: Editor, html: string) => {
  // jsdom には ClipboardEvent が無い
  editor.view.pasteHTML(html, new Event('paste') as ClipboardEvent)
}

const countUpdates = (editor: Editor) => {
  const counter = { updates: 0 }

  editor.on('update', () => {
    counter.updates++
  })

  return counter
}

describe('setBlockBackgroundColor', () => {
  it('キャレットの段落・見出しに付け、null で外す', () => {
    const editor = createEditor([h('見出し'), p('本文')])

    caretIn(editor, '見出し')
    expect(editor.commands.setBlockBackgroundColor(GREEN)).toBe(true)
    caretIn(editor, '本文')
    expect(editor.commands.setBlockBackgroundColor(BLUE)).toBe(true)
    expect(outline(editor)).toEqual([`heading(見出し) ${GREEN}`, `paragraph(本文) ${BLUE}`])

    caretIn(editor, '見出し')
    editor.commands.setBlockBackgroundColor(null)
    expect(outline(editor)).toEqual(['heading(見出し)', `paragraph(本文) ${BLUE}`])
  })

  it('リストの中のキャレットではリスト全体に付き、項目の段落と入れ子のリストには付かない', () => {
    const editor = createEditor([
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [p('親'), ul(['子'])] },
          { type: 'listItem', content: [p('項目')] },
        ],
      },
      p('後'),
    ])

    caretIn(editor, '子')
    editor.commands.setBlockBackgroundColor(GREEN)

    expect(outline(editor)).toEqual([`bulletList(親子|項目) ${GREEN}`, 'paragraph(後)'])
  })

  it.each([
    ['表のセル', [table(['セル']), p('後')], 'セル'],
    ['帯のあるリストの項目の中の表のセル', [bandedListWith(table(['セル'])), p('後')], 'セル'],
    ['引用', [blockquote(p('引用')), p('後')], '引用'],
    ['帯のあるリストの項目の中の引用', [bandedListWith(blockquote(p('引用'))), p('後')], '引用'],
    ['コードブロック', [codeBlock('コード'), p('後')], 'コード'],
    [
      '帯のあるリストの項目の中のコードブロック',
      [bandedListWith(codeBlock('コード')), p('後')],
      'コード',
    ],
  ])('%s の中では false を返し、文書を変えない', (_, content, text) => {
    const editor = createEditor(content as JSONContent[])
    caretIn(editor, text)
    const before = editor.getJSON()

    expect(editor.commands.setBlockBackgroundColor(GREEN)).toBe(false)
    expect(editor.getJSON()).toEqual(before)
  })

  it.each<[string, (editor: Editor) => void]>([
    ['1 つのセルの中の範囲', (editor) => selectTexts(editor, 'セル1', 'セル1')],
    [
      '2 つのセルの選択',
      (editor) => {
        const cellPos = (text: string) => textPos(editor, text) - 2

        editor.view.dispatch(
          editor.state.tr.setSelection(
            CellSelection.create(editor.state.doc, cellPos('セル1'), cellPos('セル2')),
          ),
        )
      },
    ],
  ])('帯のあるリストの項目の中の表で、%s では false を返す', (_, select) => {
    const editor = createEditor([bandedListWith(table(['セル1', 'セル2'])), p('後')])
    select(editor)

    expect(readBlockBackgroundTarget(editor.state).available).toBe(false)
    expect(editor.commands.setBlockBackgroundColor(GREEN)).toBe(false)
  })

  it('帯のあるリストの入れ子の項目の段落では、リスト全体の帯が変わる', () => {
    const editor = createEditor([bandedListWith(ul(['子'])), p('後')])
    caretIn(editor, '子')

    expect(readBlockBackgroundTarget(editor.state)).toEqual({ available: true, color: BLUE })
    editor.commands.setBlockBackgroundColor(GREEN)

    expect(outline(editor)).toEqual([`bulletList(項目子) ${GREEN}`, 'paragraph(後)'])
  })

  it.each<[string, (editor: Editor) => void, Array<string | null>]>([
    [
      '段落の途中から最上位の表のセルの中まで',
      (editor) =>
        editor.commands.setTextSelection({
          from: textPos(editor, '前の段落') + 2,
          to: textPos(editor, 'セル') + 1,
        }),
      [GREEN, null, null],
    ],
    [
      '最上位の表のセルの中から段落の途中まで',
      (editor) =>
        editor.commands.setTextSelection({
          from: textPos(editor, 'セル') + 1,
          to: textPos(editor, '後の段落') + 2,
        }),
      [null, null, GREEN],
    ],
  ])('%s選ぶと、段落に付き、表には付かない', (_, select, expected) => {
    const editor = createEditor([p('前の段落'), table(['セル']), p('後の段落')])
    select(editor)

    expect(editor.commands.setBlockBackgroundColor(GREEN)).toBe(true)
    expect(
      editor.state.doc.children.map((node) => node.attrs.blockBackgroundColor ?? null),
    ).toEqual(expected)
  })

  it('行を選んだときのように段落の先頭から次のブロックの先頭まで選ぶと、次がコードブロックで始まる引用でも段落に付く', () => {
    const editor = createEditor([p('本文'), blockquote(codeBlock('コード')), p('後')])
    editor.commands.setTextSelection({
      from: textPos(editor, '本文'),
      to: textPos(editor, 'コード'),
    })

    editor.commands.setBlockBackgroundColor(GREEN)

    expect(outline(editor)).toEqual([
      `paragraph(本文) ${GREEN}`,
      'blockquote(コード)',
      'paragraph(後)',
    ])
  })

  it('全選択では、末尾に足された空の段落を除く段落・見出し・リストに付け、表には付けない', () => {
    const editor = createEditor([h('見出し'), table(['セル']), ul(['項目']), p()])

    editor.commands.selectAll()
    editor.commands.setBlockBackgroundColor(GREEN)

    expect(
      editor.state.doc.children.map((node) => node.attrs.blockBackgroundColor ?? null),
    ).toEqual([GREEN, null, GREEN, null])
  })

  it('全選択で null を当てると、末尾の帯のある空の段落からも帯が外れる', () => {
    const editor = createEditor([p('本文', GREEN), p(undefined, BLUE)])

    editor.commands.selectAll()
    editor.commands.setBlockBackgroundColor(null)

    expect(
      editor.state.doc.children.map((node) => node.attrs.blockBackgroundColor ?? null),
    ).toEqual([null, null])
  })

  it('検証を通らない色では false を返す', () => {
    const editor = createEditor([p('本文')])
    caretIn(editor, '本文')

    expect(editor.commands.setBlockBackgroundColor('red;position:fixed')).toBe(false)
    expect(outline(editor)).toEqual(['paragraph(本文)'])
  })

  it('すでに同じ色のブロックだけなら、文書を変えない', () => {
    const editor = createEditor([p('本文', GREEN)])
    caretIn(editor, '本文')
    const counter = countUpdates(editor)

    expect(editor.commands.setBlockBackgroundColor(GREEN)).toBe(true)
    expect(counter.updates).toBe(0)
  })

  it('features に blockBackgroundColor が無いとき・編集できないときは false を返す', () => {
    const withoutFeature = createEditor([p('本文')], ['backgroundColor'])
    caretIn(withoutFeature, '本文')
    expect(withoutFeature.commands.setBlockBackgroundColor(GREEN)).toBe(false)

    const readOnly = createEditor([p('本文')])
    caretIn(readOnly, '本文')
    readOnly.setEditable(false)
    expect(readOnly.commands.setBlockBackgroundColor(GREEN)).toBe(false)
    expect(outline(readOnly)).toEqual(['paragraph(本文)'])
  })
})

describe('readBlockBackgroundTarget', () => {
  it('全選択では、末尾の帯のある空の段落も帯を付けられる先に数え、その色を読む', () => {
    const editor = createEditor([table(['セル']), p(undefined, GREEN)])

    editor.commands.selectAll()

    expect(readBlockBackgroundTarget(editor.state)).toEqual({ available: true, color: GREEN })
  })
})

describe('キー操作', () => {
  it('帯のある段落の末尾で Enter すると、新しい段落は帯を持たない', () => {
    const editor = createEditor([p('本文', GREEN), p('後')])
    caretIn(editor, '本文')

    editor.commands.keyboardShortcut('Enter')

    expect(outline(editor)).toEqual([`paragraph(本文) ${GREEN}`, 'paragraph()', 'paragraph(後)'])
  })

  it('Backspace でブロックがつながると、前のブロックの帯になる', () => {
    const editor = createEditor([p('前', GREEN), p('後', BLUE)])
    caretIn(editor, '後', 0)

    editor.commands.keyboardShortcut('Backspace')

    expect(outline(editor)).toEqual([`paragraph(前後) ${GREEN}`])
  })

  it('帯のある段落の途中で Enter すると、分かれた両方が帯を持つ', () => {
    const editor = createEditor([p('前半後半', GREEN)])
    caretIn(editor, '前半後半', 2)

    editor.commands.keyboardShortcut('Enter')

    expect(outline(editor)).toEqual([`paragraph(前半) ${GREEN}`, `paragraph(後半) ${GREEN}`])
  })

  it('帯のある見出しの末尾で Enter すると、帯の無い段落になる', () => {
    const editor = createEditor([h('見出し', GREEN), p('後')])
    caretIn(editor, '見出し')

    editor.commands.keyboardShortcut('Enter')

    expect(outline(editor)).toEqual([`heading(見出し) ${GREEN}`, 'paragraph()', 'paragraph(後)'])
  })

  it('帯のあるリストの項目で Enter すると、新しい項目は同じリストに入り、空の項目で Enter するとリストを抜けた段落は帯を持たない', () => {
    const editor = createEditor([ul(['項目'], GREEN), p('後')])
    caretIn(editor, '項目')

    editor.commands.keyboardShortcut('Enter')
    expect(outline(editor)).toEqual([`bulletList(項目|) ${GREEN}`, 'paragraph(後)'])

    editor.commands.keyboardShortcut('Enter')
    expect(outline(editor)).toEqual([`bulletList(項目) ${GREEN}`, 'paragraph()', 'paragraph(後)'])
  })

  it('帯のあるリストの先頭の項目の先頭で Backspace すると、抜けた段落は帯を持たない', () => {
    const editor = createEditor([p('前'), ul(['項目1', '項目2'], GREEN)])
    caretIn(editor, '項目1', 0)

    editor.commands.keyboardShortcut('Backspace')

    expect(outline(editor)).toEqual([
      'paragraph(前)',
      'paragraph(項目1)',
      `bulletList(項目2) ${GREEN}`,
    ])
  })

  it('帯のあるリストの項目で Tab すると、入れ子のリストは帯を持たない', () => {
    const editor = createEditor([ul(['項目1', '項目2'], GREEN), p('後')])
    caretIn(editor, '項目2')

    editor.commands.keyboardShortcut('Tab')

    expect(outline(editor)).toEqual([`bulletList(項目1項目2) ${GREEN}`, 'paragraph(後)'])
  })
})

describe('リストの切り替えと帯', () => {
  type Case = [
    string,
    JSONContent[],
    (editor: Editor) => void,
    'toggleBulletList' | 'toggleOrderedList',
    string[],
  ]

  it.each<Case>([
    [
      '帯のある段落を箇条書きにすると、帯ごとリストになる',
      [p('本文', GREEN)],
      (editor) => caretIn(editor, '本文'),
      'toggleBulletList',
      [`bulletList(本文) ${GREEN}`],
    ],
    [
      '帯のある見出しを箇条書きにすると、帯ごとリストになる',
      [h('見出し', GREEN)],
      (editor) => caretIn(editor, '見出し'),
      'toggleBulletList',
      [`bulletList(見出し) ${GREEN}`],
    ],
    [
      '帯のある箇条書きを番号付きにすると、帯を保つ',
      [ul(['項目1', '項目2'], GREEN)],
      (editor) => caretIn(editor, '項目1'),
      'toggleOrderedList',
      [`orderedList(項目1|項目2) ${GREEN}`],
    ],
    [
      '帯のあるリストの真ん中の項目で解除すると、前後のリストは帯のまま、抜けた段落も同じ帯になる',
      [ul(['項目1', '項目2', '項目3'], GREEN)],
      (editor) => caretIn(editor, '項目2'),
      'toggleBulletList',
      [`bulletList(項目1) ${GREEN}`, `paragraph(項目2) ${GREEN}`, `bulletList(項目3) ${GREEN}`],
    ],
    [
      '帯のあるリスト全体を選んで解除すると、すべての段落が同じ帯になる',
      [ul(['項目1', '項目2'], GREEN), p('後')],
      (editor) => selectTexts(editor, '項目1', '項目2'),
      'toggleBulletList',
      [`paragraph(項目1) ${GREEN}`, `paragraph(項目2) ${GREEN}`, 'paragraph(後)'],
    ],
    [
      '帯の無い箇条書きの直後の帯のある段落をつなげても、前のリストに帯が広がらない',
      [ul(['項目']), p('本文', GREEN)],
      (editor) => caretIn(editor, '本文'),
      'toggleBulletList',
      ['bulletList(項目|本文)'],
    ],
    [
      '帯の無い箇条書きの直前の帯のある段落をつなげても、後ろのリストに帯が広がらない',
      [p('本文', GREEN), ul(['項目'])],
      (editor) => caretIn(editor, '本文'),
      'toggleBulletList',
      ['bulletList(本文|項目)'],
    ],
    [
      '帯のある箇条書きの直後の帯の無い段落をつなげると、リストの帯のまま',
      [ul(['項目'], GREEN), p('本文')],
      (editor) => caretIn(editor, '本文'),
      'toggleBulletList',
      [`bulletList(項目|本文) ${GREEN}`],
    ],
    [
      '帯の無い段落の直後の帯のある箇条書きへ前からつなげても、リストの帯のまま',
      [p('本文'), ul(['項目'], GREEN)],
      (editor) => caretIn(editor, '本文'),
      'toggleBulletList',
      [`bulletList(本文|項目) ${GREEN}`],
    ],
    [
      '帯の違う 2 つの段落をまとめてリストにすると、先頭の段落の帯になる',
      [p('本文1', GREEN), p('本文2', BLUE), p('後')],
      (editor) => selectTexts(editor, '本文1', '本文2'),
      'toggleBulletList',
      [`bulletList(本文1|本文2) ${GREEN}`, 'paragraph(後)'],
    ],
  ])('%s', (_, content, select, command, expected) => {
    const editor = createEditor(content)
    select(editor)

    editor.commands[command]()

    expect(outline(editor)).toEqual(expected)
  })

  it('帯の無い文書では、リストの切り替えの結果とステップ数が Tiptap の toggleList と同じ', () => {
    const content = [ul(['項目1']), p('本文1'), p('本文2'), ol(['項目2'])]
    const run = (toggle: (editor: Editor) => void) => {
      const editor = createEditor(content)
      const steps: number[] = []
      editor.on('transaction', ({ transaction }) => {
        if (transaction.docChanged) steps.push(transaction.steps.length)
      })
      selectTexts(editor, '本文1', '本文2')

      toggle(editor)

      return { json: editor.getJSON(), steps }
    }

    expect(run((editor) => editor.commands.toggleBulletList())).toEqual(
      run((editor) => editor.commands.toggleList('bulletList', 'listItem')),
    )
    expect(run((editor) => editor.commands.toggleOrderedList())).toEqual(
      run((editor) => editor.commands.toggleList('orderedList', 'listItem')),
    )
  })

  it('帯のある段落を見出しにして段落へ戻しても、帯を保つ', () => {
    const editor = createEditor([p('本文', GREEN), p('後')])
    caretIn(editor, '本文')

    editor.commands.setHeading({ level: 2 })
    expect(outline(editor)).toEqual([`heading(本文) ${GREEN}`, 'paragraph(後)'])

    editor.commands.toggleHeading({ level: 2 })
    expect(outline(editor)).toEqual([`paragraph(本文) ${GREEN}`, 'paragraph(後)'])
  })

  it('帯のある段落を複数選んで見出しにすると、それぞれが元の段落の帯を持つ', () => {
    const editor = createEditor([p('本文1', GREEN), p('本文2', BLUE), p('後')])
    selectTexts(editor, '本文1', '本文2')

    editor.commands.setHeading({ level: 2 })

    expect(outline(editor)).toEqual([
      `heading(本文1) ${GREEN}`,
      `heading(本文2) ${BLUE}`,
      'paragraph(後)',
    ])
  })

  describe('帯の違う 2 つの段落を、1 つ目の先頭から 2 つ目の先頭まで選んで', () => {
    const selectToSecondStart = (editor: Editor) =>
      editor.commands.setTextSelection({
        from: textPos(editor, '本文1'),
        to: textPos(editor, '本文2'),
      })

    it('見出しにすると、それぞれが元の段落の帯を持つ', () => {
      const editor = createEditor([p('本文1', GREEN), p('本文2', BLUE), p('後')])
      selectToSecondStart(editor)

      editor.commands.setHeading({ level: 2 })

      expect(outline(editor)).toEqual([
        `heading(本文1) ${GREEN}`,
        `heading(本文2) ${BLUE}`,
        'paragraph(後)',
      ])
    })

    it('箇条書きにすると、先頭の段落の帯になる', () => {
      const editor = createEditor([p('本文1', GREEN), p('本文2', BLUE), p('後')])
      selectToSecondStart(editor)

      editor.commands.toggleBulletList()

      expect(outline(editor)).toEqual([`bulletList(本文1|本文2) ${GREEN}`, 'paragraph(後)'])
    })
  })

  it('リストにしたあと 1 回の取り消しで、帯も含めて元に戻る', () => {
    const editor = createEditor([p('本文', GREEN)])
    caretIn(editor, '本文')

    editor.commands.toggleBulletList()
    editor.commands.undo()

    expect(outline(editor)).toEqual([`paragraph(本文) ${GREEN}`])
  })
})

describe('入力ルールと帯', () => {
  it('帯のある空の段落で `- ` を打つと、帯のあるリストになる', () => {
    const editor = createEditor([p(undefined, GREEN), p('後')])
    caretInBlock(editor, 0)

    typeText(editor, '- ')

    expect(outline(editor)).toEqual([`bulletList() ${GREEN}`, 'paragraph(後)'])
  })

  it('帯のある空の段落で `## ` を打つと、帯のある見出しになる', () => {
    const editor = createEditor([p(undefined, GREEN), p('後')])
    caretInBlock(editor, 0)

    typeText(editor, '## ')

    expect(editor.state.doc.firstChild?.attrs.level).toBe(2)
    expect(outline(editor)).toEqual([`heading() ${GREEN}`, 'paragraph(後)'])
  })

  it('帯のある空の段落で `> ` を打つと引用になり、中の段落は帯を持たない', () => {
    const editor = createEditor([p(undefined, GREEN), p('後')])
    caretInBlock(editor, 0)

    typeText(editor, '> ')

    expect(outline(editor)).toEqual(['blockquote()', 'paragraph(後)'])
  })

  it('帯の無い番号付きの直後の帯のある段落で `3. ` を打ってつながっても、帯は広がらない', () => {
    const editor = createEditor([ol(['項目1', '項目2']), p(undefined, GREEN)])
    caretInBlock(editor, 1)

    typeText(editor, '3. ')

    expect(outline(editor)).toEqual(['orderedList(項目1|項目2|)'])
  })

  it('features に bulletList が無いと、`- ` を打ってもリストにならない', () => {
    const editor = createEditor([p(undefined, GREEN), p('後')], ['blockBackgroundColor'])
    caretInBlock(editor, 0)

    typeText(editor, '- ')

    expect(outline(editor)).toEqual([`paragraph() ${GREEN}`, 'paragraph(後)'])
  })
})

describe('正規化', () => {
  // 16 進で書かないのは、HTML から読んだ色が rgb() 表記になるため
  const PASTED = 'rgb(103, 178, 127)'
  const BAND_HTML = `<p data-block-background="" style="background-color: ${PASTED}">貼り付け</p>`

  it.each([
    ['リストの項目', [ul(['項目']), p('後')], '項目'],
    ['表のセル', [table(['セル']), p('後')], 'セル'],
    ['引用', [blockquote(p('引用')), p('後')], '引用'],
  ])('帯のある段落を %s の中へ貼り付けると、貼り付けた段落は帯を持たない', (_, content, text) => {
    const editor = createEditor(content as JSONContent[])
    caretIn(editor, text)

    pasteHTML(editor, `${BAND_HTML}${BAND_HTML}`)

    expect(editor.getText()).toContain('貼り付け')
    expect(outline(editor).join()).not.toContain(PASTED)
  })

  it('帯のある段落を最上位に貼り付けると、帯を保つ', () => {
    const editor = createEditor([p('前'), p('後')])
    caretIn(editor, '前')

    pasteHTML(editor, `${BAND_HTML}${BAND_HTML}`)

    expect(outline(editor)).toContain(`paragraph(貼り付け) ${PASTED}`)
  })

  it('帯のある段落を引用で包むと、中の段落は帯を持たない', () => {
    const editor = createEditor([p('本文', GREEN), p('後')])
    caretIn(editor, '本文')

    editor.commands.toggleBlockquote()

    expect(outline(editor)).toEqual(['blockquote(本文)', 'paragraph(後)'])
  })

  it('帯のあるリスト全体を引用で包むと、中のリストは帯を持たない', () => {
    const editor = createEditor([ul(['本文'], GREEN), p('後')])
    editor.commands.setNodeSelection(0)

    editor.commands.toggleBlockquote()

    expect(outline(editor)).toEqual(['blockquote(本文)', 'paragraph(後)'])
  })

  it('選択だけのトランザクションでは、入れ子の帯があっても文書を変えない', () => {
    const editor = createEditor([ul([p('項目', GREEN)]), p('後')])
    const counter = countUpdates(editor)

    caretIn(editor, '後')

    expect(counter.updates).toBe(0)
    expect(outline(editor)).toEqual([`bulletList(項目) 入れ子:${GREEN}`, 'paragraph(後)'])
  })

  it('features に blockBackgroundColor が無くても、既存の帯はリストにすると移り、引用で包むと落ちる', () => {
    const editor = createEditor(
      [p('本文1', GREEN), p('間'), p('本文2', BLUE), p('後')],
      ['bulletList', 'blockquote'],
    )

    caretIn(editor, '本文1')
    editor.commands.toggleBulletList()
    caretIn(editor, '本文2')
    editor.commands.toggleBlockquote()

    expect(outline(editor)).toEqual([
      `bulletList(本文1) ${GREEN}`,
      'paragraph(間)',
      'blockquote(本文2)',
      'paragraph(後)',
    ])
  })

  it('マウント後に features から blockBackgroundColor を外しても、引き継ぎと正規化は働き、付ける操作だけができなくなる', () => {
    const runtime: RichTextRuntimeOptions = { features: FEATURES }
    const element = document.createElement('div')
    document.body.appendChild(element)
    const editor = new Editor({
      element,
      extensions: configureExtensions({ getRuntimeOptions: () => runtime }),
      content: { type: 'doc', content: [p('本文1', GREEN), p('間'), p('本文2', BLUE), p('後')] },
    })
    onTestFinished(() => {
      editor.destroy()
      element.remove()
    })
    rememberManagedPlugins(editor)

    runtime.features = FEATURES.filter((feature) => feature !== 'blockBackgroundColor')
    reconfigureEditorOperations(editor)

    caretIn(editor, '間')
    expect(editor.commands.setBlockBackgroundColor(GREEN)).toBe(false)
    caretIn(editor, '本文1')
    editor.commands.toggleBulletList()
    caretIn(editor, '本文2')
    editor.commands.toggleBlockquote()

    expect(outline(editor)).toEqual([
      `bulletList(本文1) ${GREEN}`,
      'paragraph(間)',
      'blockquote(本文2)',
      'paragraph(後)',
    ])
  })

  it('正規化で落とした帯は、元の操作と一緒に 1 回の取り消しで戻る', () => {
    const editor = createEditor([p('本文', GREEN), p('後')])
    caretIn(editor, '本文')

    editor.commands.toggleBlockquote()
    editor.commands.undo()

    expect(outline(editor)).toEqual([`paragraph(本文) ${GREEN}`, 'paragraph(後)'])
  })
})
