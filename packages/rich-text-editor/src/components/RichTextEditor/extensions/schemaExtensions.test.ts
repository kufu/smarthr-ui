import { getAttributesFromExtensions, getSchema, resolveExtensions } from '@tiptap/core'
import { generateHTML, generateJSON } from '@tiptap/html'
import { describe, expect, it } from 'vitest'

import { ALL_FEATURES, configureExtensions } from './configureExtensions'
import { createSchemaExtensions } from './schemaExtensions'

import type { Schema } from '@tiptap/pm/model'

/** 関数（parseDOM の getAttrs や toDOM）を除いた、比較できる形の spec */
const toComparableSpec = (schema: Schema) => {
  const nodes: unknown[] = []
  const marks: unknown[] = []

  schema.spec.nodes.forEach((name, spec) => nodes.push([name, JSON.parse(JSON.stringify(spec))]))
  schema.spec.marks.forEach((name, spec) => marks.push([name, JSON.parse(JSON.stringify(spec))]))

  return { topNode: schema.spec.topNode, nodes, marks }
}

const ALL_FORMATS_HTML = [
  '<h1 style="text-align: center; line-height: 1.5">見出し1</h1>',
  '<h4>見出し4</h4>',
  '<p style="text-align: right; line-height: 2"><strong>太字</strong><em>斜体</em><s>取消</s><u>下線</u><code>code</code></p>',
  '<p><span style="color: #ff0000; background-color: #ffff00; font-size: 1.5rem">装飾</span>',
  '<a href="https://example.com" target="_blank">リンク</a><a href="javascript:alert(1)">不正</a><br>改行</p>',
  '<ul><li><p>箇条書き</p></li></ul><ol start="3"><li><p>番号付き</p></li></ol>',
  '<blockquote><p>引用</p></blockquote><pre><code class="language-ts">const a = 1</code></pre><hr>',
  '<img src="https://example.com/a.png" alt="画像" width="200" height="100">',
  '<img src="data:image/png;base64,AAAA"><img src="blob:https://example.com/x">',
  '<div data-youtube-video><iframe src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" width="320" height="180"></iframe></div>',
  '<img src="https://example.com/b.png" style="display: block; margin-left: auto; margin-right: auto">',
  '<div data-youtube-video style="width: fit-content; margin-left: auto"><iframe src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" width="320" height="180"></iframe></div>',
  '<div data-video style="width: fit-content; margin-left: auto"><video src="https://example.com/a.mp4" poster="/a.jpg" title="動画の説明" width="320" height="180" controls></video></div>',
  '<p><video src="/b.mp4"></video></p><video><source src="/c.mp4" type="video/mp4"></video>',
  '<video src="javascript:alert(1)"></video><video src="//example.com/d.mp4"></video>',
  '<table><tbody><tr><th colspan="2" style="background-color: #eeeeee">見出しセル</th></tr>',
  '<tr><td style="color: #333333" colwidth="120">セル</td><td rowspan="1"><p>セル2</p></td></tr></tbody></table>',
].join('')

