import { StatusLabel } from '../../StatusLabel'
import { SideNavItemAnchor } from '../SideNavItemButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SideNav/SideNavItemAnchor',
  component: SideNavItemAnchor,
  render: (args) => (
    <ul className="shr-list-none">
      <SideNavItemAnchor {...args} />
    </ul>
  ),
  argTypes: {
    id: { control: 'text' },
    children: { control: 'text' },
    current: { control: 'boolean' },
    size: {
      description: 'SideNavItemAnchor に指定せず、SideNav に指定してください。',
    },
  },
  args: {
    id: 'id-1',
    children: 'サイドナビ',
    href: '#1',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SideNavItemAnchor>

export const Playground: StoryObj<typeof SideNavItemAnchor> = {
  args: {},
}

export const Prefix: StoryObj<typeof SideNavItemAnchor> = {
  name: 'prefix',
  args: {
    prefix: <StatusLabel>ラベル</StatusLabel>,
  },
}

export const Selected: StoryObj<typeof SideNavItemAnchor> = {
  name: 'selected',
  args: {
    current: true,
  },
}
