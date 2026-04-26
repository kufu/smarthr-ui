import { getSchema } from '@tiptap/core'
import { DOMSerializer, Node } from '@tiptap/pm/model'

import { ALL_FEATURES, configureExtensions } from '../extensions/configureExtensions'

import type { JSONContent } from '@tiptap/core'

let cachedSchema: ReturnType<typeof getSchema> | null = null
let cachedSerializer: DOMSerializer | null = null

const getOrCreateSchema = () => {
  if (!cachedSchema) {
    cachedSchema = getSchema(configureExtensions({ features: ALL_FEATURES }))
    cachedSerializer = DOMSerializer.fromSchema(cachedSchema)
  }
  return { schema: cachedSchema, serializer: cachedSerializer! }
}

export const serializeToHTML = (value: JSONContent): string => {
  if (typeof document === 'undefined') return ''

  const { schema, serializer } = getOrCreateSchema()
  const doc = Node.fromJSON(schema, value)
  const div = document.createElement('div')

  serializer.serializeFragment(doc.content, { document }, div)

  return div.innerHTML
}
