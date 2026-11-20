import { getPlainText } from './getPlainText'

import type { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model'

// 文書ごとに覚える。キャレットの移動のように文書が変わらないトランザクションでも数え直すと、
// 長い本文で打鍵やキャレットの移動のたびに全文をたどることになるため
const counts = new WeakMap<ProseMirrorNode, number>()

export const getCharacterCount = (doc: ProseMirrorNode, schema: Schema): number => {
  let count = counts.get(doc)

  if (count === undefined) {
    count = getPlainText(doc, schema, '').length
    counts.set(doc, count)
  }

  return count
}
