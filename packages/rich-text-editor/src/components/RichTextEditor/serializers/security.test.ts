import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { normalizeToJSON } from './normalizeToJSON'
import { serializeToHTML } from './serializeToHTML'
import { serializeToReactElement } from './serializeToReactElement'

const DANGEROUS_PATTERNS = [
  '<script',
  'onerror',
  'onmouseover',
  'onload',
  'javascript:',
  '<iframe',
  '<object',
  '<style',
  '<svg',
]

const dangerousInputs = [
  '<script>alert("xss")</script>',
  '<p>text</p><script>alert("xss")</script>',
  '<img src="x" onerror="alert(1)">',
  '<a href="javascript:alert(1)">click</a>',
  '<div onmouseover="alert(1)">hover</div>',
  '<iframe src="https://evil.com"></iframe>',
  '<p><object data="data:text/html,<script>alert(1)</script>"></object></p>',
  '<style>body{display:none}</style>',
  '<svg onload="alert(1)"></svg>',
]

// これらの入力はTiptapのHTMLパーサーがCSS値をそのままJSONに保持するため、
// normalizeToJSON段階では javascript: が JSON内に残る。
// 安全性はシリアライザー（isSafeColor）の段階で保証される。
const cssInjectionInputs = [
  '<span style="background-color: url(javascript:alert(1))">x</span>',
  '<span style="background-color: expression(alert(1))">x</span>',
  '<p style="background-image: url(javascript:alert(1))">x</p>',
  '<span style="background-color: rgba(0,0,0,0); background-image: url(javascript:alert(1))">x</span>',
  '<span style="color: rgba(0,0,0,1); behavior: url(javascript:alert(1))">x</span>',
]

const assertSafe = (output: string) => {
  for (const pattern of DANGEROUS_PATTERNS) {
    expect(output).not.toContain(pattern)
  }
}

