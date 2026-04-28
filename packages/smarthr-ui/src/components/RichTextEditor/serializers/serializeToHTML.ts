import { generateHTML } from '@tiptap/html'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import type { JSONContent } from '@tiptap/core'
import type { AnyExtension } from '@tiptap/react'

let cachedExtensions: AnyExtension[] | null = null

const getOrCreateExtensions = () => {
  if (!cachedExtensions) {
    cachedExtensions = configureExtensions({ features: ALL_FEATURES })
  }
  return cachedExtensions
}

export const serializeToHTML = (value: JSONContent): string =>
  generateHTML(value, getOrCreateExtensions())
