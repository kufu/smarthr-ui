import { fromString } from '@tiptap/core'
import { Image } from '@tiptap/extension-image'

import { isSafeImageSrc } from '../../serializers/safeAttributes'
import { IMAGE_ALIGN_STYLES, parseImageAlign, toMediaAlignStyleText } from '../mediaAlign'
import { MEDIA_ONLY_PARAGRAPH_PARSE_RULES, parseParagraphMediaAlign } from '../mediaOnlyParagraph'
import { parseMediaSize } from '../parseMediaSize'

import type { Attributes } from '@tiptap/core'

/**
 * schema と HTML の読み書きに効く部分だけを持つ画像ノード。
 * 表示側の serializer が NodeView などエディタ専用の処理まで読み込まないよう CustomImage から分けている。
 */
export const SafeImage = Image.extend({
  addAttributes() {
    const parent: Attributes = this.parent?.() ?? {}
    const parseSize = (element: HTMLElement) =>
      parseMediaSize(element, (property) => fromString(element.getAttribute(property)))

    return {
      ...parent,
      // alt と title を getAttribute で読むのは、既定の読み込みが "2024" や "true" を数値・真偽値に変え、
      // 文字列でない値として sanitize で消えるため
      alt: {
        ...parent.alt,
        // 既定の null だと HTML 出力が alt 属性ごと省き、Viewer の alt="" とずれる
        default: '',
        parseHTML: (element: HTMLElement) => element.getAttribute('alt'),
      },
      title: {
        ...parent.title,
        parseHTML: (element: HTMLElement) => element.getAttribute('title'),
      },
      width: {
        ...parent.width,
        parseHTML: (element: HTMLElement) => parseSize(element).width,
      },
      height: {
        ...parent.height,
        parseHTML: (element: HTMLElement) => parseSize(element).height,
      },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          parseImageAlign(element) ?? parseParagraphMediaAlign(element),
        renderHTML: (attributes: Record<string, unknown>) => {
          const style = toMediaAlignStyleText(IMAGE_ALIGN_STYLES, attributes.align)

          return style ? { style } : {}
        },
      },
    }
  },

  // 標準は data: を除くだけで、blob: や相対パスの画像は取り込まれて保存後の表示で落ちる
  // this.parent を呼ばないのは、extend するたびに親の規則が重なって入るため
  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (element: HTMLElement) =>
          isSafeImageSrc(element.getAttribute('src')) ? null : false,
      },
      // 段落の規則だが、schema に手を入れずに足せるよう画像のノードに置く
      ...MEDIA_ONLY_PARAGRAPH_PARSE_RULES,
    ]
  },
})
