import { StatusLabel } from '../../StatusLabel'
import { SideNavItemButton } from '../SideNavItemButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SideNav/SideNavItemButton',
  component: SideNavItemButton,
  render: (args) => (
    <ul className="shr-list-none">
      <SideNavItemButton {...args} />
    </ul>
  ),
  argTypes: {
    id: { control: 'text' },
    children: { control: 'text' },
    current: { control: 'boolean' },
    size: {
      description: 'SideNavItemButton に指定せず、SideNav に指定してください。',
    },
    onClick: { description: 'SideNavItemButton に指定せず、SideNav に指定してください。' },
  },
  args: {
    id: 'id-1',
    children: 'サイドナビ',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SideNavItemButton>

export const Playground: StoryObj<typeof SideNavItemButton> = {
  args: {},
}

export const Prefix: StoryObj<typeof SideNavItemButton> = {
  name: 'prefix',
  args: {
    prefix: <StatusLabel>ラベル</StatusLabel>,
  },
}

export const Selected: StoryObj<typeof SideNavItemButton> = {
  name: 'selected',
  args: {
    current: true,
  },
}
