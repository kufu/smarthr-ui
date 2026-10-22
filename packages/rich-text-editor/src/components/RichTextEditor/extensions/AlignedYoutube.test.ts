import { generateHTML, generateJSON } from '@tiptap/core'
import { describe, expect, it } from 'vitest'

import { createSchemaExtensions } from './schemaExtensions'

const toHTML = (attrs: Record<string, unknown>) =>
  generateHTML(
    {
      type: 'doc',
      content: [
        {
          type: 'youtube',
          attrs: { ...attrs, src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        },
      ],
    },
    createSchemaExtensions(),
  )

describe('AlignedYoutube の HTML 出力', () => {
  it('iframe に縦横比を保って縮む style を付ける', () => {
    expect(toHTML({ width: 320, height: 180 })).toMatch(
      /<iframe[^>]*style="border: 0px; max-width: 100%; height: auto; aspect-ratio: 320 \/ 180;"/,
    )
  })

  it('寸法を指定しなければ既定の 640×360 で出す', () => {
    const html = toHTML({})
    expect(html).toContain('width="640"')
    expect(html).toContain('height="360"')
    expect(html).toContain('aspect-ratio: 640 / 360')
  })

  it.each([
    ['1;position:fixed', 180],
    [320, '1;position:fixed'],
    [0, 180],
  ])('寸法 %s × %s は数値として扱えないので縦横比の style を付けない', (width, height) => {
    const html = toHTML({ width, height })
    expect(html).not.toContain('aspect-ratio')
    expect(html).toContain('style="border: 0px;"')
  })
})

describe('AlignedYoutube の HTML 読み込み', () => {
  it.each([
    ['width="320"', 320, 180],
    ['height="180"', 320, 180],
    ['width="320" height="240"', 320, 240],
  ])('%s の iframe は、欠けた側を 16:9 で補って %d×%d で読む', (size, width, height) => {
    const json = generateJSON(
      `<div data-youtube-video><iframe src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" ${size}></iframe></div>`,
      createSchemaExtensions(),
    )
    expect(json.content[0].attrs).toMatchObject({ width, height })
  })
})

describe('div[data-youtube-video] に包まれていない iframe の読み込み', () => {
  const parse = (html: string) => generateJSON(html, createSchemaExtensions())
  const SRC = 'https://www.youtube.com/embed/dQw4w9WgXcQ?&wmode=opaque&rel=0'

  it('YouTube の iframe を動画として読む', () => {
    const json = parse(
      `<p dir="ltr"><span style="font-size:11pt;color:#353744;vertical-align:baseline;"><span class="fr-video fr-deletable fr-fvc fr-draggable fr-dvb"><iframe src="${SRC}" frameborder="0" allowfullscreen="" class="fr-draggable"></iframe></span></span><br></p>`,
    )
    expect(json.content).toContainEqual(
      expect.objectContaining({
        type: 'youtube',
        attrs: expect.objectContaining({ width: 640, height: 360 }),
      }),
    )
  })

  it('YouTube 以外の iframe は動画として読まない', () => {
    const json = parse('<iframe src="https://example.com/embed/dQw4w9WgXcQ"></iframe>')
    expect(JSON.stringify(json)).not.toContain('youtube')
  })

  it.each([
    ['width: 400px; height: 225px;', 400, 225],
    ['width: 400px;', 400, 225],
    ['height: 225px;', 400, 225],
    ['width: 400px !important; height: 225px !important;', 400, 225],
  ])('style の %s を属性より優先して %d×%d で読む', (style, width, height) => {
    const json = parse(`<iframe src="${SRC}" width="640" height="360" style="${style}"></iframe>`)
    expect(json.content[0].attrs).toMatchObject({ width, height })
  })

  it.each([
    ['width="0" height="225"', 400, 225],
    ['width="400" height="0"', 400, 225],
    ['width="-5" height="225"', 400, 225],
    ['width="100%" height="225"', 400, 225],
  ])('寸法が正の数でなければ指定なしとして、%s を %d×%d で読む', (size, width, height) => {
    const json = parse(`<iframe src="${SRC}" ${size}></iframe>`)
    expect(json.content[0].attrs).toMatchObject({ width, height })
  })

  it('style の寸法が px でなければ属性から読む', () => {
    const json = parse(
      `<iframe src="${SRC}" width="640" height="360" style="width: 50%;"></iframe>`,
    )
    expect(json.content[0].attrs).toMatchObject({ width: 640, height: 360 })
  })
})

describe('包まれていない iframe のうち動画として読まないもの', () => {
  const parse = (html: string) => generateJSON(html, createSchemaExtensions())

  it.each([
    'https://www.youtube.com/subscribe_embed?channel=UCx',
    'https://www.youtube.com/live_chat?v=dQw4w9WgXcQ&embed_domain=example.com',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  ])('%s', (src) => {
    expect(JSON.stringify(parse(`<iframe src="${src}"></iframe>`))).not.toContain('youtube')
  })
})

describe('プロトコルを省いた src の iframe', () => {
  it.each([
    [
      '<div data-youtube-video><iframe src="//www.youtube.com/embed/dQw4w9WgXcQ?start=30"></iframe></div>',
    ],
    ['<iframe src="//www.youtube.com/embed/dQw4w9WgXcQ?start=30"></iframe>'],
  ])('%s の開始位置を読む', (html) => {
    const json = generateJSON(html, createSchemaExtensions())
    expect(json.content[0]).toMatchObject({ type: 'youtube', attrs: { start: 30 } })
  })
})

describe('Froala の動画の寄せ方', () => {
  const SRC = 'https://www.youtube.com/embed/dQw4w9WgXcQ?&wmode=opaque&rel=0'
  const alignOf = (html: string) =>
    (
      generateJSON(html, createSchemaExtensions()).content as Array<{
        type: string
        attrs: { align: unknown }
      }>
    ).find((node) => node.type === 'youtube')?.attrs.align
  const froalaVideo = (className: string, paragraphStyle = '') =>
    `<p dir="ltr" style="${paragraphStyle}"><span style="font-size:11pt;color:#353744;vertical-align:baseline;"><span class="${className}"><iframe src="${SRC}" frameborder="0" allowfullscreen="" class="fr-draggable"></iframe></span></span><br></p>`

  it.each([
    ['fr-video fr-deletable fr-fvc fr-draggable fr-dvb', '中央', 'center'],
    ['fr-video fr-deletable fr-fvc fr-draggable fr-dvb fr-active fr-fvl', '左', null],
    ['fr-video fr-deletable fr-fvc fr-draggable fr-dvb fr-active fr-fvr', '右', 'right'],
    ['fr-video fr-dvi fr-fvl', '左', null],
    ['fr-video fr-dvi fr-fvr', '右', 'right'],
  ])('class="%s" の動画を%s寄せで読む', (className, _label, align) => {
    expect(alignOf(froalaVideo(className))).toBe(align)
  })

  it('左寄せのブロック表示は、段落の揃えに関わらず左で読む', () => {
    expect(alignOf(froalaVideo('fr-video fr-fvc fr-dvb fr-fvl', 'text-align: center'))).toBeNull()
  })

  it.each(['fr-video fr-dvi', 'fr-video'])(
    'インライン表示（class="%s"）は、段落の揃えで読む',
    (className) => {
      expect(alignOf(froalaVideo(className, 'text-align: right'))).toBe('right')
    },
  )

  it('div[data-youtube-video] に包まれていれば、Froala の class ではなく div の寄せ方で読む', () => {
    expect(
      alignOf(
        `<div data-youtube-video><span class="fr-video fr-dvb fr-fvr"><iframe src="${SRC}"></iframe></span></div>`,
      ),
    ).toBeNull()
  })
})
