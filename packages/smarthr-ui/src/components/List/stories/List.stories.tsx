import { Button } from '../../Button'
import { FaPencilIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { ListItemAnchor } from '../ListItemAnchor'
import { List, ListItem } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef } from 'react'

const DIVIDERS: Array<ComponentPropsWithoutRef<typeof List>['divider']> = [
  'full',
  'content',
  { width: 'full', last: true },
  { width: 'content', last: true },
  false,
]

export default {
  title: 'Components/List',
  component: List,
  subcomponents: { ListItem, ListItemAnchor },
  render: (args) => <List {...args} />,
  args: {
    children: (
      <>
        <ListItem
          status={<StatusLabel>完了</StatusLabel>}
          action={
            <Button>
              <FaPencilIcon alt="編集" />
            </Button>
          }
          heading="タイトル"
        >
          説明テキスト
        </ListItem>
        <ListItem status={<StatusLabel>完了</StatusLabel>} heading="タイトル">
          説明テキスト
        </ListItem>
        <ListItemAnchor href="#1" status={<StatusLabel>完了</StatusLabel>} heading="タイトル">
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
      {DIVIDERS.map((divider) => (
        <List {...args} key={JSON.stringify(divider)} divider={divider} />
      ))}
    </Stack>
  ),
}
