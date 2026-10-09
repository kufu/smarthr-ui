import { Youtube } from '@tiptap/extension-youtube'

import { YOUTUBE_ALIGN_STYLES, parseMediaAlign, toMediaAlignStyleText } from './mediaAlign'

import type { DOMOutputSpec } from '@tiptap/pm/model'

/**
 * 標準の renderHTML はノードの属性をすべて iframe へ渡す。align は外側の div に付けるため、
 * 属性としては出さずに renderHTML で div へ足す。
 */
export const AlignedYoutube = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
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
    const output = this.parent?.(props) as [string, Record<string, unknown>, ...DOMOutputSpec[]]
    const style = toMediaAlignStyleText(YOUTUBE_ALIGN_STYLES, props.node.attrs.align)

    if (!style) return output

    const [tag, attributes, ...rest] = output

    return [tag, { ...attributes, style }, ...rest]
  },
})
