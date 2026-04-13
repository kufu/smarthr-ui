import { serializeToHTML } from './serializeToHTML'

import type { RichTextChangeMeta, RichTextJSON } from '../types'
import type { JSONContent } from '@tiptap/core'

const extractPlainText = (json: JSONContent): string => {
  if (!json.content) return ''
  const blocks = json.content.map((block: JSONContent) => extractBlockText(block))
  return blocks.join('\n')
}

const extractBlockText = (node: JSONContent): string => {
  if (node.type === 'text') return node.text ?? ''
  if (!node.content) return ''
  return node.content.map((child: JSONContent) => extractBlockText(child)).join('')
}

export const isEmptyDocument = (json: RichTextJSON): boolean => {
  if (!json.content || json.content.length === 0) return true
  if (json.content.length === 1) {
    const first = json.content[0]
    return first.type === 'paragraph' && (!first.content || first.content.length === 0)
  }
  return false
}

export const createChangeMeta = (json: RichTextJSON): RichTextChangeMeta => {
  const html = serializeToHTML(json)
  const text = extractPlainText(json)

  return {
    json,
    html,
    text,
    isEmpty: isEmptyDocument(json),
    characterCount: text.length,
  }
}
