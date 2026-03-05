import { Stack } from '../../Layout'
import { DefinitionList } from '../DefinitionList'
import { DefinitionListItem } from '../DefinitionListItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/DefinitionList',
  component: DefinitionList,
  render: (args) => <DefinitionList {...args} />,
  args: {
    children: (
      <>
        <DefinitionListItem term="定義リストアイテム1">定義リストアイテム1説明</DefinitionListItem>
        <DefinitionListItem term="定義リストアイテム2">定義リストアイテム2説明</DefinitionListItem>
      </>
    ),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DefinitionList>

export const Playground: StoryObj<typeof DefinitionList> = {
  args: {},
}
