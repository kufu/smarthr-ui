import { describe, expect, it } from 'vitest'

import { getRichTextSchema } from '../serializers/richTextSchema'

import { createTypeAllowChecker } from './restrictOperations'

describe('createTypeAllowChecker', () => {
  it('features が空でも許可する schema のノードとマークは、基盤と属性の入れ物だけ', () => {
    const schema = getRichTextSchema()
    const names = [...Object.keys(schema.nodes), ...Object.keys(schema.marks)]

    expect(names.filter(createTypeAllowChecker([])).sort()).toEqual([
      'doc',
      'hardBreak',
      'paragraph',
      'text',
      'textStyle',
    ])
  })
})
