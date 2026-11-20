import { getRichTextExtensions } from './richTextSchema'
import { createEmptyDocument, isRecord } from './sanitizeRichTextJSON'

import type { RichTextJSON, RichTextValue } from '../types'

import { generateJSON } from '#html'

const isRichTextJSON = (value: unknown): value is RichTextJSON =>
  isRecord(value) && value.type === 'doc'

const fallback = (value: unknown): RichTextJSON => {
  // null・undefined で警告しないのは、データが無いことを表す値として渡されるため
  if (value !== null && value !== undefined) {
    console.warn('[RichTextEditor] 解決できない値を空の文書として扱います', value)
  }

  return createEmptyDocument()
}

/**
 * 解決できない値で例外を投げないのは、型を通らない JS の利用者や壊れた保存データからも呼ばれるため。
 * type を先に見ないのは、format 付きの値に type が混ざっていても format の指定を優先するため
 */
export const resolveRichTextValue = (value: RichTextValue | null | undefined): RichTextJSON => {
  if (!isRecord(value)) return fallback(value)

  if ('format' in value) {
    if (value.format === 'empty') return createEmptyDocument()
    if (value.format === 'json' && isRichTextJSON(value.content)) return value.content
    if (value.format === 'html' && typeof value.content === 'string') {
      try {
        return generateJSON(value.content, getRichTextExtensions()) as RichTextJSON
      } catch {
        return fallback(value)
      }
    }

    return fallback(value)
  }

  return isRichTextJSON(value) ? value : fallback(value)
}

/**
 * 包みのオブジェクトの参照で比べないのは、`{ format, content }` を描画のたびに作ると中身が同じでも
 * 別物になるため。文字列に結合しないのは、`'123'` と `123` のような型の違いを取りこぼし、
 * 文字列化できない値で例外を投げるため
 */
export const getValueKeys = (
  value: RichTextValue | null | undefined,
): readonly [unknown, unknown] => {
  if (!isRecord(value) || !('format' in value)) return [undefined, value]

  return value.format === 'empty' ? ['empty', undefined] : [value.format, value.content]
}

export const getHtmlContent = (value: RichTextValue | null | undefined): string | undefined =>
  isRecord(value) &&
  'format' in value &&
  value.format === 'html' &&
  typeof value.content === 'string'
    ? value.content
    : undefined

export const isNoDataValue = (value: RichTextValue | null | undefined) =>
  value === null ||
  value === undefined ||
  (isRecord(value) && 'format' in value && value.format === 'empty') ||
  getHtmlContent(value)?.trim() === ''
