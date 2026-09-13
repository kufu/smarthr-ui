import { getEmbedUrlFromYoutubeUrl } from '@tiptap/extension-youtube'
import { renderToReactElement as tiptapRenderToReactElement } from '@tiptap/static-renderer'
import { type ReactNode, createElement } from 'react'

import { isAllowedLineHeight } from '../extensions/LineHeight'
import { YOUTUBE_EMBED_OPTIONS } from '../extensions/youtubeOptions'

import { getRichTextExtensions } from './richTextSchema'
import {
  isSafeColor,
  isSafeFontSize,
  isSafeImageSrc,
  isSafeLinkTarget,
  isSafeTextAlign,
  isSafeUrl,
  isSafeYoutubeSrc,
  parseNumericAttr,
} from './safeAttributes'
import { sanitizeRichTextJSON } from './sanitizeRichTextJSON'

import type { RichTextJSON } from '../types'
import type { Mark, Node } from '@tiptap/pm/model'

type ReactNodeMapping = (ctx: { node: Node; children?: ReactNode | ReactNode[] }) => ReactNode

type ReactMarkMapping = (ctx: { mark: Mark; children?: ReactNode | ReactNode[] }) => ReactNode

/**
 * @tiptap/static-renderer の既定マッピングは拡張の renderHTML が返すHTML属性名をそのまま
 * React へ渡すため、colspan/rowspan が unknown property の警告になる。
 */
const createTableCellMapping =
  (tag: 'td' | 'th'): ReactNodeMapping =>
  ({ node, children }) => {
    const { colspan, rowspan, colwidth, align, color, backgroundColor } = node.attrs
    const style: Record<string, string> = {}

    if (isSafeTextAlign(align)) style.textAlign = align
    if (isSafeColor(color)) style.color = color
    if (isSafeColor(backgroundColor)) style.backgroundColor = backgroundColor

    return createElement(
      tag,
      {
        colSpan: typeof colspan === 'number' ? colspan : undefined,
        rowSpan: typeof rowspan === 'number' ? rowspan : undefined,
        colwidth: Array.isArray(colwidth) ? colwidth.join(',') : undefined,
        style: Object.keys(style).length > 0 ? style : undefined,
      },
      children,
    )
  }

/**
 * watch や youtu.be のURLは iframe に置いても再生できないため、埋め込み用へ変換する。
 * 変換に失敗したときに元のURLへ戻さないのは、検証を通っていない値を出さないため。
 */
const toEmbedUrl = (src: unknown, start: unknown): string | undefined => {
  if (!isSafeYoutubeSrc(src)) return undefined

  const startAt = typeof start === 'number' && Number.isFinite(start) && start >= 0 ? start : 0
  const embedUrl = getEmbedUrlFromYoutubeUrl({ ...YOUTUBE_EMBED_OPTIONS, url: src, startAt })

  return isSafeYoutubeSrc(embedUrl) ? embedUrl : undefined
}

const nodeMapping: Record<string, ReactNodeMapping> = {
  heading: ({ node, children }) => {
    const level = Math.min(Math.max(Number(node.attrs.level) || 2, 1), 4) as 1 | 2 | 3 | 4
    const textAlign = node.attrs.textAlign
    const style: Record<string, string> = {}
    if (isSafeTextAlign(textAlign) && textAlign !== 'left') style.textAlign = textAlign
    if (isAllowedLineHeight(node.attrs.lineHeight)) style.lineHeight = node.attrs.lineHeight
    return createElement(
      `h${level}`,
      { style: Object.keys(style).length > 0 ? style : undefined },
      children,
    )
  },
  image: ({ node }) => {
    const src = node.attrs.src
    const width = parseNumericAttr(node.attrs.width)
    const height = parseNumericAttr(node.attrs.height)
    return createElement('img', {
      src: isSafeImageSrc(src) ? src : undefined,
      alt: typeof node.attrs.alt === 'string' ? node.attrs.alt : '',
      width,
      height,
      style: width ? { maxWidth: '100%', height: 'auto' } : undefined,
    })
  },
  youtube: ({ node }) => {
    const width = typeof node.attrs.width === 'number' ? node.attrs.width : 640
    const height = typeof node.attrs.height === 'number' ? node.attrs.height : 480
    return createElement(
      'div',
      { 'data-youtube-video': '' },
      createElement('iframe', {
        src: toEmbedUrl(node.attrs.src, node.attrs.start),
        width,
        height,
        allowFullScreen: true,
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        sandbox: 'allow-scripts allow-same-origin allow-popups',
        style: { border: 0, maxWidth: '100%', aspectRatio: `${width} / ${height}` },
      }),
    )
  },
  tableCell: createTableCellMapping('td'),
  tableHeader: createTableCellMapping('th'),
}

const markMapping: Record<string, ReactMarkMapping> = {
  link: ({ mark, children }) => {
    const href = mark.attrs.href
    return createElement(
      'a',
      {
        href: isSafeUrl(href) ? href : undefined,
        target: isSafeLinkTarget(mark.attrs.target) ? mark.attrs.target : undefined,
        rel: 'noopener noreferrer',
      },
      children,
    )
  },
  textStyle: ({ mark, children }) => {
    const style: Record<string, string> = {}
    if (isSafeColor(mark.attrs.color)) style.color = mark.attrs.color
    if (isSafeColor(mark.attrs.backgroundColor)) style.backgroundColor = mark.attrs.backgroundColor
    if (isSafeFontSize(mark.attrs.fontSize)) style.fontSize = mark.attrs.fontSize
    return createElement(
      'span',
      { style: Object.keys(style).length > 0 ? style : undefined },
      children,
    )
  },
}

export const serializeToReactElement = (json: RichTextJSON): ReactNode =>
  tiptapRenderToReactElement({
    content: sanitizeRichTextJSON(json),
    extensions: getRichTextExtensions(),
    options: { nodeMapping, markMapping },
  })
