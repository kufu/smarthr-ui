import { getSchema, getTextSerializersFromSchema } from '@tiptap/core'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import type { TextSerializer } from '@tiptap/core'
import type { Schema } from '@tiptap/pm/model'
import type { AnyExtension } from '@tiptap/react'

let cachedExtensions: AnyExtension[] | null = null
let cachedSchema: Schema | null = null
let cachedTextSerializers: Record<string, TextSerializer> | null = null

/**
 * シリアライザーが使う全書式の extensions。
 * features で絞らないのは、入力に含まれる書式を落とさずに出力するため。
 */
export const getRichTextExtensions = (): AnyExtension[] => {
  if (!cachedExtensions) {
    cachedExtensions = configureExtensions({ features: ALL_FEATURES })
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
