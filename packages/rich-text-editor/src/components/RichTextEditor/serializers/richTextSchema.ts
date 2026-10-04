import { getSchema, getTextSerializersFromSchema } from '@tiptap/core'

import { createSchemaExtensions } from '../extensions/schemaExtensions'

import type { AnyExtension, TextSerializer } from '@tiptap/core'
import type { Schema } from '@tiptap/pm/model'

let cachedExtensions: AnyExtension[] | null = null
let cachedSchema: Schema | null = null
let cachedTextSerializers: Record<string, TextSerializer> | null = null

export const getRichTextExtensions = (): AnyExtension[] => {
  if (!cachedExtensions) {
    cachedExtensions = createSchemaExtensions()
  }

  return cachedExtensions
}

export const getRichTextSchema = (): Schema => {
  if (!cachedSchema) {
    cachedSchema = getSchema(getRichTextExtensions())
  }

  return cachedSchema
}

/** hardBreak の改行など、node が自前で持つテキスト化の規則 */
export const getRichTextSerializers = (): Record<string, TextSerializer> => {
  if (!cachedTextSerializers) {
    cachedTextSerializers = getTextSerializersFromSchema(getRichTextSchema())
  }

  return cachedTextSerializers
}
