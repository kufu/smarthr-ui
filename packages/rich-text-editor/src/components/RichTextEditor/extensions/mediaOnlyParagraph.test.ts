import { generateJSON } from '@tiptap/core'
import { describe, expect, it } from 'vitest'

import { createSchemaExtensions } from './schemaExtensions'

import type { JSONContent } from '@tiptap/core'

type Outline = string | [string, ...Outline[]]

const toOutline = (node: JSONContent): Outline =>
  node.type === 'text' ? node.text! : [node.type!, ...(node.content ?? []).map(toOutline)]

const parse = (html: string) =>
  (generateJSON(html, createSchemaExtensions()).content ?? []).map(toOutline)

const IMG = '<img src="https://example.com/image.png">'
const VIDEO = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>'

describe('画像か動画しか入っていない段落の読み込み', () => {
  it.each([
    ['画像', `<p>${IMG}</p>`, [['image']]],
    ['動画', `<p>${VIDEO}</p>`, [['youtube']]],
    [
      'Froala の動画（文字スタイルの span で包まれ、末尾に br）',
      `<p dir="ltr"><span style="font-size:11pt;color:#353744;vertical-align:baseline;"><span class="fr-video fr-deletable fr-fvc fr-draggable fr-dvb">${VIDEO}</span></span><br></p>`,
      [['youtube']],
    ],
    [
      'Froala の画像',
      `<p dir="ltr"><img src="https://example.com/image.png" style="width: 592px;" class="fr-fic fr-dib"></p>`,
      [['image']],
    ],
    ['画像と空白', `<p>\n  ${IMG} </p>`, [['image']]],
    ['画像が2つ', `<p>${IMG}${IMG}</p>`, [['image'], ['image']]],
    [
      'リスト項目の2つ目の段落',
      `<ul><li><p>前</p><p>${IMG}</p></li></ul>`,
      [['bulletList', ['listItem', ['paragraph', '前'], ['image']]]],
    ],
    [
      'リスト項目の中の表のセルの中',
      `<ul><li><p>前</p><table><tbody><tr><td><p>${IMG}</p></td></tr></tbody></table></li></ul>`,
      [
        [
          'bulletList',
          ['listItem', ['paragraph', '前'], ['table', ['tableRow', ['tableCell', ['image']]]]],
        ],
      ],
    ],
    [
      '表のセルの中',
      `<table><tbody><tr><td><p>${IMG}</p></td></tr></tbody></table>`,
      [['table', ['tableRow', ['tableCell', ['image']]]]],
    ],
  ])('%s は段落で包まずに読む', (_, html, expected) => {
    expect(parse(html)).toEqual(expected)
  })

  it.each([
    [
      'ふつうの空行',
      '<p>前</p><p><br></p><p>後</p>',
      [
        ['paragraph', '前'],
        ['paragraph', ['hardBreak']],
        ['paragraph', '後'],
      ],
    ],
    ['画像と &nbsp;', `<p>${IMG}&nbsp;</p>`, [['paragraph'], ['image'], ['paragraph', '\u00a0']]],
    ['文字の間の画像', `<p>前${IMG}後</p>`, [['paragraph', '前'], ['image'], ['paragraph', '後']]],
    [
      'リスト項目の先頭の段落',
      `<ul><li><p>${IMG}</p></li></ul>`,
      [['bulletList', ['listItem', ['paragraph'], ['image']]]],
    ],
    [
      'リスト項目の先頭の、div で包まれた段落',
      `<ul><li><div><p>${IMG}</p></div><p>後</p></li></ul>`,
      [['bulletList', ['listItem', ['paragraph'], ['image'], ['paragraph', '後']]]],
    ],
    [
      'リスト項目の先頭の、空の span の後ろの段落',
      `<ul><li><span></span><p>${IMG}</p></li></ul>`,
      [['bulletList', ['listItem', ['paragraph'], ['image']]]],
    ],
    [
      'リスト項目の先頭の、アンカーの後ろの段落',
      `<ul><li><a name="x"></a><p>${IMG}</p></li></ul>`,
      [['bulletList', ['listItem', ['paragraph'], ['image']]]],
    ],
    [
      'リスト項目の先頭の、HTML コメントの後ろの段落',
      `<ul><li><!-- image --><p>${IMG}</p><p>後</p></li></ul>`,
      [['bulletList', ['listItem', ['paragraph'], ['image'], ['paragraph', '後']]]],
    ],
    [
      'リスト項目の先頭の、div で包まれた動画だけの段落',
      `<ul><li><div><p>${VIDEO}</p></div></li></ul>`,
      [['bulletList', ['listItem', ['paragraph'], ['youtube']]]],
    ],
    [
      '読み込めない画像だけ',
      '<p>前</p><p><img src="blob:https://example.com/x"></p><p>後</p>',
      [['paragraph', '前'], ['paragraph'], ['paragraph', '後']],
    ],
    [
      'YouTube 以外の iframe だけ',
      '<p>前</p><p><iframe src="https://example.com/embed"></iframe></p><p>後</p>',
      [['paragraph', '前'], ['paragraph'], ['paragraph', '後']],
    ],
  ])('%s は今までどおりに読む', (_, html, expected) => {
    expect(parse(html)).toEqual(expected)
  })
})
