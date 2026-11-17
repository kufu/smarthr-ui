import { closeHistory, history, undo } from '@tiptap/pm/history'
import { EditorState } from '@tiptap/pm/state'
import { describe, expect, it } from 'vitest'

import { getRichTextSchema } from '../../serializers/richTextSchema'
import { BLOCK_CATALOG, type BlockCatalogId, type ConversionShape } from '../blockCatalog'

import { type ConversionPlan, planConversion } from './blockConversion'
import { blockRangeAt } from './blockRange'

import type { JSONContent } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'

const schema = getRichTextSchema()

const t = (text: string, marks: string[] = []): JSONContent => ({
  type: 'text',
  text,
  marks: marks.map((type) => ({ type })),
})
const br: JSONContent = { type: 'hardBreak' }
const textblock = (
  type: string,
  attrs: Record<string, unknown>,
  inline: Array<string | JSONContent>,
): JSONContent => ({
  type,
  attrs,
  content: inline.filter((c) => c !== '').map((c) => (typeof c === 'string' ? t(c) : c)),
})
const p = (...inlineRest: Array<string | JSONContent>) => textblock('paragraph', {}, inlineRest)
const styledP = (attrs: Record<string, unknown>, text: string) =>
  textblock('paragraph', attrs, [text])
const h = (level: number, ...inlineRest: Array<string | JSONContent>) =>
  textblock('heading', { level }, inlineRest)
const styledH = (level: number, attrs: Record<string, unknown>, text: string) =>
  textblock('heading', { ...attrs, level }, [text])
const container = (type: string, attrs: Record<string, unknown>, content: JSONContent[]) => ({
  type,
  attrs,
  content,
})
const li = (...blockRest: JSONContent[]) => container('listItem', {}, blockRest)
const items = (...textRest: string[]) => Array.from(textRest, (text) => li(p(text)))
const ul = (...itemRest: JSONContent[]) => container('bulletList', {}, itemRest)
const ol = (...itemRest: JSONContent[]) => container('orderedList', {}, itemRest)
const olFrom = (start: number, ...itemRest: JSONContent[]) =>
  container('orderedList', { start }, itemRest)
const bq = (...blockRest: JSONContent[]) => container('blockquote', {}, blockRest)
const code = (text: string, language: string | null = null) =>
  container('codeBlock', { language }, text ? [t(text)] : [])
const img: JSONContent = { type: 'image', attrs: { src: '/a.png', alt: 'ロゴ' } }
const hr: JSONContent = { type: 'horizontalRule' }
const table: JSONContent = {
  type: 'table',
  content: [{ type: 'tableRow', content: [{ type: 'tableCell', content: [p('x')] }] }],
}

const toDoc = (content: JSONContent[]) => schema.nodeFromJSON({ type: 'doc', content })

const STYLE = { textAlign: 'center', lineHeight: '2' }
const z = p('z')

type Expected = 'current' | 'unavailable' | JSONContent[]

type TableTarget =
  'paragraph' | 'heading1' | 'bulletList' | 'orderedList' | 'blockquote' | 'codeBlock'

type Row = {
  name: string
  content: JSONContent[]
  range: [number, number]
  expected: Record<TableTarget, Expected>
}

const UNAVAILABLE: Record<TableTarget, Expected> = {
  paragraph: 'unavailable',
  heading1: 'unavailable',
  bulletList: 'unavailable',
  orderedList: 'unavailable',
  blockquote: 'unavailable',
  codeBlock: 'unavailable',
}

