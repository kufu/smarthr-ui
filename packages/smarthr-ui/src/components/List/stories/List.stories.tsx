import { Button } from '../../Button'
import { FaPencilIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { ListItemAnchor } from '../ListItemAnchor'
import { List, ListItem } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentPropsWithoutRef } from 'react'

const _dividerOptions: Record<string, ComponentPropsWithoutRef<typeof List>['divider']> = {
  "'full'": 'full',
  "'content'": 'content',
  "{ width: 'full', last: true }": { width: 'full', last: true },
  "{ width: 'content', last: true }": { width: 'content', last: true },
  false: false,
}

export default {
  title: 'Components/List',
  component: List,
  subcomponents: { ListItem, ListItemAnchor },
  render: (args) => <List {...args} />,
  argTypes: {
    divider: {
      control: 'select',
      options: Object.keys(_dividerOptions),
      mapping: _dividerOptions,
    },
  },
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
      {Object.entries(_dividerOptions).map(([label, divider]) => (
        <List {...args} key={label} divider={divider} />
      ))}
    </Stack>
  ),
}
