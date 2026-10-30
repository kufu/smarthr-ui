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

describe('Froala の画像の寄せ方', () => {
  const alignOf = (html: string) =>
    (parse(html).content as Array<{ type: string; attrs: { align: unknown } }>).find(
      (node) => node.type === 'image',
    )?.attrs.align

  it.each([
    ['fr-fic fr-dib fr-draggable', '中央', 'center'],
    ['fr-fic fr-dib fr-draggable fr-fil', '左', null],
    ['fr-fic fr-dib fr-draggable fr-fir', '右', 'right'],
    ['fr-fic fr-dii fr-fil', '左', null],
    ['fr-fic fr-dii fr-fir', '右', 'right'],
  ])('class="%s" の画像を%s寄せで読む', (className, _label, align) => {
    expect(
      alignOf(`<p dir="ltr"><img src="${SRC}" style="width: 300px;" class="${className}"></p>`),
    ).toBe(align)
  })

  it('左寄せのブロック表示は、段落の揃えに関わらず左で読む', () => {
    expect(
      alignOf(`<p style="text-align: center"><img src="${SRC}" class="fr-fic fr-dib fr-fil"></p>`),
    ).toBeNull()
  })

  it('インライン表示（fr-dii）は、段落の揃えで読む', () => {
    expect(
      alignOf(`<p style="text-align: right"><img src="${SRC}" class="fr-fic fr-dii"></p>`),
    ).toBe('right')
  })

  it.each([
    ['', `<img src="${SRC}" class="fr-fic">`],
    ['リンク付き', `<a href="https://example.com"><img src="${SRC}" class="fr-fic"></a>`],
    ['img がインライン表示の', `<img src="${SRC}" class="fr-fic fr-dii">`],
    ['img が中央寄せの', `<img src="${SRC}" class="fr-fic fr-dib">`],
    ['img が左寄せの', `<img src="${SRC}" class="fr-fic fr-dib fr-fil">`],
  ])('%sキャプション付きの画像は、外側の寄せ方で読む', (_label, image) => {
    expect(
      alignOf(
        `<p><span class="fr-img-caption fr-fic fr-dib fr-fir"><span class="fr-img-wrap">${image}<span class="fr-inner">説明</span></span></span></p>`,
      ),
    ).toBe('right')
  })

  it('キャプションがあれば、img の style ではなくキャプションの寄せ方で読む', () => {
    expect(
      alignOf(
        `<p><span class="fr-img-caption fr-fic fr-dib fr-fir"><span class="fr-img-wrap"><img src="${SRC}" style="display: block; margin: 5px auto;"><span class="fr-inner">説明</span></span></span></p>`,
      ),
    ).toBe('right')
  })

  it('インライン表示のキャプションは、img の class ではなく段落の揃えで読む', () => {
    expect(
      alignOf(
        `<p style="text-align: right"><span class="fr-img-caption fr-fic fr-dii"><span class="fr-img-wrap"><img src="${SRC}" class="fr-fic fr-dib"></span></span></p>`,
      ),
    ).toBe('right')
  })

  it('キャプションの文の中にある画像は、キャプションの寄せ方で読まない', () => {
    expect(
      alignOf(
        `<p><span class="fr-img-caption fr-fic fr-dib fr-fir"><span class="fr-img-wrap"><span class="fr-inner"><img src="${SRC}"></span></span></span></p>`,
      ),
    ).toBeNull()
  })

  it.each([
    ['中央', 'margin-left: auto; margin-right: auto;', 'center'],
    ['左', 'margin-left: 0; margin-right: auto;', null],
  ])('style で%s寄せを明示していれば、クラスより優先する', (_label, margin, align) => {
    expect(
      alignOf(
        `<p style="text-align: right"><img src="${SRC}" class="fr-fic fr-dib fr-fir" style="display: block; ${margin}"></p>`,
      ),
    ).toBe(align)
  })

  it('style がブロック表示だけで margin を明示していなければ、クラスの寄せ方で読む', () => {
    expect(
      alignOf(
        `<img src="${SRC}" class="fr-fic fr-dib fr-fir" style="display: block; width: 300px;">`,
      ),
    ).toBe('right')
  })

  it('ブロック表示とインライン表示の class が両方あれば、インライン表示として段落の揃えで読む', () => {
    expect(
      alignOf(`<p style="text-align: right"><img src="${SRC}" class="fr-fic fr-dib fr-dii"></p>`),
    ).toBe('right')
  })
})
