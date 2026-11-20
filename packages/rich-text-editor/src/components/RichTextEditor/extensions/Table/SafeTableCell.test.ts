import { generateJSON, getSchema } from '@tiptap/core'
import { generateJSON as generateJSONOnServer } from '@tiptap/html/server'
import { DOMParser } from '@tiptap/pm/model'
import { describe, expect, it } from 'vitest'

import { ALL_FEATURES, configureExtensions } from '../configureExtensions'
import { createSchemaExtensions } from '../schemaExtensions'

import type { JSONContent } from '@tiptap/core'

const cell = (attrs: string, text: string) => `<td ${attrs}>${text}</td>`

const SPREADSHEET_HTML = [
  '<table><colgroup><col width="180"/><col width="80"/><col width="140"/><col width="110"/></colgroup><tbody>',
  `<tr>${cell('colspan="2"', 'AB')}${cell('', 'C')}${cell('', 'D')}</tr>`,
  `<tr>${cell('rowspan="2"', 'A1')}${cell('', 'B1')}${cell('', 'C1')}${cell('', 'D1')}</tr>`,
  `<tr>${cell('', 'B2')}${cell('', 'C2')}${cell('', 'D2')}</tr>`,
  '</tbody></table>',
].join('')

const colwidthsOf = (json: JSONContent) => {
  const result: Record<string, unknown> = {}
  const walk = (node: JSONContent) => {
    if (node.type === 'tableCell' || node.type === 'tableHeader') {
      result[node.content?.[0]?.content?.[0]?.text ?? ''] = node.attrs?.colwidth
    }
    node.content?.forEach(walk)
  }
  walk(json)
  return result
}

