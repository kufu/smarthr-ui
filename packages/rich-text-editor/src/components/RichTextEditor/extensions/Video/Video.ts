import { Node, fromString } from '@tiptap/core'

import { isSafeVideoSrc, parseNumericAttr } from '../../serializers/safeAttributes'
import { VIDEO_ALIGN_STYLES, parseMediaAlign, toMediaAlignStyleText } from '../mediaAlign'
import { parseParagraphMediaAlign } from '../mediaOnlyParagraph'
import { parseMediaSize } from '../parseMediaSize'

import { readVideoSrc } from './readVideoSrc'

const parseSize = (element: HTMLElement) =>
  parseMediaSize(element, (property) => fromString(element.getAttribute(property)))

/**
 * width/height 属性だけで縦横比を決めないのは、ポスター画像を出している間はその画像の比率で高さが決まり、
 * 保存した大きさと見た目がずれるため
 */
export const toVideoAspectRatio = (width: unknown, height: unknown): string | undefined => {
  const w = parseNumericAttr(width)
  const h = parseNumericAttr(height)

  return w && h ? `${w} / ${h}` : undefined
}

/** crossorigin を付けないのは、付けると CORS のモードになり、配信元の署名 Cookie が送られないため */
export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null, parseHTML: readVideoSrc },
      poster: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const poster = element.getAttribute('poster')

          return isSafeVideoSrc(poster) ? poster : null
        },
      },
      title: { default: null, parseHTML: (element: HTMLElement) => element.getAttribute('title') },
      width: { default: null, parseHTML: (element: HTMLElement) => parseSize(element).width },
      height: { default: null, parseHTML: (element: HTMLElement) => parseSize(element).height },
      align: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          parseMediaAlign(element.closest<HTMLElement>('div[data-video]')) ??
          parseParagraphMediaAlign(element),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: (element: HTMLElement) => (isSafeVideoSrc(readVideoSrc(element)) ? null : false),
      },
    ]
  },

  renderHTML({ node }) {
    const { src, poster, title, width, height, align } = node.attrs
    const style = toMediaAlignStyleText(VIDEO_ALIGN_STYLES, align)
    const aspectRatio = toVideoAspectRatio(width, height)

    return [
      'div',
      style ? { 'data-video': '', style } : { 'data-video': '' },
      [
        'video',
        {
          src,
          poster,
          title,
          width,
          height,
          style: aspectRatio ? `aspect-ratio: ${aspectRatio}` : null,
          controls: '',
          preload: 'metadata',
          playsinline: '',
        },
      ],
    ]
  },
})