const ROWS: Row[] = [
  {
    name: '段落 3 つ',
    content: [p('a'), p('bb'), p('c'), z],
    range: [0, 3],
    expected: {
      paragraph: 'current',
      heading1: [h(1, 'a'), h(1, 'bb'), h(1, 'c'), z],
      bulletList: [ul(...items('a', 'bb', 'c')), z],
      orderedList: [ol(...items('a', 'bb', 'c')), z],
      blockquote: [bq(p('a'), p('bb'), p('c')), z],
      codeBlock: [code('a\nbb\nc'), z],
    },
  },
  {
    name: '段落と見出し2',
    content: [p('a'), h(2, 'bb'), z],
    range: [0, 2],
    expected: {
      paragraph: [p('a'), p('bb'), z],
      heading1: [h(1, 'a'), h(1, 'bb'), z],
      bulletList: [ul(...items('a', 'bb')), z],
      orderedList: [ol(...items('a', 'bb')), z],
      blockquote: [bq(p('a'), h(2, 'bb')), z],
      codeBlock: [code('a\nbb'), z],
    },
  },
  {
    name: '中央寄せで行の高さのある段落',
    content: [styledP(STYLE, 'a'), z],
    range: [0, 1],
    expected: {
      paragraph: 'current',
      heading1: [styledH(1, STYLE, 'a'), z],
      bulletList: [ul(li(styledP(STYLE, 'a'))), z],
      orderedList: [ol(li(styledP(STYLE, 'a'))), z],
      blockquote: [bq(styledP(STYLE, 'a')), z],
      codeBlock: [code('a'), z],
    },
  },
  {
    name: '太字と改行のある段落',
    content: [p(t('a', ['bold']), br, 'bb'), z],
    range: [0, 1],
    expected: {
      paragraph: 'current',
      heading1: [h(1, t('a', ['bold']), br, 'bb'), z],
      bulletList: [ul(li(p(t('a', ['bold']), br, 'bb'))), z],
      orderedList: [ol(li(p(t('a', ['bold']), br, 'bb'))), z],
      blockquote: [bq(p(t('a', ['bold']), br, 'bb')), z],
      codeBlock: [code('a\nbb'), z],
    },
  },
  {
    name: '箇条書き',
    content: [ul(...items('a', 'bb')), z],
    range: [0, 1],
    expected: {
      paragraph: [p('a'), p('bb'), z],
      heading1: [h(1, 'a'), h(1, 'bb'), z],
      bulletList: 'current',
      orderedList: [ol(...items('a', 'bb')), z],
      blockquote: [bq(ul(...items('a', 'bb'))), z],
      codeBlock: [code('a\nbb'), z],
    },
  },
  {
    name: '3 から始まる番号付きリスト',
    content: [olFrom(3, ...items('a', 'b')), z],
    range: [0, 1],
    expected: {
      paragraph: [p('a'), p('b'), z],
      heading1: [h(1, 'a'), h(1, 'b'), z],
      bulletList: [ul(...items('a', 'b')), z],
      orderedList: 'current',
      blockquote: [bq(olFrom(3, ...items('a', 'b'))), z],
      codeBlock: [code('a\nb'), z],
    },
  },
  {
    name: '入れ子の箇条書き',
    content: [ul(li(p('a'), ul(...items('a1'))), li(p('bb'))), z],
    range: [0, 1],
    expected: {
      paragraph: [p('a'), p('a1'), p('bb'), z],
      heading1: [h(1, 'a'), h(1, 'a1'), h(1, 'bb'), z],
      bulletList: 'current',
      orderedList: [ol(li(p('a'), ul(...items('a1'))), li(p('bb'))), z],
      blockquote: [bq(ul(li(p('a'), ul(...items('a1'))), li(p('bb')))), z],
      codeBlock: [code('a\na1\nbb'), z],
    },
  },
  {
    name: '段落が 2 つある項目',
    content: [ul(li(p('a'), p('a2'))), z],
    range: [0, 1],
    expected: {
      paragraph: [p('a'), p('a2'), z],
      heading1: [h(1, 'a'), h(1, 'a2'), z],
      bulletList: 'current',
      orderedList: [ol(li(p('a'), p('a2'))), z],
      blockquote: [bq(ul(li(p('a'), p('a2')))), z],
      codeBlock: [code('a\na2'), z],
    },
  },
  {
    name: '画像のある項目',
    content: [ul(li(p('a'), img), li(p('b'))), z],
    range: [0, 1],
    expected: {
      paragraph: [p('a'), img, p('b'), z],
      heading1: [h(1, 'a'), img, h(1, 'b'), z],
      bulletList: 'current',
      orderedList: [ol(li(p('a'), img), li(p('b'))), z],
      blockquote: [bq(ul(li(p('a'), img), li(p('b')))), z],
      codeBlock: [code('a'), img, code('b'), z],
    },
  },
  {
    name: '段落・リスト・段落',
    content: [p('a'), ul(...items('b', 'c')), p('dd'), z],
    range: [0, 3],
    expected: {
      paragraph: [p('a'), p('b'), p('c'), p('dd'), z],
      heading1: [h(1, 'a'), h(1, 'b'), h(1, 'c'), h(1, 'dd'), z],
      bulletList: [ul(...items('a', 'b', 'c', 'dd')), z],
      orderedList: [ol(...items('a', 'b', 'c', 'dd')), z],
      blockquote: [bq(p('a'), ul(...items('b', 'c')), p('dd')), z],
      codeBlock: [code('a\nb\nc\ndd'), z],
    },
  },
  {
    name: '段落が 2 つある引用',
    content: [bq(p('a'), p('bb')), z],
    range: [0, 1],
    expected: {
      paragraph: [p('a'), p('bb'), z],
      heading1: [h(1, 'a'), h(1, 'bb'), z],
      bulletList: [ul(...items('a', 'bb')), z],
      orderedList: [ol(...items('a', 'bb')), z],
      blockquote: 'current',
      codeBlock: [code('a\nbb'), z],
    },
  },
  {
    name: '見出しとリストのある引用',
    content: [bq(h(2, 'a'), ul(...items('b', 'c'))), z],
    range: [0, 1],
    expected: {
      paragraph: [p('a'), p('b'), p('c'), z],
      heading1: [h(1, 'a'), h(1, 'b'), h(1, 'c'), z],
      bulletList: [ul(...items('a', 'b', 'c')), z],
      orderedList: [ol(...items('a', 'b', 'c')), z],
      blockquote: 'current',
      codeBlock: [code('a\nb\nc'), z],
    },
  },
  {
    name: '引用と段落',
    content: [bq(p('a')), p('b'), z],
    range: [0, 2],
    expected: {
      paragraph: [p('a'), p('b'), z],
      heading1: [h(1, 'a'), h(1, 'b'), z],
      bulletList: [ul(...items('a', 'b')), z],
      orderedList: [ol(...items('a', 'b')), z],
      blockquote: [bq(p('a'), p('b')), z],
      codeBlock: [code('a\nb'), z],
    },
  },
  {
    name: '言語のある 2 行のコード',
    content: [code('x\nyy', 'js'), z],
    range: [0, 1],
    expected: {
      paragraph: [p('x'), p('yy'), z],
      heading1: [h(1, 'x'), h(1, 'yy'), z],
      bulletList: [ul(...items('x', 'yy')), z],
      orderedList: [ol(...items('x', 'yy')), z],
      blockquote: [bq(code('x\nyy', 'js')), z],
      codeBlock: 'current',
    },
  },
  {
    name: '空のコード',
    content: [code(''), z],
    range: [0, 1],
    expected: {
      paragraph: [p(), z],
      heading1: [h(1), z],
      bulletList: [ul(li(p())), z],
      orderedList: [ol(li(p())), z],
      blockquote: [bq(code('')), z],
      codeBlock: 'current',
    },
  },
  {
    name: '改行で終わるコード',
    content: [code('x\n'), z],
    range: [0, 1],
    expected: {
      paragraph: [p('x'), p(), z],
      heading1: [h(1, 'x'), h(1), z],
      bulletList: [ul(li(p('x')), li(p())), z],
      orderedList: [ol(li(p('x')), li(p())), z],
      blockquote: [bq(code('x\n')), z],
      codeBlock: 'current',
    },
  },
  {
    name: 'コードと段落',
    content: [code('x', 'js'), p('y'), z],
    range: [0, 2],
    expected: {
      paragraph: [p('x'), p('y'), z],
      heading1: [h(1, 'x'), h(1, 'y'), z],
      bulletList: [ul(...items('x', 'y')), z],
      orderedList: [ol(...items('x', 'y')), z],
      blockquote: [bq(code('x', 'js'), p('y')), z],
      codeBlock: [code('x\ny', 'js'), z],
    },
  },
  {
    name: '段落・画像・段落',
    content: [p('a'), img, p('bb'), z],
    range: [0, 3],
    expected: {
      paragraph: 'current',
      heading1: [h(1, 'a'), img, h(1, 'bb'), z],
      bulletList: [ul(...items('a')), img, ul(...items('bb')), z],
      orderedList: [ol(...items('a')), img, ol(...items('bb')), z],
      blockquote: [bq(p('a')), img, bq(p('bb')), z],
      codeBlock: [code('a'), img, code('bb'), z],
    },
  },
  {
    name: '段落と水平線',
    content: [p('a'), hr, z],
    range: [0, 2],
    expected: {
      paragraph: 'current',
      heading1: [h(1, 'a'), hr, z],
      bulletList: [ul(...items('a')), hr, z],
      orderedList: [ol(...items('a')), hr, z],
      blockquote: [bq(p('a')), hr, z],
      codeBlock: [code('a'), hr, z],
    },
  },
  { name: '画像だけ', content: [img, z], range: [0, 1], expected: UNAVAILABLE },
  { name: '表だけ', content: [table, z], range: [0, 1], expected: UNAVAILABLE },
  { name: '画像だけの引用', content: [bq(img), z], range: [0, 1], expected: UNAVAILABLE },
  {
    name: '空の段落',
    content: [p(), z],
    range: [0, 1],
    expected: {
      paragraph: 'current',
      heading1: [h(1), z],
      bulletList: [ul(li(p())), z],
      orderedList: [ol(li(p())), z],
      blockquote: [bq(p()), z],
      codeBlock: [code(''), z],
    },
  },
  {
    name: '箇条書きに挟まれた段落',
    content: [ul(...items('a')), p('b'), ul(...items('c')), z],
    range: [1, 2],
    expected: {
      paragraph: 'current',
      heading1: [ul(...items('a')), h(1, 'b'), ul(...items('c')), z],
      bulletList: [ul(...items('a', 'b', 'c')), z],
      orderedList: [ul(...items('a')), ol(...items('b')), ul(...items('c')), z],
      blockquote: [ul(...items('a')), bq(p('b')), ul(...items('c')), z],
      codeBlock: [ul(...items('a')), code('b'), ul(...items('c')), z],
    },
  },
  {
    name: '番号付きリストの後の段落',
    content: [ol(...items('a')), p('b'), z],
    range: [1, 2],
    expected: {
      paragraph: 'current',
      heading1: [ol(...items('a')), h(1, 'b'), z],
      bulletList: [ol(...items('a')), ul(...items('b')), z],
      orderedList: [ol(...items('a', 'b')), z],
      blockquote: [ol(...items('a')), bq(p('b')), z],
      codeBlock: [ol(...items('a')), code('b'), z],
    },
  },
  {
    name: '隣り合う箇条書き 2 つ',
    content: [ul(...items('a')), ul(...items('b')), z],
    range: [0, 2],
    expected: {
      paragraph: [p('a'), p('b'), z],
      heading1: [h(1, 'a'), h(1, 'b'), z],
      bulletList: [ul(...items('a', 'b')), z],
      orderedList: [ol(...items('a', 'b')), z],
      blockquote: [bq(ul(...items('a')), ul(...items('b'))), z],
      codeBlock: [code('a\nb'), z],
    },
  },
]

