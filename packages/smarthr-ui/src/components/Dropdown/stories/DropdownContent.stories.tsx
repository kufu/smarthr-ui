import { Button } from '../../Button'
import { Dropdown } from '../Dropdown'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dropdown/DropdownContent',
  component: DropdownContent,
  render: (args) => (
    <Dropdown>
      <DropdownTrigger>
        <Button>ドロップダウンボタン</Button>
      </DropdownTrigger>
      <DropdownContent {...args} />
    </Dropdown>
  ),
  args: {
    controllable: false,
    children: <p>ドロップダウンパネル</p>,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DropdownContent>

export const DropdownContentControl: StoryObj<typeof DropdownContent> = {
  name: 'Playground',
  args: {},
}

export const Controllable: StoryObj<typeof DropdownContent> = {
  name: 'controllable',
  args: {
    controllable: true,
    children: <p>ドロップダウンパネル。パネル内を押しても閉じなくなります</p>,
  },
}
