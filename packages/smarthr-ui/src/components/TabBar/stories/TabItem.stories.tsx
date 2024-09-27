import { action } from '@storybook/addon-actions'
import React from 'react'

import { Badge } from '../../Badge'
import { TabItem } from '../TabItem'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/TabBar/TabItem',
  component: TabItem,
  render: (args) => <TabItem {...args} />,
  args: {
    children: 'タブ',
    id: 'tab1',
    onClick: action('clicked'),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof TabItem>

export const TabItemControl: StoryObj<typeof TabItem> = {
  name: 'Playground',
  args: {
    selected: true,
    disabled: false,
  },
}

export const Selected: StoryObj<typeof TabItem> = {
  name: 'selected',
  args: {
    selected: true,
  },
}

export const Suffix: StoryObj<typeof TabItem> = {
  name: 'suffix',
  args: {
    suffix: <Badge count={1} />,
  },
}

export const Disabled: StoryObj<typeof TabItem> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const DisabledDetail: StoryObj<typeof TabItem> = {
  name: 'disabledDetail',
  args: {
    disabled: true,
    disabledDetail: {
      message: '無効な理由',
    },
  },
}
