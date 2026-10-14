import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { resolveRichTextValue } from './resolveRichTextValue'
import { serializeToHTML } from './serializeToHTML'
import { serializeToReactElement } from './serializeToReactElement'
import { toEditorContent } from './toEditorContent'

import type { RichTextJSON } from '../types'

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
// resolveRichTextValue段階では javascript: が JSON内に残る。
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
  describe('resolveRichTextValue', () => {
    dangerousInputs.forEach((input) => {
      it(`"${input.slice(0, 40)}..." を無害化する`, () => {
        const json = resolveRichTextValue({ format: 'html', content: input })
        assertSafe(JSON.stringify(json))
      })
    })
  })

  describe('serializeToHTML', () => {
    dangerousInputs.forEach((input) => {
      it(`往復変換後も安全: "${input.slice(0, 40)}..."`, () => {
        const json = resolveRichTextValue({ format: 'html', content: input })
        assertSafe(serializeToHTML(json))
      })
    })
    cssInjectionInputs.forEach((input) => {
      it(`CSS注入も安全: "${input.slice(0, 40)}..."`, () => {
        const json = resolveRichTextValue({ format: 'html', content: input })
        assertSafe(serializeToHTML(json))
      })
    })
  })

  describe('serializeToReactElement', () => {
    dangerousInputs.forEach((input) => {
      it(`React要素に変換しても安全: "${input.slice(0, 40)}..."`, () => {
        const json = resolveRichTextValue({ format: 'html', content: input })
        const element = serializeToReactElement(json)
        const html = renderToStaticMarkup(element as React.ReactElement)
        assertSafe(html)
      })
    })
    cssInjectionInputs.forEach((input) => {
      it(`CSS注入もReact変換後も安全: "${input.slice(0, 40)}..."`, () => {
        const json = resolveRichTextValue({ format: 'html', content: input })
        const element = serializeToReactElement(json)
        const html = renderToStaticMarkup(element as React.ReactElement)
        assertSafe(html)
      })
    })
  })

  describe('直接JSON入力のサニタイズ', () => {
    it('javascript: URLを含むリンクのhrefが除去される', () => {
      const json: RichTextJSON = {
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
      const json: RichTextJSON = {
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
        const json: RichTextJSON = {
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
      const json: RichTextJSON = {
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

    it('serializeToHTML: 直接JSON入力の画像の危険な src が除去される', () => {
      const dangerousSrcs = [
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox(1)',
      ]
      for (const src of dangerousSrcs) {
        const json: RichTextJSON = {
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
      const json: RichTextJSON = {
        type: 'doc',
        content: [{ type: 'image', attrs: { src: 'https://example.com/a.png', alt: 'x' } }],
      }
      expect(serializeToHTML(json)).toContain('https://example.com/a.png')
    })

    it('paragraph の不正な lineHeight が style に出ない', () => {
      const json: RichTextJSON = {
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
      const json: RichTextJSON = {
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
      const json: RichTextJSON = {
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
      const json: RichTextJSON = {
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
      expect(html).toContain('0.75rem')
    })

    // Froala は #RRGGBBAA の色を alpha を小数2桁にした rgba() で保存する
    it.each(['rgba(255, 0, 0, 1.00)', 'rgba(255, 0, 0, 1.0)', 'rgba(255, 0, 0, 0.50)'])(
      '0 から 1 の alpha を小数で書いた rgba() の color は保持される: %s',
      (color) => {
        expect(serializeToHTML(textStyleDoc({ color }))).toContain(color)
      },
    )

    it.each(['rgba(255, 0, 0, 1.50)', 'rgba(255, 0, 0, 1.01)', 'rgba(255, 0, 0, 01.0)'])(
      '1 を超える、または 0 から始まる整数部の alpha の rgba() の color は出力されない: %s',
      (color) => {
        expect(serializeToHTML(textStyleDoc({ color }))).not.toContain('rgba')
      },
    )

    it('textStyle の rem 指定の fontSize は保持される', () => {
      const html = serializeToHTML(textStyleDoc({ fontSize: '1.5rem' }))
      expect(html).toContain('1.5rem')
    })

    it('textStyle の pt 指定の fontSize は rem にそろえて出力される', () => {
      const html = serializeToHTML(textStyleDoc({ fontSize: '12pt' }))
      expect(html).not.toContain('12pt')
      expect(html).toContain('1rem')
    })

    it('textStyle の換算できない単位の fontSize は出力されない', () => {
      const html = serializeToHTML(textStyleDoc({ fontSize: '150%' }))
      expect(html).not.toContain('150%')
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

describe('直接JSON入力のサニタイズ（HTML/React共通）', () => {
  const INJECTED_CSS = 'left;position:fixed;inset:0;z-index:99999'

  const bothOutputs = (json: Parameters<typeof serializeToHTML>[0]) => ({
    html: serializeToHTML(json),
    react: renderToStaticMarkup(
      serializeToReactElement(json as RichTextJSON) as React.ReactElement,
    ),
  })

  const assertNoInjectedCss = (outputs: { html: string; react: string }) => {
    for (const output of Object.values(outputs)) {
      expect(output).not.toContain('position')
      expect(output).not.toContain('inset')
      expect(output).not.toContain('z-index')
      expect(output).not.toContain('99999')
    }
  }

  const cellDoc = (
    cellType: 'tableCell' | 'tableHeader',
    attrs: Record<string, unknown>,
  ): RichTextJSON => ({
    type: 'doc',
    content: [
      {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              {
                type: cellType,
                attrs,
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'a' }] }],
              },
              {
                type: cellType,
                attrs: { colwidth: [180] },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'b' }] }],
              },
            ],
          },
        ],
      },
    ],
  })

  it('paragraph の textAlign に追記されたCSS宣言が両経路で出力されない', () => {
    assertNoInjectedCss(
      bothOutputs({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            attrs: { textAlign: INJECTED_CSS },
            content: [{ type: 'text', text: 'abc' }],
          },
        ],
      }),
    )
  })

  it('heading の textAlign に追記されたCSS宣言が両経路で出力されない', () => {
    assertNoInjectedCss(
      bothOutputs({
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 2, textAlign: INJECTED_CSS },
            content: [{ type: 'text', text: 'abc' }],
          },
        ],
      }),
    )
  })

  it.each(['tableCell', 'tableHeader'] as const)(
    '%s の colwidth に追記されたCSS宣言が両経路で出力されない',
    (cellType) => {
      assertNoInjectedCss(
        bothOutputs(
          cellDoc(cellType, { colwidth: ['100;position:fixed;inset:0;z-index:99999;--x:'] }),
        ),
      )
    },
  )

  it('tableCell の align に追記されたCSS宣言が両経路で出力されない', () => {
    assertNoInjectedCss(bothOutputs(cellDoc('tableCell', { align: INJECTED_CSS })))
  })

  it.each(['color', 'backgroundColor'] as const)(
    'tableCell の %s に追記されたCSS宣言が両経路で出力されない',
    (attribute) => {
      assertNoInjectedCss(bothOutputs(cellDoc('tableCell', { [attribute]: INJECTED_CSS })))
    },
  )

  it('セルの文字色・背景色が両経路で保持される', () => {
    const { html, react } = bothOutputs(
      cellDoc('tableCell', { color: '#e01e5a', backgroundColor: '#fde2ea' }),
    )
    expect(html).toContain('color: #e01e5a')
    expect(html).toContain('background-color: #fde2ea')
    expect(react).toContain('color:#e01e5a')
    expect(react).toContain('background-color:#fde2ea')
  })

  it('引用の中の入れ子の表でも検証される', () => {
    assertNoInjectedCss(
      bothOutputs({
        type: 'doc',
        content: [
          {
            type: 'blockquote',
            content: cellDoc('tableCell', {
              colwidth: ['100;position:fixed;inset:0;z-index:99999;--x:'],
            }).content,
          },
        ],
      }),
    )
  })

  it('正常な colwidth と結合セルが保持される', () => {
    const { html, react } = bothOutputs(
      cellDoc('tableCell', { colspan: 2, rowspan: 1, colwidth: [120, 180], align: 'center' }),
    )
    expect(html).toContain('colspan="2"')
    expect(html).toContain('colwidth="120,180"')
    expect(html).toContain('text-align: center')
    expect(react).toContain('colSpan="2"')
    expect(react).toContain('colwidth="120,180"')
    expect(react).toContain('text-align:center')
  })

  it('幅未指定を表す 0 を含む colwidth が保持される', () => {
    const { html, react } = bothOutputs(cellDoc('tableCell', { colspan: 2, colwidth: [0, 180] }))
    expect(html).toContain('colwidth="0,180"')
    expect(react).toContain('colwidth="0,180"')
  })

  it('colwidth に1つでも不正値があれば属性全体が落ちる', () => {
    const outputs = bothOutputs(cellDoc('tableCell', { colwidth: [120, '180;position:fixed'] }))

    for (const output of Object.values(outputs)) {
      expect(output).not.toContain('120')
      expect(output).not.toContain('position')
    }
  })

  it('numeric string の colwidth は救済せず落とす', () => {
    const outputs = bothOutputs(cellDoc('tableCell', { colwidth: ['120'] }))

    for (const output of Object.values(outputs)) {
      expect(output).not.toContain('120')
    }
  })

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, 1.5, '2'])(
    '不正な colspan (%s) が既定値の1に戻り、属性を出力しない',
    (colspan) => {
      const { html, react } = bothOutputs(cellDoc('tableCell', { colspan }))
      expect(html).not.toMatch(/colspan=/i)
      expect(react).not.toMatch(/colspan=/i)
      // 1に戻らないと colgroup の列数が合わなくなる（2セルなので col も2つ）
      expect(html.match(/<col[\s>]/g)).toHaveLength(2)
    },
  )

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, 1.5, '2'])(
    '不正な rowspan (%s) が既定値の1に戻り、属性を出力しない',
    (rowspan) => {
      const { html, react } = bothOutputs(cellDoc('tableCell', { rowspan }))
      expect(html).not.toMatch(/rowspan=/i)
      expect(react).not.toMatch(/rowspan=/i)
    },
  )

  it('結合していないセルは両経路とも colspan/rowspan を出力しない', () => {
    const { html, react } = bothOutputs(cellDoc('tableCell', { colspan: 1, rowspan: 1 }))
    for (const output of [html, react]) {
      expect(output).not.toMatch(/colspan=/i)
      expect(output).not.toMatch(/rowspan=/i)
    }
  })

  it('HTML から読んだ 1000 を超える colspan も、エディタに渡す前に 1000 に切り詰める', () => {
    const content = toEditorContent(
      resolveRichTextValue({
        format: 'html',
        content: '<table><tr><td colspan="5000"><p>セル</p></td></tr></table>',
      }),
    )
    const cell = content.content?.[0]?.content?.[0]?.content?.[0]

    expect(cell?.attrs).toMatchObject({ colspan: 1000 })
  })

  it('1000 を超える colspan は両経路とも 1000 に切り詰め、rowspan は切り詰めない', () => {
    const { html, react } = bothOutputs(cellDoc('tableCell', { colspan: 1001, rowspan: 1001 }))
    expect(html).toContain('colspan="1000"')
    expect(html).toContain('rowspan="1001"')
    expect(react).toContain('colSpan="1000"')
    expect(react).toContain('rowSpan="1001"')
  })

  it.each([
    [65534, 65534],
    [65535, 65534],
    [1e21, 65534],
  ])('rowspan %d は両経路とも %d で出力する', (rowspan, expected) => {
    const { html, react } = bothOutputs(cellDoc('tableCell', { rowspan }))
    expect(html).toContain(`rowspan="${expected}"`)
    expect(react).toContain(`rowSpan="${expected}"`)
  })

  it.each<[string, Record<string, unknown>, string]>([
    ['colspan より長い', { colspan: 2, colwidth: [100, 120, 140] }, '100,120'],
    [
      '1000 に切り詰めた colspan より長い',
      { colspan: 1001, colwidth: Array(1001).fill(100) },
      Array(1000).fill(100).join(','),
    ],
    ['colspan が無いとき、既定値の 1 より長い', { colwidth: [100, 120] }, '100'],
  ])('%s colwidth は、両経路とも colspan の長さに切る', (_, attrs, expected) => {
    const { html, react } = bothOutputs(cellDoc('tableCell', attrs))
    for (const output of [html, react]) {
      expect(output).toContain(`colwidth="${expected}"`)
    }
  })

  it('colspan より短い colwidth は、両経路とも手を付けずに出力する', () => {
    const { html, react } = bothOutputs(cellDoc('tableCell', { colspan: 3, colwidth: [100, 120] }))
    for (const output of [html, react]) {
      expect(output).toContain('colwidth="100,120"')
    }
  })

  const parse = (markup: string) => {
    const container = document.createElement('div')
    container.innerHTML = markup
    return container
  }

  const wideTableDoc = (colspans: number[]): RichTextJSON => {
    const row = (r: number) => ({
      type: 'tableRow',
      content: colspans.map((colspan, c) => ({
        type: 'tableCell',
        attrs: { colspan, colwidth: Array(colspan).fill(100) },
        content: [{ type: 'paragraph', content: [{ type: 'text', text: `セル${r}-${c}` }] }],
      })),
    })
    return { type: 'doc', content: [{ type: 'table', content: [row(0), row(1)] }] }
  }

  it.each([
    [[500, 500], 1000],
    [[500, 501], 0],
  ])('1行目の colspan が %j の表は、両経路とも <col> を %d 個出す', (colspans, cols) => {
    const { html, react } = bothOutputs(wideTableDoc(colspans))

    for (const output of [html, react]) {
      expect(parse(output).querySelectorAll('col')).toHaveLength(cols)
    }
  })

  it('<col> を出さない表も、両経路とも colspan・colwidth・セルの内容を残す', () => {
    const { html, react } = bothOutputs(wideTableDoc([600, 600]))

    for (const output of [html, react]) {
      const container = parse(output)
      expect(container.querySelector('table')?.style.minWidth).toBe('30000px')
      const cells = Array.from(container.querySelectorAll('td'))
      expect(cells.map((td) => td.colSpan)).toEqual([600, 600, 600, 600])
      expect(cells.map((td) => td.getAttribute('colwidth'))).toEqual(
        Array(4).fill(Array(600).fill(100).join(',')),
      )
      expect(cells.map((td) => td.textContent)).toEqual([
        'セル0-0',
        'セル0-1',
        'セル1-0',
        'セル1-1',
      ])
    }
  })

  it('縦に結合したセルは両経路とも rowspan を出力する', () => {
    const { html, react } = bothOutputs(cellDoc('tableCell', { colspan: 1, rowspan: 2 }))
    expect(html).toContain('rowspan="2"')
    expect(react).toContain('rowSpan="2"')
  })

  it.each<[unknown, number]>([
    [99, 4],
    [5, 4],
    [Number.POSITIVE_INFINITY, 4],
    [0, 1],
    [-1, 1],
    [Number.NEGATIVE_INFINITY, 1],
    [2.6, 3],
    ['3', 3],
    [Number.NaN, 1],
    ['', 1],
    ['abc', 1],
    [null, 1],
  ])('不正な heading level (%s) は両経路とも h%i になる', (level, expected) => {
    const { html, react } = bothOutputs({
      type: 'doc',
      content: [{ type: 'heading', attrs: { level }, content: [{ type: 'text', text: 'a' }] }],
    })

    for (const output of [html, react]) {
      expect(output).toContain(`<h${expected}`)
      expect(output).not.toMatch(/<h(?![1-4][\s>])\d/)
    }
  })

  it('React経路で結合セルを描画してもDOMプロパティ名の警告が出ない', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderToStaticMarkup(
      serializeToReactElement(
        cellDoc('tableHeader', { colspan: 2, rowspan: 1, colwidth: [120, 180] }),
      ) as React.ReactElement,
    )

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('色・行送り・画像寸法が保持される', () => {
    const { html, react } = bothOutputs({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { lineHeight: '1.75' },
          content: [
            {
              type: 'text',
              marks: [{ type: 'textStyle', attrs: { color: '#ff0000' } }],
              text: 'x',
            },
          ],
        },
        { type: 'image', attrs: { src: 'https://example.com/a.png', width: 120.5, height: 80 } },
      ],
    })
    expect(html).toContain('#ff0000')
    expect(html).toContain('1.75')
    expect(html).toContain('120.5')
    expect(react).toContain('#ff0000')
    expect(react).toContain('1.75')
    expect(react).toContain('120.5')
  })

  it('画像の負の寸法が出力されない', () => {
    const { html, react } = bothOutputs({
      type: 'doc',
      content: [{ type: 'image', attrs: { src: 'https://example.com/a.png', width: -100 } }],
    })
    expect(html).not.toContain('-100')
    expect(react).not.toContain('-100')
  })

  it('codeBlock の language に追加したクラスが両経路で出力されない', () => {
    const { html, react } = bothOutputs({
      type: 'doc',
      content: [
        {
          type: 'codeBlock',
          attrs: { language: 'x shr-fixed shr-inset-0 shr-rte-fixed shr-rte-inset-0' },
          content: [{ type: 'text', text: 'code' }],
        },
      ],
    })
    expect(html).not.toMatch(/shr-(rte-)?fixed/)
    expect(react).not.toMatch(/shr-(rte-)?fixed/)
    expect(html).toContain('code')
    expect(react).toContain('code')
  })

  it('codeBlock の安全な language は両経路で保持される', () => {
    const { html, react } = bothOutputs({
      type: 'doc',
      content: [
        {
          type: 'codeBlock',
          attrs: { language: 'c++' },
          content: [{ type: 'text', text: 'code' }],
        },
      ],
    })
    expect(html).toContain('class="language-c++"')
    expect(react).toContain('class="language-c++"')
  })

  const youtubeDoc = (attrs: Record<string, unknown>) => ({
    type: 'doc',
    content: [{ type: 'youtube', attrs: { ...attrs, src: 'https://www.youtube.com/watch?v=abc' } }],
  })

  it('youtube の start に追記したクエリが両経路で埋め込みURLに出ない', () => {
    const { html, react } = bothOutputs(
      youtubeDoc({ start: '0&autoplay=1&origin=https://evil.example' }),
    )
    for (const output of [html, react]) {
      expect(output).not.toContain('evil.example')
      expect(output).not.toContain('autoplay=1')
    }
  })

  it('youtube の安全な start は両経路で保持される', () => {
    const { html, react } = bothOutputs(youtubeDoc({ start: 30 }))
    expect(html).toContain('start=30')
    expect(react).toContain('start=30')
  })

  it('youtube の不正な width/height は両経路で既定値になる', () => {
    const { html, react } = bothOutputs(youtubeDoc({ width: '100%;x', height: -1 }))
    for (const output of [html, react]) {
      expect(output).toContain('width="640"')
      expect(output).toContain('height="360"')
    }
  })

  it.each([
    [{ width: 320, height: '100%;x' }, '320', '180'],
    [{ width: 320 }, '320', '180'],
    [{ width: 'x', height: 180 }, '320', '180'],
    [{ width: 0, height: 180 }, '320', '180'],
    [{ width: 320, height: 0 }, '320', '180'],
  ])('youtube の寸法 %o は、正しい側から 16:9 で補う', (size, width, height) => {
    const { html, react } = bothOutputs(youtubeDoc(size))
    for (const output of [html, react]) {
      expect(output).toContain(`width="${width}"`)
      expect(output).toContain(`height="${height}"`)
    }
  })

  it('youtube の iframe は両経路で縦横比を保って縮む', () => {
    const { html, react } = bothOutputs(youtubeDoc({ width: 320, height: 180 }))
    expect(html).toContain(
      'style="border: 0px; max-width: 100%; height: auto; aspect-ratio: 320 / 180;"',
    )
    expect(react).toContain('max-width:100%;height:auto;aspect-ratio:320 / 180')
  })

  it('youtube の安全な width/height は両経路で保持される', () => {
    const { html, react } = bothOutputs(youtubeDoc({ width: 320, height: 180 }))
    for (const output of [html, react]) {
      expect(output).toContain('width="320"')
      expect(output).toContain('height="180"')
    }
  })

  const imageAlignDoc = (align: unknown) => ({
    type: 'doc',
    content: [{ type: 'image', attrs: { src: 'https://example.com/a.png', align } }],
  })

  it.each([
    ['center', 'margin-left: auto; margin-right: auto', 'margin-left:auto;margin-right:auto'],
    ['right', 'display: block; margin-left: auto;"', 'display:block;margin-left:auto"'],
  ])('画像の配置 %s は両経路で style になる', (align, htmlStyle, reactStyle) => {
    const { html, react } = bothOutputs(imageAlignDoc(align))
    expect(html).toContain(htmlStyle)
    expect(react).toContain(reactStyle)
  })

  it.each([['left'], ['top'], ['center;position:fixed'], [1]])(
    '画像の配置 %s は両経路で出力されない',
    (align) => {
      const { html, react } = bothOutputs(imageAlignDoc(align))
      for (const output of [html, react]) expect(output).not.toContain('margin')
      assertNoInjectedCss({ html, react })
    },
  )

  it.each([
    [
      'center',
      'width: fit-content; margin-left: auto; margin-right: auto',
      'width:fit-content;margin-left:auto;margin-right:auto',
    ],
    ['right', 'width: fit-content; margin-left: auto;"', 'width:fit-content;margin-left:auto"'],
  ])('YouTube の配置 %s は両経路で外側の div の style になる', (align, htmlStyle, reactStyle) => {
    const { html, react } = bothOutputs(youtubeDoc({ width: 320, height: 180, align }))
    expect(html).toContain(`<div data-youtube-video="" style="${htmlStyle}`)
    expect(react).toContain(`<div data-youtube-video="" style="${reactStyle}`)
    for (const output of [html, react]) expect(output).not.toMatch(/<iframe[^>]*margin/)
  })

  it.each([['left'], ['x;position:fixed']])('YouTube の配置 %s は両経路で出力されない', (align) => {
    const { html, react } = bothOutputs(youtubeDoc({ width: 320, height: 180, align }))
    for (const output of [html, react]) expect(output).not.toContain('margin')
    assertNoInjectedCss({ html, react })
  })

  it.each([
    ['数値', { alt: 123 }],
    ['オブジェクト', { alt: { a: 1 } }],
    ['配列', { alt: ['x'] }],
    ['null', { alt: null }],
    ['キーが無い', {}],
  ])('画像の alt が文字列でない（%s）とき、両経路とも空の alt を出す', (_, attrs) => {
    const { html, react } = bothOutputs({
      type: 'doc',
      content: [{ type: 'image', attrs: { ...attrs, src: 'https://example.com/a.png' } }],
    })

    for (const output of [html, react]) {
      expect(output).toMatch(/<img[^>]* alt=""/)
    }
  })

  it('画像の title が文字列でないとき、出力しない', () => {
    const { html } = bothOutputs({
      type: 'doc',
      content: [{ type: 'image', attrs: { src: 'https://example.com/a.png', title: 123 } }],
    })

    expect(html).not.toContain('title=')
  })

  const linkDoc = (attrs: Record<string, unknown>) => ({
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', marks: [{ type: 'link', attrs }], text: 'click' }],
      },
    ],
  })

  it('link の rel が上書きされず両経路で同じ値になる', () => {
    const { html, react } = bothOutputs(
      linkDoc({ href: 'https://example.com', target: '_blank', rel: 'opener' }),
    )
    expect(html).not.toContain('opener"')
    expect(html).toContain('rel="noopener noreferrer nofollow"')
    expect(react).toContain('rel="noopener noreferrer nofollow"')
  })

  it('link の class が両経路で出力されない', () => {
    const { html, react } = bothOutputs(
      linkDoc({
        href: 'https://example.com',
        class: 'shr-fixed shr-inset-0 shr-rte-fixed shr-rte-inset-0',
      }),
    )
    expect(html).not.toMatch(/shr-(rte-)?fixed/)
    expect(react).not.toMatch(/shr-(rte-)?fixed/)
  })

  it.each([
    ['相対パス', { href: '/docs/a' }],
    ['javascript:', { href: 'javascript:alert(1)' }],
    ['href なし', {}],
  ])('href が無効なリンク（%s）は、文字を残して a を出力しない', (_, attrs) => {
    const { html, react } = bothOutputs(linkDoc(attrs))
    for (const output of [html, react]) {
      expect(output).not.toContain('<a')
      expect(output).toContain('click')
    }
  })

  it('HTML入力の link の rel/class も出力されない', () => {
    const json = resolveRichTextValue({
      format: 'html',
      content:
        '<p><a href="https://example.com" rel="opener" class="shr-fixed shr-rte-fixed">click</a></p>',
    })
    const { html, react } = bothOutputs(json)
    for (const output of [html, react]) {
      expect(output).not.toMatch(/shr-(rte-)?fixed/)
      expect(output).toContain('rel="noopener noreferrer nofollow"')
    }
  })

  it('入力JSONを変更しない', () => {
    const json = cellDoc('tableCell', { colspan: 0, colwidth: ['100;position:fixed'] })
    const snapshot = structuredClone(json)

    const deepFreeze = (value: unknown) => {
      if (value && typeof value === 'object') Object.values(value).forEach(deepFreeze)
      Object.freeze(value)
    }
    deepFreeze(json)

    expect(() => bothOutputs(json)).not.toThrow()
    expect(json).toEqual(snapshot)
  })
})
