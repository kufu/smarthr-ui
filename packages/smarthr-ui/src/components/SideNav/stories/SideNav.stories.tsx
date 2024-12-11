/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../Layout'
import { StatusLabel } from '../../StatusLabel'
import { SideNav, SideNavItemButtonProps } from '../SideNav'
import { SideNavItemButton, SideNavSizeType } from '../SideNavItemButton'

import type { Meta, StoryObj } from '@storybook/react'

export const _sideNavItems: SideNavItemButtonProps[] = [
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

export default {
  title: 'Navigation（ナビゲーション）/SideNav',
  component: SideNav,
  argTypes: {
    items: {
      control: false,
    },
  },
  render: (args) => {
    const { items, ...props } = args
    return items ? (
      <SideNav {...props} items={items} />
    ) : (
      <SideNav {...props}>
        {_sideNavItems.map((item) => (
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
    )
  },
  excludeStories: ['_sideNavItems'],
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
      control: { disable: false, type: 'object' },
    },
  },
  args: {
    items: [
      {
        id: 'id-1',
        title: 'サイドナビ1',
        isSelected: false,
      },

      {
        id: 'id-2',
        title: 'サイドナビ2',
        isSelected: true,
      },

      {
        id: 'id-3',
        title: 'サイドナビ3',
        isSelected: false,
        prefix: <StatusLabel>ラベル</StatusLabel>,
      },
    ],
  },
}

export const Size: StoryObj<typeof SideNav> = {
  name: 'size',
  render: (args) => (
    <Stack>
      {[undefined, 'default', 's'].map((size, i) => (
        <SideNav {...args} key={i} size={size as SideNavSizeType}>
          {_sideNavItems.map((item) => (
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
  name: 'onClick',
  args: {
    onClick: (_, id) => {
      action('clicked')(id)
    },
  },
}
