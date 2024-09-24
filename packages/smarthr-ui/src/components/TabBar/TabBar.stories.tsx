import { action } from '@storybook/addon-actions'
import React, { type ComponentProps } from 'react'

import { Heading } from '../Heading'
import { Stack } from '../Layout'

import { TabBar } from './TabBar'
import { TabItem } from './TabItem'

import type { Meta, StoryFn } from '@storybook/react'

const Template: StoryFn<ComponentProps<typeof TabBar>> = (args) => (
  <TabBar {...args}>
    <TabItem id="tab1" onClick={action('tab1')} selected>
      タブ1
    </TabItem>
    <TabItem id="tab2" onClick={action('tab2')}>
      タブ2
    </TabItem>
  </TabBar>
)

export default {
  title: 'Navigation（ナビゲーション）/TabBar',
  component: TabBar,
  subcomponents: { TabItem },
  render: Template,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof TabBar>

export const Default = () => (
  <TabBar>
    <TabItem id="tab1" onClick={action('tab1')} selected>
      タブ1
    </TabItem>
    <TabItem id="tab2" onClick={action('tab2')}>
      タブ2
    </TabItem>
  </TabBar>
)

export const Playground = {
  args: {
    bordered: true,
  },
}

export const Boardered = {
  name: 'bordered',
  render: () => (
    <Stack gap={2} as="section">
      <Heading>bordered</Heading>
      <Stack as="section" gap={0.5}>
        <Heading type="blockTitle">線あり（デフォルト）</Heading>
        <Template bordered />
      </Stack>
      <Stack as="section" gap={0.5}>
        <Heading type="blockTitle">線なし</Heading>
        <Template bordered={false} />
      </Stack>
    </Stack>
  ),
}
