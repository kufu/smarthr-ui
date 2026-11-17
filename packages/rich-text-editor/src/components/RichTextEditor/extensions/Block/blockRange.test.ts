import { Slice } from '@tiptap/pm/model'
import { AllSelection, NodeSelection, TextSelection } from '@tiptap/pm/state'
import { CellSelection } from '@tiptap/pm/tables'
import { describe, expect, it } from 'vitest'

import { getRichTextSchema } from '../../serializers/richTextSchema'

import {
  type BlockRange,
  blockRangeAt,
  findBlockIndex,
  findBoundaryIndex,
  isCurrentRange,
  planMove,
  resolveBlockRange,
} from './blockRange'

import type { JSONContent } from '@tiptap/core'
import type { Node as PMNode } from '@tiptap/pm/model'

const schema = getRichTextSchema()

const paragraph = (text?: string): JSONContent =>
  text ? { type: 'paragraph', content: [{ type: 'text', text }] } : { type: 'paragraph' }

const createDoc = (content: JSONContent[]) => schema.nodeFromJSON({ type: 'doc', content })

const ABCD = createDoc([paragraph('a'), paragraph('b'), paragraph('c'), paragraph('d')])

const textOf = (doc: PMNode, range: BlockRange) =>
  doc.slice(range.from, range.to).content.textBetween(0, range.to - range.from, '|')

const posOf = (doc: PMNode, text: string) => {
  let found = -1

  doc.descendants((node, pos) => {
    if (found === -1 && node.isText && node.text?.includes(text)) found = pos
  })

  return found
}

