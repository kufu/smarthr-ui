import { getSchema } from '@tiptap/core'

import { createSchemaExtensions } from '../extensions/schemaExtensions'

import type { AnyExtension } from '@tiptap/core'
import type { Schema } from '@tiptap/pm/model'

let cachedExtensions: AnyExtension[] | null = null
let cachedSchema: Schema | null = null

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
