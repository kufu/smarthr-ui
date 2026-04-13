import { generateJSON } from '@tiptap/html'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import type { ExternalRichTextValue } from '../types'
import type { JSONContent } from '@tiptap/core'
import type { AnyExtension } from '@tiptap/react'

const EMPTY_DOC: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

let cachedExtensions: AnyExtension[] | null = null

const getOrCreateExtensions = () => {
  if (!cachedExtensions) {
    cachedExtensions = configureExtensions({ features: ALL_FEATURES })
  }
  return cachedExtensions
}

export const normalizeToJSON = (value?: ExternalRichTextValue): JSONContent => {
  if (!value || value.format === 'empty') return EMPTY_DOC
  if (value.format === 'json') return value.content
  return generateJSON(value.content, getOrCreateExtensions())
}
