import { generateHTML, generateJSON } from '@tiptap/core'
import { describe, expect, it } from 'vitest'

import { createSchemaExtensions } from '../schemaExtensions'

const parse = (html: string) => generateJSON(html, createSchemaExtensions())
const SRC = 'https://example.com/image.png'

describe('SafeImage の HTML 読み込み', () => {
  it('Froala の style の width を幅として読む', () => {
    const json = parse(
      `<p dir="ltr"><img src="${SRC}" style="width: 592px;" class="fr-fic fr-dib"></p>`,
    )
    expect(json.content).toContainEqual(
      expect.objectContaining({
        type: 'image',
        attrs: expect.objectContaining({ width: 592, height: null }),
      }),
    )
  })

  it('style の width を width 属性より優先する', () => {
    const json = parse(`<img src="${SRC}" width="300" style="width: 592px;">`)
    expect(json.content[0].attrs).toMatchObject({ width: 592 })
  })

  it('style の width と height がどちらも px なら両方を読む', () => {
    const json = parse(`<img src="${SRC}" style="width: 400px; height: 300px;">`)
    expect(json.content[0].attrs).toMatchObject({ width: 400, height: 300 })
  })

  it('style に height しか無ければ、width 属性は混ぜずに height だけを読む', () => {
    const json = parse(`<img src="${SRC}" width="1200" height="800" style="height: 200px;">`)
    expect(json.content[0].attrs).toMatchObject({ width: null, height: 200 })
  })

  it('!important 付きの寸法も読む', () => {
    const json = parse(`<img src="${SRC}" width="300" style="width: 592px !important;">`)
    expect(json.content[0].attrs).toMatchObject({ width: 592 })
  })

  it('小数の px は整数に丸める', () => {
    const json = parse(`<img src="${SRC}" style="width: 400.5px;">`)
    expect(json.content[0].attrs).toMatchObject({ width: 401 })
  })

  it('大文字の単位でも読む', () => {
    const json = parse(`<img src="${SRC}" style="WIDTH: 592PX;">`)
    expect(json.content[0].attrs).toMatchObject({ width: 592 })
  })

  it.each(['width: 50%;', 'width: auto;', 'width: 0px;', 'width: 0.4px;', ''])(
    'style の width が 0 より大きい px でなければ（%s）width 属性から読む',
    (style) => {
      const json = parse(`<img src="${SRC}" width="300" style="${style}">`)
      expect(json.content[0].attrs).toMatchObject({ width: 300 })
    },
  )

  it('alt の無い画像は、空の alt として読む', () => {
    const json = parse(`<img src="${SRC}">`)
    expect(json.content[0].attrs).toMatchObject({ alt: '' })
  })

  it('数字や真偽値に見える alt と title も、文字列のまま読む', () => {
    const json = parse(`<img src="${SRC}" alt="2024" title="true">`)
    expect(json.content[0].attrs).toMatchObject({ alt: '2024', title: 'true' })
  })

  it('自分の出力を読み直しても幅が変わらない', () => {
    const doc = {
      type: 'doc',
      content: [{ type: 'image', attrs: { src: SRC, width: 592, height: 333, align: 'right' } }],
    }
    const html = generateHTML(doc, createSchemaExtensions())
    expect(parse(html).content[0].attrs).toMatchObject({ width: 592, height: 333, align: 'right' })
  })
})
