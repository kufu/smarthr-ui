import { getText, getTextSerializersFromSchema } from '@tiptap/core'

import type { TextSerializer } from '@tiptap/core'
import type { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model'

// editor.getText() は使わない。読んだ時点の文書しか扱えず、通知した時点の文書を後から変換できないため
const textSerializers = new WeakMap<Schema, Record<string, TextSerializer>>()

export const getPlainText = (doc: ProseMirrorNode, schema: Schema, blockSeparator = '\n\n') => {
  let serializers = textSerializers.get(schema)

  if (!serializers) {
    serializers = getTextSerializersFromSchema(schema)
    textSerializers.set(schema, serializers)
  }

  return getText(doc, { blockSeparator, textSerializers: serializers })
}
