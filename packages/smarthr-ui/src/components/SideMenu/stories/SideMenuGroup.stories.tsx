import type { Meta, StoryObj } from '@storybook/react'

import { SideMenu, SideMenuGroup, SideMenuItem } from '..'

export default {
  title: 'Components/SideMenu/SideMenuGroup',
  component: SideMenuGroup,
  render: ({ heading, ...args }) => (
    <SideMenu>
      <SideMenuGroup {...args} heading={heading || 'グループタイトル'}>
        <SideMenuItem href="#">メニュー1</SideMenuItem>
        <SideMenuItem href="#">メニュー2</SideMenuItem>
      </SideMenuGroup>
    </SideMenu>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SideMenuGroup>

export const Playground: StoryObj<typeof SideMenuGroup> = {}

export const Heading: StoryObj<typeof SideMenuGroup> = {
  args: {
    heading: 'タイトル',
  },
}
