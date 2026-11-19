import { Button } from '../../Button'
import { FaPencilIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { ListItemAnchor } from '../ListItemAnchor'
import { List, ListItem } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

const Template = ({ id }: { id?: string }) => (
  <Stack id={id}>
    {(['full', 'content', false] as const).map((divider) => (
      <List key={String(divider)} divider={divider}>
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
        <ListItem heading="タイトル">説明テキスト</ListItem>
        <ListItem heading="タイトル" />
        <ListItemAnchor href="#item" status={<StatusLabel>完了</StatusLabel>} heading="タイトル">
          説明テキスト
        </ListItemAnchor>
        <ListItemAnchor href="#item" heading="タイトル">
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