const shapeOf = (id: BlockCatalogId): ConversionShape => {
  const shape = BLOCK_CATALOG.find((entry) => entry.id === id)?.conversion

  if (!shape) throw new Error(`${id} は変換先ではありません`)

  return shape
}

const CONVERSION_IDS = BLOCK_CATALOG.flatMap(({ id, conversion }) => (conversion ? [id] : []))

const planOf = (
  { content, range: [start, end] }: Pick<Row, 'content' | 'range'>,
  id: BlockCatalogId,
) => {
  const doc = toDoc(content)

  return { doc, plan: planConversion(doc, blockRangeAt(doc, start, end), shapeOf(id)) }
}

const apply = (doc: PMNode, plan: Extract<ConversionPlan, { type: 'convert' }>) =>
  EditorState.create({ doc }).tr.replaceWith(plan.from, plan.to, plan.content).doc

type Run =
  { type: 'text'; from: number; text: string } | { type: 'node'; from: number; node: PMNode }

const SEE_THROUGH = ['bulletList', 'orderedList', 'listItem', 'blockquote']

const readRuns = (doc: PMNode, from: number, to: number) => {
  const runs: Run[] = []

  doc.nodesBetween(from, to, (node, pos) => {
    if (node.isTextblock) {
      let start = pos + 1
      let text = ''

      node.forEach((child, offset) => {
        const chars = child.isText ? child.text! : '\n'

        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === '\n') {
            runs.push({ type: 'text', from: start, text })
            start = pos + 1 + offset + i + 1
            text = ''
          } else {
            text += chars[i]
          }
        }
      })
      runs.push({ type: 'text', from: start, text })

      return false
    }

    if (SEE_THROUGH.includes(node.type.name)) return true

    runs.push({ type: 'node', from: pos, node })

    return false
  })

  return runs
}

