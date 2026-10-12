import { afterEach, describe, expect, it, vi } from 'vitest'

import { resolveRichTextValue } from './resolveRichTextValue'

import type { ExternalRichTextValue, RichTextJSON, RichTextValue } from '../types'

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] }

const doc: RichTextJSON = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: '本文' }] }],
}

describe('resolveRichTextValue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each<[string, unknown]>([
    ['未知の format', { format: 'markdown', content: '# 見出し' }],
    ['format: json で content が doc でない', { format: 'json', content: { type: 'paragraph' } }],
    ['文字列', '<p>本文</p>'],
  ])('値はあるのに解決できない %s は、警告を出して空の文書にする', (_, input) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(resolveRichTextValue(input as RichTextValue)).toEqual(EMPTY_DOC)
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it.each<[string, unknown]>([
    ['null', null],
    ['undefined', undefined],
    ['format: empty', { format: 'empty' }],
  ])('データが無いことを表す %s では警告を出さない', (_, input) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    resolveRichTextValue(input as RichTextValue)

    expect(warn).not.toHaveBeenCalled()
  })

  it.each<[string, unknown, unknown]>([
    ['素の JSON', doc, doc],
    ['format: json', { format: 'json', content: doc }, doc],
    ['format: empty', { format: 'empty' }, EMPTY_DOC],
    ['format: json で content が null', { format: 'json', content: null }, EMPTY_DOC],
    ['format: json で content が文字列', { format: 'json', content: '<p>本文</p>' }, EMPTY_DOC],
    [
      'format: json で content が doc でない',
      { format: 'json', content: { type: 'paragraph' } },
      EMPTY_DOC,
    ],
    ['format: html で content が文字列でない', { format: 'html', content: doc }, EMPTY_DOC],
    ['未知の format', { format: 'markdown', content: '# 見出し' }, EMPTY_DOC],
    ['null', null, EMPTY_DOC],
    ['undefined', undefined, EMPTY_DOC],
    ['文字列', '<p>本文</p>', EMPTY_DOC],
    ['format も type も無いオブジェクト', { content: [] }, EMPTY_DOC],
  ])('%s', (_, input, expected) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(resolveRichTextValue(input as RichTextValue)).toEqual(expected)
  })

  it('format: html は HTML を JSON に変換する', () => {
    expect(resolveRichTextValue({ format: 'html', content: '<p>本文</p>' })).toMatchObject(doc)
  })

  it('format を type より先に見る', () => {
    expect(
      resolveRichTextValue({ format: 'empty', type: 'doc' } as unknown as RichTextValue),
    ).toEqual(EMPTY_DOC)
  })

  it('型: format 付きの値は RichTextJSON に代入できず、RichTextValue には代入できる', () => {
    const html: ExternalRichTextValue = { format: 'html', content: '<p>本文</p>' }
    // @ts-expect-error format 付きの値は文書ではない
    const asJSON: RichTextJSON = html
    const asValue: RichTextValue = html

    expect([asJSON, asValue]).toHaveLength(2)
  })
})
