import React from 'react'

import { Stack } from '../../Layout'
import { DefinitionList } from '../DefinitionList'
import { DefinitionListItem } from '../DefinitionListItem'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/DefinitionList',
  component: DefinitionList,
  render: (args) => <DefinitionList {...args} />,
  args: {
    children: (
      <DefinitionListItem term="定義リストアイテム">定義リストアイテム説明</DefinitionListItem>
    ),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DefinitionList>

export const Playground: StoryObj<typeof DefinitionList> = {
  args: {},
}

export const Items: StoryObj<typeof DefinitionList> = {
  name: 'items（非推奨）',
  args: {
    items: [
      { term: '定義リストアイテム1', description: '定義リストアイテム説明1' },
      { term: '定義リストアイテム2', description: '定義リストアイテム説明2' },
    ],
    children: undefined,
  },
}

export const MaxColumns: StoryObj<typeof DefinitionList> = {
  name: 'maxColumns',
  render: (args) => (
    <Stack gap={3}>
      {[2, 3, 4].map((maxColumns) => (
        <DefinitionList {...args} maxColumns={maxColumns} key={maxColumns}>
          {[...Array(5)].map((_, i) => (
            <DefinitionListItem term={`定義リストアイテム${i + 1}`} key={i}>
              定義リストアイテム説明{i + 1}
            </DefinitionListItem>
          ))}
        </DefinitionList>
      ))}
    </Stack>
  ),
}

export const TermStyleType: StoryObj<typeof DefinitionList> = {
  name: 'termStyleType',
  render: (args) => (
    <Stack gap={3}>
      {[undefined, 'blockTitle', 'subBlockTitle', 'subSubBlockTitle'].map((termStyleType) => (
        <DefinitionList {...args} termStyleType={termStyleType as any} key={termStyleType} />
      ))}
    </Stack>
  ),
}
