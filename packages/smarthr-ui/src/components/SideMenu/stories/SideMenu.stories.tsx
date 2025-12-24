import { SideMenu, SideMenuGroup, SideMenuItem } from '..'
import { Stack } from '../../Layout'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const meta = {
  title: 'Components/SideMenu',
  component: SideMenu,
  subcomponents: { SideMenuGroup, SideMenuItem },
  render: (args) => (
    <SideMenu {...args}>
      <SideMenuItem href="#">メニュー1</SideMenuItem>
      <SideMenuItem href="#">メニュー2</SideMenuItem>
    </SideMenu>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SideMenu>

export default meta

export const Playground: StoryObj<typeof SideMenu> = {}

export const Radius: StoryObj<typeof SideMenu> = {
  name: 'radius',
  render: (args) => (
    <Stack>
      {([undefined, 's', 'm'] as const).map((radius) => meta.render({ ...args, radius }))}
    </Stack>
  ),
}

export const Layer: StoryObj<typeof SideMenu> = {
  name: 'layer',
  render: (args) => (
    <Stack>
      {([undefined, 0, 1, 2, 3, 4] as const).map((layer) => meta.render({ ...args, layer }))}
    </Stack>
  ),
}

export const ElementAs: StoryObj<typeof SideMenu> = {
  name: 'elementAs',
  args: {
    elementAs: 'ol',
  },
}
