import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import { sanitizeRichTextJSON } from './sanitizeRichTextJSON'

import type { JSONContent } from '@tiptap/core'
import type { AnyExtension } from '@tiptap/react'

import { generateHTML } from '#html'

let cachedExtensions: AnyExtension[] | null = null

const getOrCreateExtensions = () => {
  if (!cachedExtensions) {
    cachedExtensions = configureExtensions({ features: ALL_FEATURES })
  }
  return cachedExtensions
}

export const serializeToHTML = (value: JSONContent): string =>
  generateHTML(sanitizeRichTextJSON(value), getOrCreateExtensions())
