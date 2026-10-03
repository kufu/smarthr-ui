import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import type { ExternalRichTextValue } from '../types'
import type { JSONContent } from '@tiptap/core'
import type { AnyExtension } from '@tiptap/react'

import { generateJSON } from '#html'

let cachedExtensions: AnyExtension[] | null = null

const getOrCreateExtensions = () => {
  if (!cachedExtensions) {
    cachedExtensions = configureExtensions({ features: ALL_FEATURES })
  }
  return cachedExtensions
}

export const normalizeToJSON = (value?: ExternalRichTextValue): JSONContent => {
  if (value?.format === 'json') return value.content
  if (value?.format === 'html') return generateJSON(value.content, getOrCreateExtensions())
  // 型を通らない JS の利用者から format の無い値が来ても、中身を文字列として解釈しない
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}
