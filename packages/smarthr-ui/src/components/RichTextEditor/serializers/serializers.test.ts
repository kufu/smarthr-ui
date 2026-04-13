import { describe, expect, it } from 'vitest'

import { createChangeMeta, isEmptyDocument } from './createChangeMeta'
import { normalizeToJSON } from './normalizeToJSON'
import { serializeToHTML } from './serializeToHTML'

describe('normalizeToJSON', () => {
  it('empty format を空ドキュメントに変換する', () => {
    const result = normalizeToJSON({ format: 'empty' })
    expect(result.type).toBe('doc')
    expect(result.content).toHaveLength(1)
    expect(result.content![0].type).toBe('paragraph')
  })

  it('undefined を空ドキュメントに変換する', () => {
    const result = normalizeToJSON(undefined)
    expect(result.type).toBe('doc')
  })

  it('json format をそのまま返す', () => {
    const json = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    }
    const result = normalizeToJSON({ format: 'json', content: json })
    expect(result).toBe(json)
  })

  it('html format を JSON に変換する', () => {
    const result = normalizeToJSON({ format: 'html', content: '<p>hello</p>' })
    expect(result.type).toBe('doc')
    expect(result.content).toBeDefined()
    expect(result.content![0].type).toBe('paragraph')
    expect(result.content![0].content![0].text).toBe('hello')
  })

  it('太字を含む HTML を正しく変換する', () => {
    const result = normalizeToJSON({
      format: 'html',
      content: '<p><strong>bold</strong> text</p>',
    })
    const paragraph = result.content![0]
    const boldText = paragraph.content![0]
    expect(boldText.marks).toBeDefined()
    expect(boldText.marks![0].type).toBe('bold')
  })
})

describe('serializeToHTML', () => {
  it('JSON を HTML に変換する', () => {
    const json = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    }
    const html = serializeToHTML(json)
    expect(html).toContain('>hello</p>')
  })

  it('太字を含む JSON を HTML に変換する', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'bold' }],
        },
      ],
    }
    const html = serializeToHTML(json)
    expect(html).toContain('<strong>bold</strong>')
  })
})

describe('isEmptyDocument', () => {
  it('空の paragraph のみのドキュメントを空と判定する', () => {
    expect(isEmptyDocument({ type: 'doc', content: [{ type: 'paragraph' }] })).toBe(true)
  })

  it('content が空配列のドキュメントを空と判定する', () => {
    expect(isEmptyDocument({ type: 'doc', content: [] })).toBe(true)
  })

  it('テキストを含むドキュメントを空でないと判定する', () => {
    expect(
      isEmptyDocument({
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
      }),
    ).toBe(false)
  })
})

describe('createChangeMeta', () => {
  it('JSON から meta を生成する', () => {
    const json = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    }
    const meta = createChangeMeta(json)
    expect(meta.json).toBe(json)
    expect(meta.html).toContain('hello')
    expect(meta.text).toBe('hello')
    expect(meta.isEmpty).toBe(false)
    expect(meta.characterCount).toBe(5)
  })

  it('空ドキュメントの meta を生成する', () => {
    const json = { type: 'doc', content: [{ type: 'paragraph' }] }
    const meta = createChangeMeta(json)
    expect(meta.isEmpty).toBe(true)
    expect(meta.characterCount).toBe(0)
  })
})
