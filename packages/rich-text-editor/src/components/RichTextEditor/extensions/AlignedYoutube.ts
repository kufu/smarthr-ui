import { Youtube } from '@tiptap/extension-youtube'

import { parseNumericAttr } from '../serializers/safeAttributes'

import { YOUTUBE_ALIGN_STYLES, parseMediaAlign, toMediaAlignStyleText } from './mediaAlign'
import { parseMediaSize } from './parseMediaSize'
import { calcYoutubeHeight, calcYoutubeWidth, toYoutubeIframeSizeStyle } from './youtubeOptions'
import { isYoutubeEmbedSrc, normalizeYoutubeUrl } from './youtubeUrl'

import type { Attributes } from '@tiptap/core'

// 片側だけ指定された iframe は、欠けた側が既定値で埋まって 320×360 のように比率が崩れる
const completeDimensions = (width: unknown, height: unknown) => {
  const numericWidth = parseNumericAttr(width)
  const numericHeight = parseNumericAttr(height)

  return {
    width: width ?? (numericHeight ? calcYoutubeWidth(numericHeight) : null),
    height: height ?? (numericWidth ? calcYoutubeHeight(numericWidth) : null),
  }
}

/**
 * 標準の renderHTML はノードの属性をすべて iframe へ渡す。align は外側の div に付けるため、
 * 属性としては出さずに renderHTML で div へ足す。
 */
export const AlignedYoutube = Youtube.extend({
  addAttributes() {
    const parent: Attributes = this.parent?.() ?? {}
    const parseDimensions = (element: HTMLElement) => {
      const { width, height } = parseMediaSize(element, (property) =>
        parent[property]?.parseHTML?.(element),
      )

      return completeDimensions(width, height)
    }

    return {
      ...parent,
      // 拡張はプロトコルを省いた src を URL として解釈できず、開始位置を 0 にする
      start: {
        ...parent.start,
        parseHTML: (element: HTMLElement) =>
          normalizeYoutubeUrl(element.getAttribute('src'))?.start ??
          parent.start?.parseHTML?.(element),
      },
      width: {
        ...parent.width,
        parseHTML: (element: HTMLElement) => parseDimensions(element).width,
      },
      height: {
        ...parent.height,
        parseHTML: (element: HTMLElement) => parseDimensions(element).height,
      },
      align: {
        default: null,
        // parse の対象は iframe なので、寄せ方を持つ外側の div を読む
        parseHTML: (element: HTMLElement) =>
          parseMediaAlign(element.closest<HTMLElement>('div[data-youtube-video]')),
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    // this.parent を呼ばないのは、extend するたびに親の規則が重なって入るため
    return [
      { tag: 'div[data-youtube-video] iframe' },
      {
        tag: 'iframe',
        getAttrs: (element) => (isYoutubeEmbedSrc(element.getAttribute('src')) ? null : false),
      },
    ]
  },

  renderHTML(props) {
    const [tag, attributes, iframe] = this.parent?.(props) as [
      string,
      Record<string, unknown>,
      [string, Record<string, unknown>],
    ]
    const style = toMediaAlignStyleText(YOUTUBE_ALIGN_STYLES, props.node.attrs.align)
    const sizeStyle = toYoutubeIframeSizeStyle(props.node.attrs.width, props.node.attrs.height)
    const [iframeTag, iframeAttributes] = iframe

    return [
      tag,
      style ? { ...attributes, style } : attributes,
      // 既定の border が残ると、max-width で縮めたときに 4px はみ出し、RichTextViewer とも見た目が揃わない
      [
        iframeTag,
        { ...iframeAttributes, style: ['border: 0', sizeStyle].filter(Boolean).join('; ') },
      ],
    ]
  },
})
