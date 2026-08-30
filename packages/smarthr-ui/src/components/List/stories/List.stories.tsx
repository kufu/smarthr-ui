import { Button } from '../../Button'
import { FaPencilIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { List } from '../List'
import { ListItem, ListItemAnchor } from '../ListItem'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/List',
  component: List,
  subcomponents: { ListItem, ListItemAnchor },
  render: (args) => <List {...args} />,
  args: {
    children: (
      <>
        <ListItem
          heading="タイトル"
          status={<StatusLabel>完了</StatusLabel>}
          action={
            <Button>
              <FaPencilIcon alt="編集" />
            </Button>
          }
        >
          説明テキスト
        </ListItem>
        <ListItem heading="タイトル" status={<StatusLabel>完了</StatusLabel>}>
          説明テキスト
        </ListItem>
        <ListItemAnchor heading="タイトル" status={<StatusLabel>完了</StatusLabel>} href="#1">
          説明テキスト
        </ListItemAnchor>
      </>
    ),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof List>

export const Playground: StoryObj<typeof List> = {}

export const Divider: StoryObj<typeof List> = {
  name: 'divider',
  render: (args) => (
    <Stack>
      {(['full', 'content', false] as const).map((divider) => (
        <List {...args} key={String(divider)} divider={divider} />
      ))}
    </Stack>
  ),
}