describe('resolveBlockRange', () => {
  it('キャレットのある最上位のブロック1つを指す', () => {
    const range = resolveBlockRange(ABCD, TextSelection.create(ABCD, posOf(ABCD, 'b')))

    expect(range).toEqual({ from: 3, to: 6, startIndex: 1, endIndex: 2 })
  })

  it('リストの中のキャレットは、リスト全体を指す', () => {
    const doc = createDoc([
      paragraph('a'),
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [paragraph('x')] },
          { type: 'listItem', content: [paragraph('y')] },
        ],
      },
      paragraph('c'),
    ])

    const range = resolveBlockRange(doc, TextSelection.create(doc, posOf(doc, 'y')))

    expect(range.startIndex).toBe(1)
    expect(range.endIndex).toBe(2)
    expect(textOf(doc, range)).toBe('x|y')
  })

  it('複数のブロックにまたがる選択は、またがるブロックをすべて指す', () => {
    const range = resolveBlockRange(
      ABCD,
      TextSelection.create(ABCD, posOf(ABCD, 'b'), posOf(ABCD, 'c') + 1),
    )

    expect(textOf(ABCD, range)).toBe('b|c')
  })

  it('ブロックの先頭で終わる選択は、そのブロックを含まない', () => {
    const doc = createDoc([
      paragraph('a'),
      {
        type: 'bulletList',
        content: [
          { type: 'listItem', content: [paragraph('x')] },
          { type: 'listItem', content: [paragraph('y')] },
        ],
      },
      paragraph('c'),
    ])

    const toList = resolveBlockRange(
      doc,
      TextSelection.create(doc, posOf(doc, 'a'), posOf(doc, 'x')),
    )
    const toC = resolveBlockRange(doc, TextSelection.create(doc, posOf(doc, 'a'), posOf(doc, 'c')))
    const toSecondItem = resolveBlockRange(
      doc,
      TextSelection.create(doc, posOf(doc, 'a'), posOf(doc, 'y')),
    )

    expect(textOf(doc, toList)).toBe('a')
    expect(textOf(doc, toC)).toBe('a|x|y')
    expect(textOf(doc, toSecondItem)).toBe('a|x|y')
  })

  it('最上位の画像のノード選択は、その画像だけを指す', () => {
    const doc = createDoc([
      paragraph('a'),
      { type: 'image', attrs: { src: '/a.png' } },
      paragraph('c'),
    ])

    const range = resolveBlockRange(doc, NodeSelection.create(doc, 3))

    expect(range).toEqual({ from: 3, to: 4, startIndex: 1, endIndex: 2 })
  })

  it('表のセル選択は、表全体を指す', () => {
    const cell = (text: string): JSONContent => ({ type: 'tableCell', content: [paragraph(text)] })
    const doc = createDoc([
      paragraph('a'),
      {
        type: 'table',
        content: [
          { type: 'tableRow', content: [cell('x'), cell('y')] },
          { type: 'tableRow', content: [cell('z'), cell('w')] },
        ],
      },
    ])
    const cellPos = (text: string) => doc.resolve(posOf(doc, text)).before(3)

    const range = resolveBlockRange(doc, CellSelection.create(doc, cellPos('x'), cellPos('w')))

    expect(range.startIndex).toBe(1)
    expect(range.endIndex).toBe(2)
  })

  it('全選択は、すべてのブロックを指す', () => {
    const range = resolveBlockRange(ABCD, new AllSelection(ABCD))

    expect(range).toEqual(blockRangeAt(ABCD, 0, 4))
  })

  describe('文書の末尾の空の段落', () => {
    const heading = (text: string): JSONContent => ({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text }],
    })
    const doc = createDoc([paragraph('a'), heading('b'), paragraph()])
    const inLast = (target: PMNode) => target.content.size - 1

    it('2 つ以上のブロックにまたがる全選択では、範囲から外す', () => {
      expect(resolveBlockRange(doc, new AllSelection(doc))).toEqual(blockRangeAt(doc, 0, 2))
    })

    it('その中で終わるテキスト選択は、ブロックの先頭で終わる選択として、もともと含めない', () => {
      const textSelection = TextSelection.create(doc, posOf(doc, 'a'), inLast(doc))

      expect(resolveBlockRange(doc, textSelection)).toEqual(blockRangeAt(doc, 0, 2))
    })

    it('段落に続く、利用者が作った空の行でも外す', () => {
      const paragraphs = createDoc([paragraph('a'), paragraph('b'), paragraph()])

      expect(resolveBlockRange(paragraphs, new AllSelection(paragraphs))).toEqual(
        blockRangeAt(paragraphs, 0, 2),
      )
    })

    it('その中だけのキャレットは、その段落を指す', () => {
      const range = resolveBlockRange(doc, TextSelection.create(doc, inLast(doc)))

      expect(range).toEqual(blockRangeAt(doc, 2, 3))
    })

    it('末尾の段落が空でないか、選択が末尾まで届かなければ、範囲を変えない', () => {
      const filled = createDoc([paragraph('a'), heading('b'), paragraph('c')])
      const toB = TextSelection.create(doc, posOf(doc, 'a'), posOf(doc, 'b') + 1)

      expect(resolveBlockRange(filled, new AllSelection(filled))).toEqual(
        blockRangeAt(filled, 0, 3),
      )
      expect(resolveBlockRange(doc, toB)).toEqual(blockRangeAt(doc, 0, 2))
    })
  })
})

describe('isCurrentRange', () => {
  it('文書が変わって位置がずれた範囲は、今の文書の範囲ではない', () => {
    const range = blockRangeAt(ABCD, 1)
    const changed = createDoc([paragraph('aa'), paragraph('b'), paragraph('c'), paragraph('d')])

    expect(isCurrentRange(ABCD, range)).toBe(true)
    expect(isCurrentRange(changed, range)).toBe(false)
    expect(isCurrentRange(ABCD, { ...range, endIndex: 9 })).toBe(false)
  })
})

