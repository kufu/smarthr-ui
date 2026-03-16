import { action } from 'storybook/actions'

import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { SideNavItemAnchor, type SideNavSizeType } from '../SideNavItemButton'

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
    onClick: { description: 'SideNavItemAnchor に指定せず、SideNav に指定してください。' },
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

export const Title: StoryObj<typeof SideNavItemAnchor> = {
  name: 'title（非推奨）',
  args: {
    title: 'サイドナビ',
    children: undefined,
  },
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

export const Size: StoryObj<typeof SideNavItemAnchor> = {
  name: 'size',
  render: (args) => (
    <Stack as="ul" className="shr-list-none">
      {[undefined, 'default', 's'].map((size, i) => (
        <SideNavItemAnchor {...args} id={i.toString()} key={i} size={size as SideNavSizeType}>
          サイドナビ{i + 1}
        </SideNavItemAnchor>
      ))}
    </Stack>
  ),
}

export const OnClick: StoryObj<typeof SideNavItemAnchor> = {
  name: 'onClick',
  args: {
    onClick: (e) => {
      action('clicked')(e.currentTarget.value)
    },
  },
}
