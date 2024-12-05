/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { SideNav, SideNavItemButtonProps } from '../SideNav'
import { SideNavItemButton, SideNavSizeType } from '../SideNavItemButton'

import type { Meta, StoryObj } from '@storybook/react'

export const SideNavItems: SideNavItemButtonProps[] = [
  {
    id: 'id-1',
    children: 'サイドナビ1',
    isSelected: true,
  },
  {
    id: 'id-2',
    children: 'サイドナビ2',
    isSelected: false,
  },
  {
    id: 'id-3',
    children: 'サイドナビ3',
    isSelected: false,
    prefix: <StatusLabel>ラベル</StatusLabel>,
  },
]

const _sideItems: { [key: string]: SideNavItemButtonProps[] } = {
  notSelected: [
    {
      id: 'id-1',
      title: 'サイドナビ',
      isSelected: false,
    },
  ],
  isSelected: [
    {
      id: 'id-1',
      title: 'サイドナビ',
      isSelected: true,
    },
  ],
  prefix: [
    {
      id: 'id-1',
      title: 'サイドナビ',
      isSelected: false,
      prefix: <StatusLabel>ラベル</StatusLabel>,
    },
  ],
}

export default {
  title: 'Navigation（ナビゲーション）/SideNav',
  component: SideNav,
  render: (args) => (
    <SideNav {...args}>
      {SideNavItems.map((item) => (
        <SideNavItemButton
          key={item.id}
          id={item.id}
          isSelected={item.isSelected}
          prefix={item.prefix}
        >
          {item.children}
        </SideNavItemButton>
      ))}
    </SideNav>
  ),
  excludeStories: ['SideNavItems'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SideNav>

export const Playground: StoryObj<typeof SideNav> = {
  args: {},
}

export const Items: StoryObj<typeof SideNav> = {
  name: 'items（非推奨）',
  argTypes: {
    items: {
      control: 'radio',
      options: Object.keys(_sideItems),
      mapping: _sideItems,
    },
  },
  args: {
    items: _sideItems.notSelected,
  },
  render: (args) => <SideNav items={args.items} />,
}

export const Size: StoryObj<typeof SideNav> = {
  name: 'size',
  render: (args) => (
    <Stack>
      {[undefined, 'default', 's'].map((size, i) => (
        <SideNav {...args} key={size} size={size as SideNavSizeType}>
          {SideNavItems.map((item) => (
            <SideNavItemButton
              key={item.id + i}
              id={item.id + i}
              isSelected={item.isSelected}
              prefix={item.prefix}
            >
              {item.children}
            </SideNavItemButton>
          ))}
        </SideNav>
      ))}
    </Stack>
  ),
}

export const OnClick: StoryObj<typeof SideNav> = {
  args: {
    onClick: (_, id) => {
      action('clicked')(id)
    },
  },
}

export const ClassName = {
  args: {
    className: 'shr-bg-white',
  },
}
