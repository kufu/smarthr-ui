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
          status={<StatusLabel>完了</StatusLabel>}
          action={
            <Button>
              <FaPencilIcon alt="編集" />
            </Button>
          }
          divider={divider}
          heading="タイトル"
        >
          説明テキスト
        </ListItem>
        <ListItem status={<StatusLabel>完了</StatusLabel>} divider={divider} heading="タイトル">
          説明テキスト
        </ListItem>
        <ListItem divider={divider} heading="タイトル">
          説明テキスト
        </ListItem>
        <ListItemAnchor
          href="#item"
          status={<StatusLabel>完了</StatusLabel>}
          divider={divider}
          heading="タイトル"
        >
          説明テキスト
        </ListItemAnchor>
        <ListItemAnchor href="#item" divider={divider} heading="タイトル">
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