const comparable = (runs: Run[]) =>
  runs.map((run) => (run.type === 'text' ? run.text : run.node.toJSON()))

const CELLS = ROWS.flatMap((row) =>
  (Object.entries(row.expected) as Array<[TableTarget, Expected]>).map(([target, expected]) => ({
    ...row,
    target,
    expected,
  })),
)

describe('planConversion', () => {
  it.each(CELLS)('$name → $target', ({ content, range, target, expected }) => {
    const { doc, plan } = planOf({ content, range }, target)

    if (typeof expected === 'string') {
      expect(plan.type).toBe(expected)

      return
    }

    if (plan.type !== 'convert') throw new Error(`convert ではなく ${plan.type} になりました`)

    expect(apply(doc, plan).toJSON()).toEqual(toDoc(expected).toJSON())
  })

  it.each(ROWS)(
    '$name: 変換したすべての先で、スキーマに合い、文字の並びが変わらず、取り消し 1 回で戻る',
    (row) => {
      const tally = { converted: 0, checked: 0, sameRuns: 0, undone: 0 }

      for (const id of CONVERSION_IDS) {
        const { doc, plan } = planOf(row, id)

        if (plan.type !== 'convert') continue

        tally.converted++

        const state = EditorState.create({ doc, plugins: [history()] })
        const next = state.apply(
          closeHistory(state.tr).replaceWith(plan.from, plan.to, plan.content),
        )

        expect(() => next.doc.check()).not.toThrow()
        tally.checked++

        expect(comparable(readRuns(next.doc, plan.from, plan.from + plan.content.size))).toEqual(
          comparable(readRuns(doc, plan.from, plan.to)),
        )
        tally.sameRuns++

        let undone = next

        expect(undo(next, (tr) => (undone = next.apply(tr)))).toBe(true)
        expect(undone.doc.eq(doc)).toBe(true)
        tally.undone++
      }

      const expectedConverted =
        row.expected === UNAVAILABLE
          ? 0
          : CONVERSION_IDS.length - (Object.values(row.expected).includes('current') ? 1 : 0)

      expect(tally).toEqual({
        converted: expectedConverted,
        checked: expectedConverted,
        sameRuns: expectedConverted,
        undone: expectedConverted,
      })
    },
  )

  it('表の全行で、変換が起きた組み合わせの数は表の「今」と「変換しない」を除いた数になる', () => {
    let converted = 0

    for (const row of ROWS) {
      for (const id of CONVERSION_IDS) {
        if (planOf(row, id).plan.type === 'convert') converted++
      }
    }

    const current = ROWS.filter((row) => Object.values(row.expected).includes('current')).length
    const unavailable = ROWS.filter((row) => row.expected === UNAVAILABLE).length

    expect(CONVERSION_IDS).toHaveLength(9)
    expect(converted).toBe(ROWS.length * 9 - current - unavailable * 9)
  })

  it.each(ROWS)('$name: 「今」になる変換先は高々 1 つで、それ以外の変換は文書を変える', (row) => {
    const current = CONVERSION_IDS.filter((id) => planOf(row, id).plan.type === 'current')

    expect(current.length).toBeLessThanOrEqual(1)

    for (const id of CONVERSION_IDS) {
      const { doc, plan } = planOf(row, id)

      if (plan.type === 'convert') expect(apply(doc, plan).eq(doc)).toBe(false)
    }
  })

  it.each(ROWS)(
    '$name: 変換できないのは範囲に文字の行が無いときだけで、変換先によらない',
    (row) => {
      const doc = toDoc(row.content)
      const range = blockRangeAt(doc, ...row.range)
      const hasText = readRuns(doc, range.from, range.to).some(({ type }) => type === 'text')

      for (const id of CONVERSION_IDS) {
        expect(planOf(row, id).plan.type === 'unavailable').toBe(!hasText)
      }
    },
  )

  it.each(ROWS)('$name: 各文字の位置を、変換後の同じ文字の位置へ写す', (row) => {
    for (const id of CONVERSION_IDS) {
      const { doc, plan } = planOf(row, id)

      if (plan.type !== 'convert') continue

      const after = apply(doc, plan)
      const before = readRuns(doc, plan.from, plan.to)
      const mapped = readRuns(after, plan.from, plan.from + plan.content.size)
      const sizeOf = (run: Run) => (run.type === 'text' ? run.text.length : run.node.nodeSize)

      before.forEach((run, i) => {
        for (let offset = 0; offset <= sizeOf(run); offset++) {
          expect(plan.positionMap.map(run.from + offset)).toBe(mapped[i].from + offset)
        }
      })

      const delta = plan.content.size - (plan.to - plan.from)

      for (let pos = 0; pos <= plan.from; pos++) expect(plan.positionMap.map(pos)).toBe(pos)
      for (let pos = plan.to; pos <= doc.content.size; pos++) {
        expect(plan.positionMap.map(pos)).toBe(pos + delta)
      }
    }
  })

  it.each([
    { content: [p('a'), code('x', 'js'), code('y', 'ts'), z], expected: code('a\nx\ny', 'js') },
    { content: [p('a'), code('x'), code('y', 'ts'), z], expected: code('a\nx\ny') },
  ])('コードにまとめると、言語は並びの中の最初のコードのものになる', ({ content, expected }) => {
    const { doc, plan } = planOf({ content, range: [0, 3] }, 'codeBlock')

    if (plan.type !== 'convert') throw new Error(plan.type)

    expect(apply(doc, plan).toJSON()).toEqual(toDoc([expected, z]).toJSON())
  })

  it('見出し2〜4 も見出し1と同じ形にし、同じレベルの見出しは今の種類になる', () => {
    const row = { content: [p('a'), h(3, 'bb'), z], range: [0, 2] as [number, number] }
    const { doc, plan } = planOf(row, 'heading3')

    if (plan.type !== 'convert') throw new Error(plan.type)

    expect(apply(doc, plan).toJSON()).toEqual(toDoc([h(3, 'a'), h(3, 'bb'), z]).toJSON())
    expect(planOf({ content: [h(2, 'a'), z], range: [0, 1] }, 'heading2').plan.type).toBe('current')
  })
})

