import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { List } from '../List'
import { ListItemAnchor } from '../ListItem'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/List/ListItemAnchor',
  component: ListItemAnchor,
  render: (args) => (
    <List>
      <ListItemAnchor {...args} />
    </List>
  ),
  args: {
    heading: 'タイトル',
    href: '#',
    children: '説明テキスト',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ListItemAnchor>

export const Playground: StoryObj<typeof ListItemAnchor> = {}

export const Status: StoryObj<typeof ListItemAnchor> = {
  name: 'status',
  args: {
    status: <StatusLabel>完了</StatusLabel>,
  },
}

export const Divider: StoryObj<typeof ListItemAnchor> = {
  name: 'divider',
  render: (args) => (
    <Stack>
      {(['full', 'content', false] as const).map((divider) => (
        <List key={String(divider)}>
          <ListItemAnchor {...args} divider={divider} />
          <ListItemAnchor {...args} divider={divider} />
        </List>
      ))}
    </Stack>
  ),
}
