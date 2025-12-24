import { SideMenu, SideMenuGroup, SideMenuItem } from '..'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SideMenu/SideMenuGroup',
  component: SideMenuGroup,
  render: ({ title, ...rest }) => (
    <SideMenu>
      <SideMenuGroup {...rest} title={title || 'グループタイトル'}>
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

export const Title: StoryObj<typeof SideMenuGroup> = {
  args: {
    title: 'タイトル',
  },
}

export const TitleElementAs: StoryObj<typeof SideMenuGroup> = {
  args: {
    titleElementAs: 'span',
  },
}

export const ListElementAs: StoryObj<typeof SideMenuGroup> = {
  args: {
    listElementAs: 'ol',
  },
}
