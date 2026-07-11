import { Button } from '../../Button'
import { FaPencilIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { List } from '../List'
import { ListItem, ListItemAnchor } from '../ListItem'

import type { Meta, StoryObj } from '@storybook/react-vite'

const Template = ({ id }: { id?: string }) => (
  <Stack id={id}>
    {(['full', 'content', false] as const).map((divider) => (
      <List key={String(divider)}>
        <ListItem
          heading="タイトル"
          status={<StatusLabel>完了</StatusLabel>}
          action={
            <Button>
              <FaPencilIcon alt="編集" />
            </Button>
          }
          divider={divider}
        >
          説明テキスト
        </ListItem>
        <ListItem heading="タイトル" status={<StatusLabel>完了</StatusLabel>} divider={divider}>
          説明テキスト
        </ListItem>
        <ListItem heading="タイトル" divider={divider}>
          説明テキスト
        </ListItem>
        <ListItemAnchor
          heading="タイトル"
          status={<StatusLabel>完了</StatusLabel>}
          href="#item"
          divider={divider}
        >
          説明テキスト
        </ListItemAnchor>
        <ListItemAnchor heading="タイトル" href="#item" divider={divider}>
          説明テキスト
        </ListItemAnchor>
      </List>
    ))}
  </Stack>
)

export default {
  title: 'Components/List/VRT',
  render: () => <Template />,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta

export const VRT = {}

export const VRTHover: StoryObj = {
  render: () => (
    <>
      <Template id="hover" />
      <Template id="focus-visible" />
    </>
  ),
  parameters: {
    pseudo: {
      hover: ['#hover .smarthr-ui-ListItem a'],
      focusVisible: ['#focus-visible .smarthr-ui-ListItem a'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
