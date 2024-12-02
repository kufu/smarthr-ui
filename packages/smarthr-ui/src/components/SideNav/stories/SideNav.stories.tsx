import { action } from '@storybook/addon-actions'
import React, { ComponentProps, useState } from 'react'

import { StatusLabel } from '../../StatusLabel'
import { SideNav } from '../SideNav'

import type { Meta, StoryObj } from '@storybook/react'

type items = ComponentProps<typeof SideNav>['items']

export const SideNavItems: items = [
  {
    id: 'id-1',
    title: ' one!',
    isSelected: true,
  },
  {
    id: 'id-2',
    title: 'two!',
    isSelected: false,
  },
  {
    id: 'id-3',
    title: 'three!',
    isSelected: false,
  },
  {
    id: 'id-4',
    title: 'four!',
    isSelected: false,
    prefix: <StatusLabel>default</StatusLabel>,
  },
  {
    id: 'id-5',
    title: 'five!',
    isSelected: false,
    prefix: <StatusLabel type="blue">blue</StatusLabel>,
  },
]

export default {
  title: 'Navigation（ナビゲーション）/SideNav',
  component: SideNav,
  render: (args) => (
    <div style={{ width: '200px' }}>
      <SideNav {...args} />
    </div>
  ),
  args: {
    size: 'default',
    items: SideNavItems,
  },
  excludeStories: ['SideNavItems'],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SideNav>

export const Playground: StoryObj<typeof SideNav> = {
  args: {},
}

export const Size: StoryObj<typeof SideNav> = {
  args: {
    size: 's',
  },
}

export const OnClick: StoryObj<typeof SideNav> = {
  render: (args) => {
    const [selectItem, setSelectItem] = useState(SideNavItems)
    return (
      <div style={{ width: '200px' }}>
        <SideNav
          {...args}
          items={selectItem}
          onClick={(_, id) => {
            setSelectItem((prevItems) =>
              prevItems.map((item) =>
                item.id === id ? { ...item, isSelected: true } : { ...item, isSelected: false },
              ),
            )
            args.onClick?.(_, id)
          }}
        />
      </div>
    )
  },
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
