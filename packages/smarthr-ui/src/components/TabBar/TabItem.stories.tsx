import { action } from '@storybook/addon-actions'
import { type ComponentProps } from 'react'
import React from 'react'

import { Badge } from '../Badge'
import { Heading } from '../Heading'
import { Stack } from '../Layout'

import { TabItem } from './TabItem'

import type { Meta, StoryFn } from '@storybook/react'

const TemplateTabItem: StoryFn<ComponentProps<typeof TabItem>> = (args) => <TabItem {...args} />

export default {
  title: 'Navigation（ナビゲーション）/TabBar/TabItem',
  component: TabItem,
  render: TemplateTabItem,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof TabItem>

export const TabItemControl = {
  name: 'Playground',
  args: {
    children: 'タブ',
    id: 'tab1',
    selected: true,
    disabled: false,
    onClick: action('clicked'),
  },
}

export const Selected = {
  name: 'selected',
  render: () => (
    <Stack gap={2} as="section">
      <Heading>selected</Heading>
      <div>
        <TemplateTabItem id="tab1" onClick={action('clicked')} selected>
          タブ
        </TemplateTabItem>
      </div>
    </Stack>
  ),
}

export const Disabled = {
  name: 'disabled',
  render: () => (
    <Stack gap={2} as="section">
      <Heading>disabled</Heading>
      <div>
        <TemplateTabItem id="tab1" onClick={action('clicked')} disabled>
          タブ
        </TemplateTabItem>
      </div>
    </Stack>
  ),
}

export const Suffix = {
  name: 'suffix',
  render: () => (
    <Stack gap={2} as="section">
      <Heading>suffix</Heading>
      <div>
        <TemplateTabItem id="tab1" onClick={action('clicked')} suffix={<Badge count={1} />}>
          タブ
        </TemplateTabItem>
      </div>
    </Stack>
  ),
}

export const DisabledDetail = {
  name: 'disabledDetail',
  render: () => (
    <Stack gap={2} as="section">
      <Heading>disabledDetail</Heading>
      <div>
        <TemplateTabItem
          id="tab1"
          onClick={action('clicked')}
          disabled
          disabledDetail={{
            message: '無効な理由',
          }}
        >
          タブ
        </TemplateTabItem>
      </div>
    </Stack>
  ),
}
