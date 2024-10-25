import { action } from '@storybook/addon-actions'
import React from 'react'

import { TabBar } from '../TabBar'
import { TabItem } from '../TabItem'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Navigation（ナビゲーション）/TabBar',
  component: TabBar,
  subcomponents: { TabItem },
  render: (args) => (
    <TabBar {...args}>
      <TabItem id="tab1" onClick={action('tab1')} selected>
        タブ1
      </TabItem>
      <TabItem id="tab2" onClick={action('tab2')}>
        タブ2
      </TabItem>
    </TabBar>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof TabBar>

export const Playground: StoryObj<typeof TabBar> = {
  args: {
    bordered: true,
  },
}