describe('planMove', () => {
  const apply = (doc: PMNode, range: BlockRange, to: Parameters<typeof planMove>[2]) => {
    const plan = planMove(doc, range, to)

    if (plan.type !== 'move') return plan

    const moved = doc.slice(range.from, range.to).content
    const remaining = doc.content.cut(0, range.from).append(doc.content.cut(range.to))
    const result = doc.copy(remaining).replace(plan.insertAt, plan.insertAt, new Slice(moved, 0, 0))

    return {
      text: result.textBetween(0, result.content.size, '|', '#'),
      startIndex: plan.startIndex,
    }
  }

  it.each([
    { name: '上へ', range: blockRangeAt(ABCD, 2), to: 'up' as const, text: 'a|c|b|d', index: 1 },
    { name: '下へ', range: blockRangeAt(ABCD, 1), to: 'down' as const, text: 'a|c|b|d', index: 2 },
    {
      name: '複数を上へ',
      range: blockRangeAt(ABCD, 1, 3),
      to: 'up' as const,
      text: 'b|c|a|d',
      index: 0,
    },
    {
      name: '複数を下へ',
      range: blockRangeAt(ABCD, 0, 2),
      to: 'down' as const,
      text: 'c|a|b|d',
      index: 1,
    },
    { name: '境界 0 へ', range: blockRangeAt(ABCD, 3), to: 0, text: 'd|a|b|c', index: 0 },
    { name: '末尾の境界へ', range: blockRangeAt(ABCD, 0), to: 4, text: 'b|c|d|a', index: 3 },
  ])('$name動かす', ({ range, to, text, index }) => {
    expect(apply(ABCD, range, to)).toEqual({ text, startIndex: index })
  })

  it('先頭で上へは先頭の端、末尾で下へは末尾の端', () => {
    expect(planMove(ABCD, blockRangeAt(ABCD, 0), 'up')).toEqual({ type: 'limit', edge: 'first' })
    expect(planMove(ABCD, blockRangeAt(ABCD, 3), 'down')).toEqual({ type: 'limit', edge: 'last' })
  })

  it.each([1, 2, 3])('範囲の中か両端の境界 %i へ落としても動かない', (boundary) => {
    expect(planMove(ABCD, blockRangeAt(ABCD, 1, 3), boundary)).toEqual({ type: 'noop' })
  })

  it.each([-1, 5, 1.5])('文書に無い境界 %s へは動かない', (boundary) => {
    expect(planMove(ABCD, blockRangeAt(ABCD, 0), boundary)).toEqual({ type: 'noop' })
  })

  describe('末尾の空の段落', () => {
    const doc = createDoc([paragraph('a'), { type: 'horizontalRule' }, paragraph()])

    it('より下へは動かさない', () => {
      expect(planMove(doc, blockRangeAt(doc, 1), 'down')).toEqual({ type: 'limit', edge: 'last' })
      expect(planMove(doc, blockRangeAt(doc, 1), 3)).toEqual({ type: 'noop' })
      expect(apply(doc, blockRangeAt(doc, 0), 3)).toEqual({ text: '#|a|', startIndex: 1 })
      expect(planMove(doc, blockRangeAt(doc, 0), 3)).toMatchObject({ boundary: 2 })
    })

    it('空の段落そのものは上へ動かせる', () => {
      expect(planMove(doc, blockRangeAt(doc, 2), 'up').type).toBe('move')
    })
  })
})

describe('findBlockIndex / findBoundaryIndex', () => {
  const rects = [
    { top: 0, bottom: 20 },
    { top: 30, bottom: 50 },
    { top: 60, bottom: 100 },
  ]

  it.each([
    { y: -10, index: 0 },
    { y: 10, index: 0 },
    { y: 25, index: 0 },
    { y: 26, index: 1 },
    { y: 55, index: 1 },
    { y: 99, index: 2 },
    { y: 500, index: 2 },
  ])('y=$y はブロック $index の上', ({ y, index }) => {
    expect(findBlockIndex(rects, y)).toBe(index)
  })

  it.each([
    { y: 5, boundary: 0 },
    { y: 15, boundary: 1 },
    { y: 39, boundary: 1 },
    { y: 41, boundary: 2 },
    { y: 79, boundary: 2 },
    { y: 81, boundary: 3 },
  ])('y=$y は境界 $boundary に落とす', ({ y, boundary }) => {
    expect(findBoundaryIndex(rects, y)).toBe(boundary)
  })
})