describe.each([
  ['表示', (html: string) => generateJSON(html, createSchemaExtensions())],
  [
    'エディタ',
    (html: string) => generateJSON(html, configureExtensions({ features: ALL_FEATURES })),
  ],
  ['サーバー', (html: string) => generateJSONOnServer(html, createSchemaExtensions())],
])('%s でのセルの列幅の読み込み', (_, toJSON) => {
  const parse = (html: string) => colwidthsOf(toJSON(html))

  it('横と縦の結合を数え、セルが実際に始まる列から colspan の数だけ <col> の幅を読む', () => {
    expect(parse(SPREADSHEET_HTML)).toEqual({
      AB: [180, 80],
      C: [140],
      D: [110],
      A1: [180],
      B1: [80],
      C1: [140],
      D1: [110],
      B2: [80],
      C2: [140],
      D2: [110],
    })
  })

  it('span を持つ <col> は、その数の列として読む', () => {
    const html =
      '<table><colgroup><col width="100" span="2"/><col width="50"/></colgroup><tbody>' +
      `<tr>${cell('', 'A')}${cell('', 'B')}${cell('', 'C')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ A: [100], B: [100], C: [50] })
  })

  it('幅の分からない列は、幅未指定の 0 として読む', () => {
    const html =
      '<table><colgroup><col width="100"/><col/><col width="50"/></colgroup><tbody>' +
      `<tr>${cell('colspan="3"', 'ABC')}</tr>` +
      `<tr>${cell('', 'A')}${cell('', 'B')}${cell('', 'C')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ ABC: [100, 0, 50], A: [100], B: null, C: [50] })
  })

  it('<col> の無い colgroup は、それ自身の width と span で列を表す', () => {
    const html =
      '<table><colgroup width="85"></colgroup><colgroup width="64" span="2"></colgroup><tbody>' +
      `<tr>${cell('', 'A')}${cell('colspan="2"', 'BC')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ A: [85], BC: [64, 64] })
  })

  it('見出しセルも、結合を数えて <col> から列幅を読む', () => {
    const html =
      '<table><colgroup><col width="100"/><col width="200"/></colgroup><tbody>' +
      `<tr><th>A</th><th>B</th></tr></tbody></table>`

    expect(parse(html)).toEqual({ A: [100], B: [200] })
  })

  it('1000 列より右の <col> は読まない', () => {
    const html =
      '<table><colgroup><col width="10" span="1000"/><col width="20"/></colgroup><tbody>' +
      `<tr>${cell('colspan="1000"', 'A')}${cell('', 'B')}</tr></tbody></table>`

    expect(parse(html)).toMatchObject({ B: null })
  })

  it('割合や相対の幅は、ピクセルとして読まない', () => {
    const html =
      '<table><colgroup><col width="50%"/><col width="85*"/><col width="120px"/></colgroup><tbody>' +
      `<tr>${cell('', 'A')}${cell('', 'B')}${cell('', 'C')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ A: null, B: null, C: [120] })
  })

  it('数値として読めない colspan は、モデルと同じく1列として数える', () => {
    const html =
      '<table><colgroup><col width="100"/><col width="200"/><col width="300"/></colgroup><tbody>' +
      `<tr>${cell('colspan=" 2"', 'A')}${cell('', 'B')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ A: [100], B: [200] })
  })

  it('入れ子の表の行やセルは、外側の表の列として数えない', () => {
    const inner = `<table><tbody><tr>${cell('', 'x')}${cell('', 'y')}</tr></tbody></table>`
    const html =
      '<table><colgroup><col width="100"/><col width="200"/></colgroup><tbody>' +
      `<tr><td>${inner}</td>${cell('', 'B')}</tr></tbody></table>`

    expect(parse(html)).toMatchObject({ B: [200] })
  })

  it('tfoot が tbody より前にあっても、文書の順に行を数える', () => {
    const html =
      '<table><colgroup><col width="100"/><col width="200"/></colgroup>' +
      `<tfoot><tr>${cell('rowspan="2"', 'F')}${cell('', 'G')}</tr></tfoot>` +
      `<tbody><tr>${cell('', 'H')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ F: [100], G: [200], H: [200] })
  })

  it('セルの colwidth 属性に数値でない値があれば、<col> から読む', () => {
    const html =
      '<table><colgroup><col width="100"/><col width="200"/></colgroup><tbody>' +
      `<tr>${cell('colspan="2" colwidth="100,,50"', 'AB')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ AB: [100, 200] })
  })

  it('セルの colwidth 属性は colspan の長さに合わせ、すべて 0 なら <col> から読む', () => {
    const html =
      '<table><colgroup><col width="100"/><col width="200"/></colgroup><tbody>' +
      `<tr>${cell('colspan="2" colwidth="300"', 'AB')}</tr>` +
      `<tr>${cell('colwidth="0"', 'A')}${cell('colwidth="150,160"', 'B')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ AB: [300, 0], A: [100], B: [150] })
  })

  it('<col> の span は、ブラウザと同じく先頭の整数で読む', () => {
    const html =
      '<table><colgroup><col width="100" span=" 2"/><col width="50"/></colgroup><tbody>' +
      `<tr>${cell('', 'A')}${cell('', 'B')}${cell('', 'C')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ A: [100], B: [100], C: [50] })
  })

  it('セルの colwidth 属性の 0 は、幅未指定の列として読む', () => {
    const html = `<table><tbody><tr>${cell('colspan="2" colwidth="0,180"', 'AB')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ AB: [0, 180] })
  })

  it('セルの colwidth 属性は <col> より優先する', () => {
    const html =
      '<table><colgroup><col width="100"/></colgroup><tbody>' +
      `<tr>${cell('colwidth="300"', 'A')}</tr></tbody></table>`

    expect(parse(html)).toEqual({ A: [300] })
  })
})

it('同じ DOM の表を書き換えて読み直すと、新しい列幅を読む', async () => {
  const container = document.createElement('div')
  container.innerHTML =
    '<table><colgroup><col width="100"/></colgroup><tbody><tr><td>A</td></tr></tbody></table>'
  const parser = DOMParser.fromSchema(getSchema(createSchemaExtensions()))
  const colwidthOf = () => {
    let colwidth: unknown
    parser.parse(container).descendants((node) => {
      if (node.type.name === 'tableCell') colwidth = node.attrs.colwidth
    })
    return colwidth
  }

  expect(colwidthOf()).toEqual([100])

  container.querySelector('col')!.setAttribute('width', '300')
  await Promise.resolve()

  expect(colwidthOf()).toEqual([300])
})
