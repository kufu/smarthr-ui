
import { SideMenu, SideMenuItem } from '..'
import { FaMessageIcon } from '../../Icon'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SideMenu/SideMenuItem',
  component: SideMenuItem,
  render: (args) => (
    <SideMenu>
      <SideMenuItem {...args} href="#">
        メニュー1
      </SideMenuItem>
    </SideMenu>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SideMenuItem>

export const Playground: StoryObj<typeof SideMenu> = {}

export const Current: StoryObj<typeof SideMenuItem> = {
  name: 'current',
  args: {
    current: true,
  },
}

export const Prefix: StoryObj<typeof SideMenuItem> = {
  args: {
    prefix: <FaMessageIcon />,
  },
}

export const Suffix: StoryObj<typeof SideMenuItem> = {
  args: {
    suffix: <FaMessageIcon />,
  },
}
