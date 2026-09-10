import { generateHTML } from '@tiptap/html'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import {
  isNumericAttr,
  isSafeColor,
  isSafeFontSize,
  isSafeImageSrc,
  isSafeLinkTarget,
  isSafeTextAlign,
  isSafeUrl,
  isSafeYoutubeSrc,
} from './safeAttributes'

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
 * ノード/マークの型ごとに、信頼できない属性値の判定を対応づける。
 *
 * Tiptap拡張の renderHTML は属性を style や属性値へそのまま展開するため、
 * 直接JSONを渡された場合に `color: 'red;position:fixed'` のようなCSS宣言の追記が
 * そのまま出力される。React経路（serializeToReactElement）は nodeMapping/markMapping で
 * 同じ判定を行っているので、HTML経路でもシリアライズ前に同じallowlistを適用する。
 *
 * href・youtube の src・lineHeight は拡張側の renderHTML でも落ちるが、
 * 拡張の実装変更に依存しないよう明示的に検証する。
 */
const ATTR_GUARDS: Record<string, Record<string, (value: unknown) => boolean>> = {
  // ノード
  image: { src: isSafeImageSrc, width: isNumericAttr, height: isNumericAttr },
  youtube: { src: isSafeYoutubeSrc },
  paragraph: { textAlign: isSafeTextAlign },
  heading: { textAlign: isSafeTextAlign },
  // マーク
  link: { href: isSafeUrl, target: isSafeLinkTarget },
  textStyle: { color: isSafeColor, backgroundColor: isSafeColor, fontSize: isSafeFontSize },
}

/** 危険な値を null にして拡張のデフォルトへ戻す（キー削除ではTiptapのattrs解決に乗らない） */
const sanitizeAttrs = (
  type: string | undefined,
  attrs: Record<string, unknown>,
): Record<string, unknown> => {
  const guards = type ? ATTR_GUARDS[type] : undefined
  if (!guards) return attrs

  return Object.entries(guards).reduce((acc, [key, isSafe]) => {
    if (acc[key] === null || acc[key] === undefined || isSafe(acc[key])) return acc

    return { ...acc, [key]: null }
  }, attrs)
}

const sanitizeNode = (node: JSONContent): JSONContent => ({
  ...node,
  ...(node.attrs ? { attrs: sanitizeAttrs(node.type, node.attrs) } : {}),
  ...(node.marks
    ? {
        marks: node.marks.map((mark) =>
          mark.attrs ? { ...mark, attrs: sanitizeAttrs(mark.type, mark.attrs) } : mark,
        ),
      }
    : {}),
  ...(node.content ? { content: node.content.map(sanitizeNode) } : {}),
})

export const serializeToHTML = (value: JSONContent): string =>
  generateHTML(sanitizeNode(value), getOrCreateExtensions())
