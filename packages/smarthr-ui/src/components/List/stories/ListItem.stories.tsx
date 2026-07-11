import { Button } from '../../Button'
import { FaPencilIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { List } from '../List'
import { ListItem } from '../ListItem'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/List/ListItem',
  component: ListItem,
  render: (args) => (
    <List>
      <ListItem {...args} />
    </List>
  ),
  args: {
    heading: 'タイトル',
    children: '説明テキスト',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof ListItem>

export const Playground: StoryObj<typeof ListItem> = {}

export const Status: StoryObj<typeof ListItem> = {
  name: 'status',
  args: {
    status: <StatusLabel>完了</StatusLabel>,
  },
}

export const Action: StoryObj<typeof ListItem> = {
  name: 'action',
  args: {
    action: (
      <Button>
        <FaPencilIcon alt="編集" />
      </Button>
    ),
  },
}

export const Divider: StoryObj<typeof ListItem> = {
  name: 'divider',
  render: (args) => (
    <Stack>
      {(['full', 'content', false] as const).map((divider) => (
        <List key={String(divider)}>
          <ListItem {...args} divider={divider} />
          <ListItem {...args} divider={divider} />
        </List>
      ))}
    </Stack>
  ),
}

export const Padding: StoryObj<typeof ListItem> = {
  name: 'padding',
  render: (args) => (
    <Stack>
      {([0, 0.5, 1, 1.5] as const).map((padding) => (
        <List key={padding}>
          <ListItem {...args} padding={padding} />
        </List>
      ))}
    </Stack>
  ),
}
