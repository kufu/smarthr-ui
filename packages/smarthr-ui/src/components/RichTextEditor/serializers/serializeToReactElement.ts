import { renderToReactElement as tiptapRenderToReactElement } from '@tiptap/static-renderer'
import { type ReactNode, createElement } from 'react'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import type { RichTextJSON } from '../types'
import type { Mark, Node } from '@tiptap/pm/model'
import type { AnyExtension } from '@tiptap/react'

type ReactNodeMapping = (ctx: { node: Node; children?: ReactNode | ReactNode[] }) => ReactNode

type ReactMarkMapping = (ctx: { mark: Mark; children?: ReactNode | ReactNode[] }) => ReactNode

const SAFE_LINK_TARGETS = new Set(['_blank', '_self', '_parent', '_top'])

const isSafeUrl = (url: unknown): url is string =>
  typeof url === 'string' && /^https?:\/\/|^mailto:/i.test(url.trim())

const isSafeImageSrc = (src: unknown): src is string =>
  typeof src === 'string' && /^https?:\/\//i.test(src)

const isSafeYoutubeSrc = (src: unknown): src is string =>
  typeof src === 'string' &&
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\//i.test(src)

const isSafeColor = (color: unknown): color is string =>
  typeof color === 'string' &&
  (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ||
    /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(color) ||
    /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(?:0|1|0?\.\d+)\s*\)$/i.test(color))

const isSafeFontSize = (fontSize: unknown): fontSize is string =>
  typeof fontSize === 'string' && /^\d+(\.\d+)?px$/.test(fontSize)

const parseNumericAttr = (value: unknown): number | undefined => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)) return parseFloat(value)
  return undefined
}

let cachedExtensions: AnyExtension[] | null = null

const getOrCreateExtensions = () => {
  if (!cachedExtensions) {
    cachedExtensions = configureExtensions({ features: ALL_FEATURES })
  }
  return cachedExtensions
}

const nodeMapping: Record<string, ReactNodeMapping> = {
  heading: ({ node, children }) => {
    const level = Math.min(Math.max(Number(node.attrs.level) || 2, 1), 4) as 1 | 2 | 3 | 4
    const textAlign = node.attrs.textAlign as string | undefined
    const style = textAlign && textAlign !== 'left' ? { textAlign } : undefined
    return createElement(`h${level}`, { style }, children)
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
    const src = node.attrs.src
    const width = typeof node.attrs.width === 'number' ? node.attrs.width : 640
    const height = typeof node.attrs.height === 'number' ? node.attrs.height : 480
    return createElement(
      'div',
      null,
      createElement('iframe', {
        src: isSafeYoutubeSrc(src) ? src : undefined,
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
}

const markMapping: Record<string, ReactMarkMapping> = {
  link: ({ mark, children }) => {
    const href = mark.attrs.href
    return createElement(
      'a',
      {
        href: isSafeUrl(href) ? href : undefined,
        target: SAFE_LINK_TARGETS.has(mark.attrs.target as string)
          ? (mark.attrs.target as string)
          : undefined,
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
    content: json,
    extensions: getOrCreateExtensions(),
    options: { nodeMapping, markMapping },
  })
