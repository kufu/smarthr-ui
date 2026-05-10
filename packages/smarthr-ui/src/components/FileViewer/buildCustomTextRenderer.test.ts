import { buildCustomTextRenderer } from './buildCustomTextRenderer'

import type { PDFSearchMatch } from './types'
import type { ComponentProps } from 'react'
import type { Page } from 'react-pdf'

type RendererArgs = Parameters<NonNullable<ComponentProps<typeof Page>['customTextRenderer']>>[0]

const callRenderer = (
  matches: PDFSearchMatch[],
  currentMatchIndex: number,
  args: { pageIndex: number; itemIndex: number; str: string },
): string => {
  const renderer = buildCustomTextRenderer(matches, currentMatchIndex)
  return renderer({ ...args, pageNumber: args.pageIndex + 1 } as RendererArgs)
}

const match = ({
  pageIndex = 0,
  itemIndex = 0,
  matchStart = 0,
  matchLength = 0,
  globalIndex = 0,
}: Partial<PDFSearchMatch> = {}): PDFSearchMatch => ({
  pageIndex,
  itemIndex,
  matchStart,
  matchLength,
  globalIndex,
})

describe('buildCustomTextRenderer', () => {
  test('マッチを持たない textItem は素通しでエスケープのみが適用される', () => {
    const result = callRenderer([match({ pageIndex: 0, itemIndex: 0, matchLength: 3 })], -1, {
      pageIndex: 1,
      itemIndex: 0,
      str: `<script>&"'`,
    })
    expect(result).toBe('&lt;script&gt;&amp;&quot;&#39;')
    expect(result).not.toContain('<mark')
  })

  test('HTML 特殊文字 (& < > " \') がそれぞれ正しいエンティティに変換される', () => {
    const result = callRenderer([], -1, { pageIndex: 0, itemIndex: 0, str: `&<>"'` })
    expect(result).toBe('&amp;&lt;&gt;&quot;&#39;')
  })

  test('マッチ範囲外と範囲内の両方で HTML 特殊文字がエスケープされる', () => {
    const result = callRenderer([match({ matchStart: 3, matchLength: 5, globalIndex: 0 })], -1, {
      pageIndex: 0,
      itemIndex: 0,
      str: '<a&<a&b>>b',
    })
    // prefix=str[0..3]='<a&', matched=str[3..8]='<a&b>', suffix=str[8..]='>b'
    expect(result).toBe(
      '&lt;a&amp;<mark class="highlight" data-shr-match-index="0">&lt;a&amp;b&gt;</mark>&gt;b',
    )
  })

  test('現在ヒットでないマークは class="highlight" になる', () => {
    const result = callRenderer([match({ matchStart: 0, matchLength: 3, globalIndex: 5 })], -1, {
      pageIndex: 0,
      itemIndex: 0,
      str: 'abc',
    })
    expect(result).toBe('<mark class="highlight" data-shr-match-index="5">abc</mark>')
  })

  test('現在ヒットのマークは class="highlight selected" になる', () => {
    const result = callRenderer([match({ matchStart: 0, matchLength: 3, globalIndex: 5 })], 5, {
      pageIndex: 0,
      itemIndex: 0,
      str: 'abc',
    })
    expect(result).toBe('<mark class="highlight selected" data-shr-match-index="5">abc</mark>')
  })

  test('同一 textItem 内に複数マッチがある場合は順序通りに連結される', () => {
    const result = callRenderer(
      [
        match({ matchStart: 0, matchLength: 3, globalIndex: 0 }),
        match({ matchStart: 6, matchLength: 3, globalIndex: 1 }),
      ],
      -1,
      { pageIndex: 0, itemIndex: 0, str: 'abc---xyz' },
    )
    expect(result).toBe(
      '<mark class="highlight" data-shr-match-index="0">abc</mark>' +
        '---' +
        '<mark class="highlight" data-shr-match-index="1">xyz</mark>',
    )
  })

  test('連続マッチ (間に文字がない) でも空エスケープを挟みつつ正しく連結される', () => {
    const result = callRenderer(
      [
        match({ matchStart: 0, matchLength: 2, globalIndex: 0 }),
        match({ matchStart: 2, matchLength: 2, globalIndex: 1 }),
      ],
      -1,
      { pageIndex: 0, itemIndex: 0, str: 'abcd' },
    )
    expect(result).toBe(
      '<mark class="highlight" data-shr-match-index="0">ab</mark>' +
        '<mark class="highlight" data-shr-match-index="1">cd</mark>',
    )
  })

  test('マッチが textItem の先頭から始まる場合は先頭にエスケープ済みプレフィクスが入らない', () => {
    const result = callRenderer([match({ matchStart: 0, matchLength: 3, globalIndex: 0 })], -1, {
      pageIndex: 0,
      itemIndex: 0,
      str: 'abcdef',
    })
    expect(result).toBe('<mark class="highlight" data-shr-match-index="0">abc</mark>def')
  })

  test('マッチが textItem の末端で終わる場合は末尾にエスケープ済みサフィクスが入らない', () => {
    const result = callRenderer([match({ matchStart: 3, matchLength: 3, globalIndex: 0 })], -1, {
      pageIndex: 0,
      itemIndex: 0,
      str: 'abcdef',
    })
    expect(result).toBe('abc<mark class="highlight" data-shr-match-index="0">def</mark>')
  })

  test('別 pageIndex / itemIndex のマッチは現在の textItem に混入しない', () => {
    const result = callRenderer(
      [
        match({ pageIndex: 0, itemIndex: 1, matchStart: 0, matchLength: 3, globalIndex: 0 }),
        match({ pageIndex: 1, itemIndex: 0, matchStart: 0, matchLength: 3, globalIndex: 1 }),
      ],
      -1,
      { pageIndex: 0, itemIndex: 0, str: 'abcdef' },
    )
    expect(result).toBe('abcdef')
    expect(result).not.toContain('<mark')
  })

  test('複数 textItem を跨ぐ 1 ヒット (同じ globalIndex を共有) でも各 fragment が正しくマークされる', () => {
    const matches = [
      match({ pageIndex: 0, itemIndex: 0, matchStart: 1, matchLength: 1, globalIndex: 0 }),
      match({ pageIndex: 0, itemIndex: 1, matchStart: 0, matchLength: 1, globalIndex: 0 }),
    ]
    const renderer = buildCustomTextRenderer(matches, 0)
    const item0 = renderer({
      pageIndex: 0,
      pageNumber: 1,
      itemIndex: 0,
      str: '人事',
    } as RendererArgs)
    const item1 = renderer({
      pageIndex: 0,
      pageNumber: 1,
      itemIndex: 1,
      str: '制度',
    } as RendererArgs)
    expect(item0).toBe('人<mark class="highlight selected" data-shr-match-index="0">事</mark>')
    expect(item1).toBe('<mark class="highlight selected" data-shr-match-index="0">制</mark>度')
  })
})
