import { Youtube } from '@tiptap/extension-youtube'

import { parseNumericAttr } from '../serializers/safeAttributes'

import { YOUTUBE_ALIGN_STYLES, parseMediaAlign, toMediaAlignStyleText } from './mediaAlign'
import { calcYoutubeHeight, calcYoutubeWidth, toYoutubeIframeSizeStyle } from './youtubeOptions'

import type { Attributes } from '@tiptap/core'

type DimensionParser = (element: HTMLElement) => unknown

// 片側だけ指定された iframe は、欠けた側が既定値で埋まって 320×360 のように比率が崩れる
const completeDimension =
  (parseOwn: DimensionParser, parseOther: DimensionParser, calc: (other: number) => number) =>
  (element: HTMLElement) => {
    const own = parseOwn(element)

    if (own !== null && own !== undefined) return own

    const other = parseNumericAttr(parseOther(element))

    return other ? calc(other) : null
  }

/**
 * 標準の renderHTML はノードの属性をすべて iframe へ渡す。align は外側の div に付けるため、
 * 属性としては出さずに renderHTML で div へ足す。
 */
export const AlignedYoutube = Youtube.extend({
  addAttributes() {
    const parent: Attributes = this.parent?.() ?? {}
    const parseWidth: DimensionParser = (element) => parent.width?.parseHTML?.(element)
    const parseHeight: DimensionParser = (element) => parent.height?.parseHTML?.(element)

    return {
      ...parent,
      width: {
        ...parent.width,
        parseHTML: completeDimension(parseWidth, parseHeight, calcYoutubeWidth),
      },
      height: {
        ...parent.height,
        parseHTML: completeDimension(parseHeight, parseWidth, calcYoutubeHeight),
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
