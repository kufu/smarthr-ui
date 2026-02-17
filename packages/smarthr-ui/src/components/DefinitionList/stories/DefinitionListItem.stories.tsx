import { DefinitionList } from '../DefinitionList'
import { DefinitionListItem } from '../DefinitionListItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/DefinitionList/DefinitionListItem',
  component: DefinitionListItem,
  render: (args) => <DefinitionListItem {...args} />,
  argTypes: {
    term: { control: 'text' },
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

export const TermStyleType: StoryObj<typeof DefinitionListItem> = {
  name: 'term.styleType',
  args: {
    term: {
      text: '定義リストアイテム',
      styleType: 'blockTitle',
    },
    children: undefined,
  },
}

export const Children: StoryObj<typeof DefinitionListItem> = {
  name: 'children',
  args: {
    children: '定義リストアイテム説明',
  },
}

export const MaxColumns: StoryObj<typeof DefinitionListItem> = {
  name: 'maxColumns',
  render: (args) => (
    <DefinitionList>
      <DefinitionListItem {...args} maxColumns={1} term="定義リストアイテム1" />
      <DefinitionListItem {...args} maxColumns={2} term="定義リストアイテム2" />
      <DefinitionListItem {...args} maxColumns={2} term="定義リストアイテム3" />
      <DefinitionListItem {...args} maxColumns={3} term="定義リストアイテム4" />
      <DefinitionListItem {...args} maxColumns={3} term="定義リストアイテム5" />
      <DefinitionListItem {...args} maxColumns={3} term="定義リストアイテム6" />
    </DefinitionList>
  ),
}

export const FullWidth: StoryObj<typeof DefinitionListItem> = {
  name: 'fullWidth',
  render: (args) => (
    <DefinitionList>
      <DefinitionListItem {...args} maxColumns={1} term="定義リストアイテム1" />
      <DefinitionListItem {...args} maxColumns={2} term="定義リストアイテム2" />
      <DefinitionListItem
        {...args}
        maxColumns={2}
        term="定義リストアイテム3（fullwidth）"
        fullWidth
      />
      <DefinitionListItem {...args} maxColumns={3} term="定義リストアイテム4" />
      <DefinitionListItem {...args} maxColumns={3} term="定義リストアイテム5" />
      <DefinitionListItem {...args} maxColumns={3} term="定義リストアイテム6" />
    </DefinitionList>
  ),
}