describe('セキュリティ: 危険なHTMLの無害化', () => {
  describe('normalizeToJSON', () => {
    dangerousInputs.forEach((input) => {
      it(`"${input.slice(0, 40)}..." を無害化する`, () => {
        const json = normalizeToJSON({ format: 'html', content: input })
        assertSafe(JSON.stringify(json))
      })
    })
  })

  describe('serializeToHTML', () => {
    dangerousInputs.forEach((input) => {
      it(`往復変換後も安全: "${input.slice(0, 40)}..."`, () => {
        const json = normalizeToJSON({ format: 'html', content: input })
        assertSafe(serializeToHTML(json))
      })
    })
    cssInjectionInputs.forEach((input) => {
      it(`CSS注入も安全: "${input.slice(0, 40)}..."`, () => {
        const json = normalizeToJSON({ format: 'html', content: input })
        assertSafe(serializeToHTML(json))
      })
    })
  })

  describe('serializeToReactElement', () => {
    dangerousInputs.forEach((input) => {
      it(`React要素に変換しても安全: "${input.slice(0, 40)}..."`, () => {
        const json = normalizeToJSON({ format: 'html', content: input })
        const element = serializeToReactElement(json)
        const html = renderToStaticMarkup(element as React.ReactElement)
        assertSafe(html)
      })
    })
    cssInjectionInputs.forEach((input) => {
      it(`CSS注入もReact変換後も安全: "${input.slice(0, 40)}..."`, () => {
        const json = normalizeToJSON({ format: 'html', content: input })
        const element = serializeToReactElement(json)
        const html = renderToStaticMarkup(element as React.ReactElement)
        assertSafe(html)
      })
    })
  })

  describe('直接JSON入力のサニタイズ', () => {
    it('javascript: URLを含むリンクのhrefが除去される', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }],
                text: 'click me',
              },
            ],
          },
        ],
      }
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      expect(html).not.toContain('javascript:')
    })

    it('data: URLを含むリンクのhrefが除去される', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'link',
                    attrs: { href: 'data:text/html,<script>alert(1)</script>' },
                  },
                ],
                text: 'click me',
              },
            ],
          },
        ],
      }
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      expect(html).not.toContain('data:')
    })

    it('空白文字で始まるjavascript: URLのhrefが除去される', () => {
      const prefixes = ['  ', '\t', '\n', '\r\n', ' \t\n']
      for (const prefix of prefixes) {
        const json = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [{ type: 'link', attrs: { href: `${prefix}javascript:alert(1)` } }],
                  text: 'click me',
                },
              ],
            },
          ],
        }
        const element = serializeToReactElement(json)
        const html = renderToStaticMarkup(element as React.ReactElement)
        expect(html).not.toContain('javascript:')
      }
    })

    it('不正なtarget属性が除去される', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'link',
                    attrs: { href: 'https://example.com', target: 'evil_frame' },
                  },
                ],
                text: 'click me',
              },
            ],
          },
        ],
      }
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      expect(html).not.toContain('evil_frame')
    })

    it('不正なheading levelがクランプされる', () => {
      const json = {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 99 }, content: [{ type: 'text', text: 'test' }] },
        ],
      }
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      expect(html).toContain('<h4')
      expect(html).not.toContain('<h99')
    })

    it('serializeToHTML: 直接JSON入力の画像の危険な src が除去される', () => {
      const dangerousSrcs = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox(1)',
      ]
      for (const src of dangerousSrcs) {
        const json = {
          type: 'doc',
          content: [{ type: 'image', attrs: { src, alt: 'x' } }],
        }
        const html = serializeToHTML(json)
        expect(html).not.toContain(src)
        expect(html).not.toContain('javascript:')
        expect(html).not.toContain('data:text/html')
      }
    })

    it('serializeToHTML: 直接JSON入力の安全な画像 src は保持される', () => {
      const json = {
        type: 'doc',
        content: [{ type: 'image', attrs: { src: 'https://example.com/a.png', alt: 'x' } }],
      }
      expect(serializeToHTML(json)).toContain('https://example.com/a.png')
    })

    it('paragraph の不正な lineHeight が style に出ない', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { lineHeight: '1;background-image:url(javascript:alert(1))' },
            content: [{ type: 'text', text: 'x' }],
          },
        ],
      }
      assertSafe(serializeToHTML(json))
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      assertSafe(html)
      expect(html).not.toContain('background-image')
    })

    it('heading の不正な lineHeight が style に出ない', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2, lineHeight: '1;background-image:url(javascript:alert(1))' },
            content: [{ type: 'text', text: 'h' }],
          },
        ],
      }
      assertSafe(serializeToHTML(json))
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      assertSafe(html)
      expect(html).not.toContain('background-image')
    })

    it('heading の安全な lineHeight が保持される', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2, lineHeight: '2' },
            content: [{ type: 'text', text: 'h' }],
          },
        ],
      }
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      expect(html).toContain('line-height:2')
    })

    it('rgb()/rgba() 形式の color/backgroundColor が保持される', () => {
      const json = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [
                  {
                    type: 'textStyle',
                    attrs: { color: 'rgb(255, 0, 0)', backgroundColor: 'rgba(0, 0, 255, 0.5)' },
                  },
                ],
                text: 'colored',
              },
            ],
          },
        ],
      }
      const element = serializeToReactElement(json)
      const html = renderToStaticMarkup(element as React.ReactElement)
      expect(html).toContain('color:rgb(255, 0, 0)')
      expect(html).toContain('background-color:rgba(0, 0, 255, 0.5)')
    })
  })

  // serializeToReactElement は nodeMapping/markMapping で属性を検証しているが、
  // serializeToHTML は Tiptap 拡張の renderHTML に委ねており、style 値として
  // 使われる属性が未検証のまま出力される。両経路が同じ allowlist に従うことを保証する。
  describe('直接JSON入力のサニタイズ（serializeToHTML）', () => {
    const textStyleDoc = (attrs: Record<string, unknown>) => ({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', marks: [{ type: 'textStyle', attrs }], text: 'styled' }],
        },
      ],
    })

    it('textStyle の color に追記されたCSS宣言が出力されない', () => {
      const html = serializeToHTML(
        textStyleDoc({ color: 'red;background-image:url(https://evil.example/x)' }),
      )
      expect(html).not.toContain('background-image')
      expect(html).not.toContain('evil.example')
    })

    it('textStyle の backgroundColor に追記されたCSS宣言が出力されない', () => {
      const html = serializeToHTML(
        textStyleDoc({ backgroundColor: 'red;background-image:url(https://evil.example/y)' }),
      )
      expect(html).not.toContain('background-image')
      expect(html).not.toContain('evil.example')
    })

    it('textStyle の fontSize に追記されたCSS宣言が出力されない', () => {
      const html = serializeToHTML(textStyleDoc({ fontSize: '12px;position:fixed' }))
      expect(html).not.toContain('position')
    })

    it('textStyle の安全な color/backgroundColor/fontSize は保持される', () => {
      const html = serializeToHTML(
        textStyleDoc({ color: '#ff0000', backgroundColor: 'rgb(0, 0, 255)', fontSize: '12px' }),
      )
      expect(html).toContain('#ff0000')
      expect(html).toContain('rgb(0, 0, 255)')
      expect(html).toContain('12px')
    })

    it('textAlign に追記されたCSS宣言が出力されない', () => {
      const html = serializeToHTML({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { textAlign: 'left;position:fixed' },
            content: [{ type: 'text', text: 'x' }],
          },
        ],
      })
      expect(html).not.toContain('position')
    })

    it('安全な textAlign は保持される', () => {
      const html = serializeToHTML({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { textAlign: 'center' },
            content: [{ type: 'text', text: 'x' }],
          },
        ],
      })
      expect(html).toContain('text-align: center')
    })

    it('link の不正な target が出力されない', () => {
      const html = serializeToHTML({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                marks: [
                  { type: 'link', attrs: { href: 'https://example.com', target: 'evil_frame' } },
                ],
                text: 'click',
              },
            ],
          },
        ],
      })
      expect(html).not.toContain('evil_frame')
    })

    it('image の数値でない width/height が出力されない', () => {
      const html = serializeToHTML({
        type: 'doc',
        content: [
          {
            type: 'image',
            attrs: { src: 'https://example.com/a.png', width: '100"><script>x', height: 'evil' },
          },
        ],
      })
      assertSafe(html)
      expect(html).not.toContain('evil')
    })
  })
})
