import { getSchema } from '@tiptap/core'
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
})
