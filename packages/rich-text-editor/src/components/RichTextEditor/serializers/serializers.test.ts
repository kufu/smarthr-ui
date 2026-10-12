import { describe, expect, it } from 'vitest'

import { createChangeMeta } from './createChangeMeta'
import { resolveRichTextValue } from './resolveRichTextValue'
import { serializeToHTML } from './serializeToHTML'

import type { RichTextJSON } from '../types'

describe('resolveRichTextValue', () => {
  it('json format をそのまま返す', () => {
    const json: RichTextJSON = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    }
    const result = resolveRichTextValue({ format: 'json', content: json })
    expect(result).toBe(json)
  })

  it('太字を含む HTML を正しく変換する', () => {
    const result = resolveRichTextValue({
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
    const json: RichTextJSON = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hello' }] }],
    }
    const html = serializeToHTML(json)
    expect(html).toContain('>hello</p>')
  })

  it('太字を含む JSON を HTML に変換する', () => {
    const json: RichTextJSON = {
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

describe('createChangeMeta', () => {
  it('JSON から meta を生成する', () => {
    const json: RichTextJSON = {
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
    const json: RichTextJSON = { type: 'doc', content: [{ type: 'paragraph' }] }
    const meta = createChangeMeta(json)
    expect(meta.isEmpty).toBe(true)
    expect(meta.characterCount).toBe(0)
  })
})

describe('line-height のシリアライズ', () => {
  it('paragraph の lineHeight 属性が style として HTML 出力される', () => {
    const json: RichTextJSON = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { lineHeight: '2' },
          content: [{ type: 'text', text: 'hello' }],
        },
      ],
    }
    expect(serializeToHTML(json)).toContain('line-height: 2')
  })

  it('lineHeight 属性が無い paragraph には line-height が出力されない', () => {
    const json: RichTextJSON = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] }],
    }
    expect(serializeToHTML(json)).not.toContain('line-height')
  })
})

describe('表セルの文字色・背景色', () => {
  it('HTMLの往復でセルの色とインラインの上書きが保持される', () => {
    const html =
      '<table><tr><th style="color: #0077c7; background-color: #fde2ea"><p>base <span style="color: #e01e5a">override</span></p></th></tr></table>'
    const json = resolveRichTextValue({ format: 'html', content: html })
    const cell = json.content![0].content![0].content![0]
    expect(cell.attrs).toMatchObject({
      color: '#0077c7',
      backgroundColor: '#fde2ea',
    })
    const restored = resolveRichTextValue({ format: 'html', content: serializeToHTML(json) })
    expect(restored).toEqual(json)
    expect(cell.content![0].content![1].marks?.[0].attrs?.color).toBe('#e01e5a')
  })
})
