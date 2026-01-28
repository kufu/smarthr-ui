import { SideMenu, SideMenuGroup, SideMenuItem } from '..'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SideMenu/SideMenuGroup',
  component: SideMenuGroup,
  render: ({ heading, ...rest }) => (
    <SideMenu>
      <SideMenuGroup {...rest} heading={heading || 'グループタイトル'}>
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
