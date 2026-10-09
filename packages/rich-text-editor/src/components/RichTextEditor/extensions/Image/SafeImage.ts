import { Image } from '@tiptap/extension-image'

import { isSafeImageSrc } from '../../serializers/safeAttributes'
import { IMAGE_ALIGN_STYLES, parseImageAlign, toMediaAlignStyleText } from '../mediaAlign'

/**
 * schema と HTML の読み書きに効く部分だけを持つ画像ノード。
 * 表示側の serializer が NodeView などエディタ専用の処理まで読み込まないよう CustomImage から分けている。
 */
export const SafeImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: (element: HTMLElement) => parseImageAlign(element),
        renderHTML: (attributes: Record<string, unknown>) => {
          const style = toMediaAlignStyleText(IMAGE_ALIGN_STYLES, attributes.align)

          return style ? { style } : {}
        },
      },
    }
  },

  // 標準は data: を除くだけで、blob: や相対パスの画像は取り込まれて保存後の表示で落ちる
  parseHTML() {
    return (this.parent?.() ?? []).map((rule) => ({
      ...rule,
      getAttrs: (element: HTMLElement) =>
        isSafeImageSrc(element.getAttribute('src')) ? null : false,
    }))
  },
})
