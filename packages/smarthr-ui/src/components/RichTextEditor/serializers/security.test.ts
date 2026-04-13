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
  })
})
