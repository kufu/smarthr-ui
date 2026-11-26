import { describe, expect, it } from 'vitest'

import { getRichTextSchema } from '../serializers/richTextSchema'

import { BLOCK_CATALOG, describeBlock, matchesBlockQuery } from './blockCatalog'
import { SUPPORTED_HEADING_LEVELS } from './configureHeading'

import type { Node as PMNode } from '@tiptap/pm/model'

const createTopLevelSamples = (): PMNode[] => {
  const schema = getRichTextSchema()
  const topLevelTypes = Object.values(schema.nodes).filter(
    (type) => schema.topNodeType.contentMatch.matchType(type) !== null,
  )

  return topLevelTypes.flatMap((type) =>
    type.name === 'heading'
      ? SUPPORTED_HEADING_LEVELS.map((level) => type.create({ level }))
      : [type.createAndFill()!],
  )
}

const search = (query: string) =>
  BLOCK_CATALOG.filter((entry) =>
    matchesBlockQuery({ label: entry.label.defaultText, keywords: entry.keywords }, query),
  ).map(({ id }) => id)

describe('BLOCK_CATALOG', () => {
  it.each(createTopLevelSamples().map((node) => [JSON.stringify(node.toJSON()), node] as const))(
    '最上位に置けるノード %s は、ちょうど1つのエントリに当たり、読み上げでその名前を使う',
    (_, node) => {
      const matched = BLOCK_CATALOG.filter((entry) => entry.matches(node))

      expect(matched).toHaveLength(1)
      expect(describeBlock(node).blockId).toBe(matched[0].id)
    },
  )

  it.each([
    { query: 'みだし', expected: ['heading1', 'heading2', 'heading3', 'heading4'] },
    { query: 'ミダシ', expected: ['heading1', 'heading2', 'heading3', 'heading4'] },
    { query: 'ｈ１', expected: ['heading1'] },
    { query: 'list', expected: ['bulletList', 'orderedList'] },
    { query: 'LIST', expected: ['bulletList', 'orderedList'] },
    { query: '引用', expected: ['blockquote'] },
  ])('「$query」で絞り込むと $expected が当たる', ({ query, expected }) => {
    expect(search(query)).toEqual(expected)
  })

  it('検索語が空ならすべてが当たる', () => {
    expect(search('')).toHaveLength(BLOCK_CATALOG.length)
  })
})
