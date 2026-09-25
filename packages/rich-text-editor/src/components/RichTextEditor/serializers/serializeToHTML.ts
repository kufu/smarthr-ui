import { getRichTextExtensions } from './richTextSchema'
import { sanitizeRichTextJSON } from './sanitizeRichTextJSON'

import type { JSONContent } from '@tiptap/core'

import { generateHTML } from '#html'

export const serializeToHTML = (value: JSONContent): string =>
  generateHTML(sanitizeRichTextJSON(value), getRichTextExtensions())
