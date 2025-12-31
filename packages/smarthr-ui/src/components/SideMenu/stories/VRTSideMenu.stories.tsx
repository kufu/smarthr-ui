import { SideMenu, SideMenuGroup, SideMenuItem } from '..'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SideMenu/VRT',
  component: SideMenu,
  render: () => (
    <SideMenu>
      <SideMenuGroup title="グループタイトル">
        <SideMenuItem href="#">メニュー1</SideMenuItem>
        <SideMenuItem href="#" current>
          メニュー2
        </SideMenuItem>
      </SideMenuGroup>
    </SideMenu>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof SideMenu>

export const VRT = {}

export const VRTForcedColors: StoryObj<typeof SideMenu> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