describe('隣のリストとつなぐ', () => {
  it.each([
    {
      name: '前だけ',
      content: [ul(...items('a')), p('b'), z],
      range: [1, 2],
      to: 'bulletList',
      expected: [ul(...items('a', 'b')), z],
    },
    {
      name: '後ろだけ',
      content: [p('a'), ol(...items('b')), z],
      range: [0, 1],
      to: 'orderedList',
      expected: [ol(...items('a', 'b')), z],
    },
    {
      name: '前と後ろ',
      content: [ul(...items('a')), p('b'), ul(...items('c')), z],
      range: [1, 2],
      to: 'bulletList',
      expected: [ul(...items('a', 'b', 'c')), z],
    },
    {
      name: '種類が違えばつながない',
      content: [ol(...items('a')), p('b'), ol(...items('c')), z],
      range: [1, 2],
      to: 'bulletList',
      expected: [ol(...items('a')), ul(...items('b')), ol(...items('c')), z],
    },
    {
      name: '前の番号付きリストの開始番号を残す',
      content: [olFrom(3, ...items('a')), p('b'), z],
      range: [1, 2],
      to: 'orderedList',
      expected: [olFrom(3, ...items('a', 'b')), z],
    },
    {
      name: '範囲の先頭が画像なら、前の画像とも前のリストともつながない',
      content: [img, img, p('b'), z],
      range: [1, 3],
      to: 'bulletList',
      expected: [img, img, ul(...items('b')), z],
    },
  ] as const)('$name', ({ content, range, to, expected }) => {
    const { doc, plan } = planOf({ content: [...content], range: [...range] }, to)

    if (plan.type !== 'convert') throw new Error(plan.type)

    expect(apply(doc, plan).toJSON()).toEqual(toDoc([...expected]).toJSON())
  })

  it.each([
    {
      name: '並びの先頭が新しい行なら、途中のリストの開始番号を引き継がず、元の項目の番号をずらさない',
      content: [p('intro'), olFrom(5, ...items('a', 'b')), z],
      range: [0, 2],
      expected: [ol(...items('intro', 'a', 'b')), z],
    },
    {
      name: '並びの先頭が元のリストの項目なら、そのリストの開始番号を引き継ぐ',
      content: [olFrom(3, ...items('a')), p('b'), z],
      range: [0, 2],
      expected: [olFrom(3, ...items('a', 'b')), z],
    },
    {
      name: '直前のリストとつなぐなら、範囲の中のリストより直前のリストの開始番号を使う',
      content: [olFrom(3, ...items('a')), p('b'), olFrom(7, ...items('c')), z],
      range: [1, 3],
      expected: [olFrom(3, ...items('a', 'b', 'c')), z],
    },
  ] as const)('$name', ({ content, range, expected }) => {
    const { doc, plan } = planOf({ content: [...content], range: [...range] }, 'orderedList')

    if (plan.type !== 'convert') throw new Error(plan.type)

    expect(apply(doc, plan).toJSON()).toEqual(toDoc([...expected]).toJSON())
  })

  it('範囲がすでにその種類なら、隣に同じ種類のリストがあってもつながず今の種類になる', () => {
    const row = {
      content: [ul(...items('a')), ul(...items('b')), z],
      range: [1, 2] as [number, number],
    }

    expect(planOf(row, 'bulletList').plan.type).toBe('current')
  })
})
