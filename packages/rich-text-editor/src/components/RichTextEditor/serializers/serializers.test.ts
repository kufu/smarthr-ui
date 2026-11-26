import { describe, expect, it } from 'vitest'

import { normalizeHex } from '../../../libs/normalizeHex'

import { resolveRichTextValue } from './resolveRichTextValue'
import { serializeToHTML } from './serializeToHTML'
import { toEditorContent } from './toEditorContent'

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

describe('幅全体の背景色', () => {
  const GREEN = '#67b27f'
  const text = (value: string) => [{ type: 'text', text: value }]
  const paragraph = (value: string, attrs?: Record<string, unknown>) => ({
    ...(attrs ? { attrs } : {}),
    type: 'paragraph',
    content: text(value),
  })
  const bulletList = (attrs: Record<string, unknown>, items: object[]) => ({
    type: 'bulletList',
    attrs,
    content: items.map((item) => ({ type: 'listItem', content: [item] })),
  })
  const band = { blockBackgroundColor: GREEN }
  const doc = (...contentRest: object[]): RichTextJSON => ({ type: 'doc', content: contentRest })
  const bandColorsOf = (json: RichTextJSON) =>
    json.content!.map((node) => node.attrs?.blockBackgroundColor ?? null)

  it('段落・見出し・リストは data-block-background と background-color で出力し、余白は出力しない', () => {
    const html = serializeToHTML(
      doc(
        paragraph('段落', band),
        { type: 'heading', attrs: { ...band, level: 2 }, content: text('見出し') },
        bulletList(band, [paragraph('項目')]),
        {
          type: 'orderedList',
          attrs: band,
          content: [{ type: 'listItem', content: [paragraph('番号')] }],
        },
      ),
    )

    expect(html).toContain(
      `<p data-block-background="" style="background-color: ${GREEN};">段落</p>`,
    )
    expect(html).toContain(
      `<h2 data-block-background="" style="background-color: ${GREEN};">見出し</h2>`,
    )
    expect(html).toContain(`<ul data-block-background="" style="background-color: ${GREEN};">`)
    expect(html).toContain(`<ol data-block-background="" style="background-color: ${GREEN};">`)
    expect(html).not.toContain('padding')
    expect(html).not.toContain('margin')
  })

  it('data-block-background のある段落・見出し・ul・ol から同じ色の帯を読み込む', () => {
    const json = resolveRichTextValue({
      format: 'html',
      content: [
        `<p data-block-background style="background-color: ${GREEN}">段落</p>`,
        `<h2 data-block-background style="background-color: ${GREEN}">見出し</h2>`,
        `<ul data-block-background style="background-color: ${GREEN}"><li><p>項目</p></li></ul>`,
        `<ol data-block-background style="background-color: ${GREEN}"><li><p>番号</p></li></ol>`,
      ].join(''),
    })

    expect(bandColorsOf(json).map((color) => normalizeHex(color, ''))).toEqual([
      GREEN,
      GREEN,
      GREEN,
      GREEN,
    ])
  })

  it('data-block-background の無い background-color（Word などの段落の網かけ）は帯にしない', () => {
    const json = resolveRichTextValue({
      format: 'html',
      content: `<p style="background-color: ${GREEN}">網かけ</p>`,
    })

    expect(bandColorsOf(json)).toEqual([null])
  })

  it('項目の中の段落・引用の中の段落・入れ子のリストの帯は出力しない', () => {
    const html = serializeToHTML(
      doc(
        bulletList({}, [paragraph('項目', band)]),
        { type: 'blockquote', content: [paragraph('引用', band)] },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [paragraph('親'), bulletList(band, [paragraph('子')])],
            },
          ],
        },
      ),
    )

    expect(html).not.toContain('data-block-background')
    expect(html).not.toContain('background-color')
  })

  it('エディタに読み込む JSON からも、入れ子の位置の帯を落とし、最上位の帯は保つ', () => {
    const loaded = toEditorContent(
      doc(paragraph('段落', band), bulletList(band, [paragraph('項目', band)])),
    )

    expect(bandColorsOf(loaded as RichTextJSON)).toEqual([GREEN, GREEN])
    expect(loaded.content![1].content![0].content![0].attrs?.blockBackgroundColor).toBeNull()
  })

  it('表のセルの背景色は残り、セルの中の段落の帯だけを落とす', () => {
    const html = serializeToHTML(
      doc({
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableCell',
                attrs: { backgroundColor: '#fde2ea' },
                content: [paragraph('セル', band)],
              },
            ],
          },
        ],
      }),
    )

    expect(html).toContain('background-color: #fde2ea')
    expect(html).not.toContain('data-block-background')
    expect(html).not.toContain(GREEN)
  })
})
