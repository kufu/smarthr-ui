import React from 'react'

import { DefinitionList } from '../DefinitionList'
import { DefinitionListItem } from '../DefinitionListItem'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/DefinitionList/DefinitionListItem',
  component: DefinitionListItem,
  render: (args) => <DefinitionListItem {...args} />,
  argTypes: {
    term: { control: 'text' },
    description: { control: 'text' },
    children: { control: 'text' },
    termStyleType: {
      description: 'DefinitionListItem に指定せず、DefinitionList に指定してください。',
    },
    maxColumns: {
      description: 'DefinitionListItem に指定せず、DefinitionList に指定してください。',
    },
  },
  args: {
    term: '定義リストアイテム',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} satisfies Meta<typeof DefinitionListItem>

export const Playground: StoryObj<typeof DefinitionListItem> = {
  args: {},
}

export const Term: StoryObj<typeof DefinitionListItem> = {
  name: 'term',
  args: {
    term: '定義リストアイテム',
    children: undefined,
  },
}

export const Children: StoryObj<typeof DefinitionListItem> = {
  name: 'children',
  args: {
    children: '定義リストアイテム説明',
  },
}

export const FullWidth: StoryObj<typeof DefinitionListItem> = {
  name: 'fullWidth',
  render: (args) => (
    <DefinitionList maxColumns={2}>
      <DefinitionListItem {...args} term="定義リストアイテム1" />
      <DefinitionListItem {...args} term="定義リストアイテム2" />
      <DefinitionListItem {...args} fullWidth term="定義リストアイテム3（fullwidth）" />
      <DefinitionListItem {...args} term="定義リストアイテム4" />
      <DefinitionListItem {...args} term="定義リストアイテム5" />
    </DefinitionList>
  ),
}

export const Description: StoryObj<typeof DefinitionListItem> = {
  name: 'description（非推奨）',
  args: {
    description: '定義リストアイテム説明',
    children: undefined,
  },
}
