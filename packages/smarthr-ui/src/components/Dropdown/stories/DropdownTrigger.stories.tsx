import { Button } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Dropdown/DropdownTrigger',
  component: DropdownTrigger,
  render: (args) => (
    <Dropdown>
      <DropdownTrigger {...args}>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent>ドロップダウンパネル</DropdownContent>
    </Dropdown>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DropdownTrigger>

export const DropdownTriggerControl: StoryObj<typeof DropdownTrigger> = {
  name: 'Playground',
  args: {},
}
