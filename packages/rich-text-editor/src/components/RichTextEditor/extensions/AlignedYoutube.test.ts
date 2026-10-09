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
