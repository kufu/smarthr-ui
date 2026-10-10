import { getRichTextExtensions } from './richTextSchema'

import type { ExternalRichTextValue } from '../types'
import type { JSONContent } from '@tiptap/core'

import { generateJSON } from '#html'

export const normalizeToJSON = (value?: ExternalRichTextValue): JSONContent => {
  if (value?.format === 'json') return value.content
  if (value?.format === 'html') return generateJSON(value.content, getRichTextExtensions())
  // 型を通らない JS の利用者から format の無い値が来ても、中身を文字列として解釈しない
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}
