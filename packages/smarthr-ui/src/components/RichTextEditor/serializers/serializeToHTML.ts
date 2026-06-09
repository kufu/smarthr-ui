import { generateHTML } from '@tiptap/html'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import { isSafeImageSrc } from './serializeToReactElement'

import type { JSONContent } from '@tiptap/core'
import type { AnyExtension } from '@tiptap/react'

let cachedExtensions: AnyExtension[] | null = null

const getOrCreateExtensions = () => {
  if (!cachedExtensions) {
    cachedExtensions = configureExtensions({ features: ALL_FEATURES })
  }
  return cachedExtensions
}

/**
 * 直接 JSON を渡された場合の保険。image ノードの src は Tiptap 拡張の renderHTML が
 * サニタイズしないため、serializeToReactElement と同じ allowlist で不正な src を落とす。
 * link/color/fontSize/youtube は拡張側の renderHTML が処理するため対象外。
 */
const sanitizeImageSrc = (node: JSONContent): JSONContent => {
  const sanitized: JSONContent =
    node.type === 'image' && !isSafeImageSrc(node.attrs?.src)
      ? { ...node, attrs: { ...node.attrs, src: null } }
      : node

  if (!sanitized.content) return sanitized

  return { ...sanitized, content: sanitized.content.map(sanitizeImageSrc) }
}

export const serializeToHTML = (value: JSONContent): string =>
  generateHTML(sanitizeImageSrc(value), getOrCreateExtensions())