describe('createSchemaExtensions', () => {
  const schemaExtensions = createSchemaExtensions()
  const editorExtensions = configureExtensions({ features: ALL_FEATURES })

  it('Editor と同じ schema を作る', () => {
    expect(toComparableSpec(getSchema(schemaExtensions))).toEqual(
      toComparableSpec(getSchema(editorExtensions)),
    )
  })

  it('Editor と同じように HTML を読み、同じ HTML を書き出す', () => {
    const json = generateJSON(ALL_FORMATS_HTML, schemaExtensions)

    expect(json).toEqual(generateJSON(ALL_FORMATS_HTML, editorExtensions))
    expect(generateHTML(json, schemaExtensions)).toBe(generateHTML(json, editorExtensions))
  })

  it.each([
    ['表示', schemaExtensions],
    ['エディタ', editorExtensions],
  ])('%s の拡張は、数字に見えるリンクの title も文字列のまま読む', (_, extensions) => {
    const json = generateJSON(
      '<p><a href="https://example.com" title="2024">リンク</a></p>',
      extensions,
    )

    expect(json.content[0].content[0].marks[0].attrs).toMatchObject({ title: '2024' })
  })

  // 全属性に parseHTML を求めないのは、既定の読み込みで数値・真偽値に変わっても sanitize で正しい値に直る属性があるため
  it.each([
    ['表示', schemaExtensions],
    ['エディタ', editorExtensions],
  ])('%s の拡張で parseHTML を持たない属性は、確認済みのものだけ', (_, extensions) => {
    const attributes = getAttributesFromExtensions(resolveExtensions(extensions))
    const withoutParseHTML = attributes
      .filter(({ attribute }) => !attribute.parseHTML)
      .map(({ type, name }) => `${type}.${name}`)
      .sort()

    expect(withoutParseHTML).toEqual([
      'heading.level',
      'image.src',
      'link.class',
      'link.rel',
      'link.target',
      'tableCell.colspan',
      'tableCell.rowspan',
      'tableHeader.colspan',
      'tableHeader.rowspan',
    ])
  })

  it('画像と YouTube の配置を読み、同じ style で書き出す', () => {
    const json = generateJSON(ALL_FORMATS_HTML, schemaExtensions)
    const html = generateHTML(json, schemaExtensions)

    expect(html).toMatch(
      /src="https:\/\/example\.com\/b\.png"[^>]*style="display: block; margin-left: auto; margin-right: auto;"/,
    )
    expect(html).toContain(
      '<div data-youtube-video="" style="width: fit-content; margin-left: auto;">',
    )
  })

  describe('動画', () => {
    const EMPTY_VIDEO_ATTRS = {
      src: null,
      poster: null,
      title: null,
      width: null,
      height: null,
      align: null,
    }
    const videoAttrs = (attrs: Record<string, unknown>) => ({ ...EMPTY_VIDEO_ATTRS, ...attrs })

    it('属性と配置を読み、再生できる形で書き出す', () => {
      const json = generateJSON(
        '<div data-video style="width: fit-content; margin-left: auto; margin-right: auto"><video src="https://example.com/a.mp4" poster="/a.jpg" title="動画の説明" width="320" height="180"></video></div>',
        schemaExtensions,
      )

      expect(json.content).toEqual([
        {
          type: 'video',
          attrs: videoAttrs({
            src: 'https://example.com/a.mp4',
            poster: '/a.jpg',
            title: '動画の説明',
            width: 320,
            height: 180,
            align: 'center',
          }),
        },
      ])
      expect(generateHTML(json, schemaExtensions)).toBe(
        '<div data-video="" style="width: fit-content; margin-left: auto; margin-right: auto;"><video src="https://example.com/a.mp4" poster="/a.jpg" title="動画の説明" width="320" height="180" style="aspect-ratio: 320 / 180;" controls="" preload="metadata" playsinline=""></video></div>',
      )
    })

    it.each([
      ['段落で包んだ video', '<p><video src="/a.mp4"></video></p>'],
      ['source で指定した video', '<video><source src="/a.mp4" type="video/mp4"></video>'],
      ['素の video', '<video src="/a.mp4"></video>'],
    ])('%s を、前後に空の段落を作らずに読む', (_, html) => {
      expect(generateJSON(html, schemaExtensions).content).toEqual([
        { type: 'video', attrs: videoAttrs({ src: '/a.mp4' }) },
      ])
    })

    it('段落の揃えを動画の配置として読む', () => {
      const json = generateJSON(
        '<p style="text-align: right"><video src="/a.mp4"></video></p>',
        schemaExtensions,
      )

      expect(json.content).toEqual([
        { type: 'video', attrs: videoAttrs({ src: '/a.mp4', align: 'right' }) },
      ])
    })

    it('代替テキストのある video だけの段落も、空の段落を作らず揃えを保ったまま読み書きする', () => {
      const json = generateJSON(
        '<p style="text-align: center"><video src="/a.mp4">Your browser does not support HTML5 video.</video></p>',
        schemaExtensions,
      )

      expect(json.content).toEqual([
        { type: 'video', attrs: videoAttrs({ src: '/a.mp4', align: 'center' }) },
      ])
      expect(generateJSON(generateHTML(json, schemaExtensions), schemaExtensions)).toEqual(json)
    })

    it.each([
      ['javascript:', '<video src="javascript:alert(1)"></video>'],
      ['別ホストを指す //', '<video src="//example.com/a.mp4"></video>'],
      ['別ホストを指す /\\', '<video src="/\\example.com/a.mp4"></video>'],
      ['data:', '<video src="data:video/mp4;base64,AAAA"></video>'],
      ['source の javascript:', '<video><source src="javascript:alert(1)"></video>'],
      [
        '不正な src と正しい source',
        '<video src="javascript:alert(1)"><source src="/a.mp4"></video>',
      ],
    ])('src が %s の動画は読まない', (_, html) => {
      expect(JSON.stringify(generateJSON(html, schemaExtensions))).not.toContain('"video"')
    })

    it('不正な poster は読まず、動画は残す', () => {
      const json = generateJSON(
        '<video src="/a.mp4" poster="javascript:alert(1)"></video>',
        schemaExtensions,
      )

      expect(json.content).toEqual([{ type: 'video', attrs: videoAttrs({ src: '/a.mp4' }) }])
    })
  })
})
