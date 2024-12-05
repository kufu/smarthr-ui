import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { SideNavItemButton, SideNavSizeType } from '../SideNavItemButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/SideNav/SideNavItemButton',
  component: SideNavItemButton,
  render: (args) => <SideNavItemButton {...args}>サイドナビ</SideNavItemButton>,
  argTypes: {
    id: { control: 'text' },
    isSelected: { control: 'boolean' },
    size: {
      description: 'SideNavItemButton に指定せず、SideNav に指定してください。',
    },
    onClick: { description: 'SideNavItemButton に指定せず、SideNav に指定してください。' },
  },
  args: {
    id: 'id-1',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['skip-test-runner'],
} as Meta<typeof SideNavItemButton>

export const Playground: StoryObj<typeof SideNavItemButton> = {
  args: {},
}

export const Title: StoryObj<typeof SideNavItemButton> = {
  name: 'title（非推奨）',
  args: {
    title: 'サイドナビ',
  },
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
    isSelected: true,
  },
}

export const Size: StoryObj<typeof SideNavItemButton> = {
  name: 'size',
  render: (args) => (
    <Stack>
      {[undefined, 'default', 's'].map((size, i) => (
        <SideNavItemButton {...args} id={i.toString()} key={size} size={size as SideNavSizeType}>
          サイドナビ{i + 1}
        </SideNavItemButton>
      ))}
    </Stack>
  ),
}

export const OnClick: StoryObj<typeof SideNavItemButton> = {
  name: 'onClick',
  args: {
    onClick: (_, id) => {
      action('clicked')(id)
    },
  },
}
