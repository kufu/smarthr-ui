import { action } from '@storybook/addon-actions'
import React from 'react'

import { Stack } from '../../../Layout'
import { FilterDropdown } from '../FilterDropdown'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/FilterDropdown',
  component: FilterDropdown,
  render: (args) => <FilterDropdown {...args}>絞り込みドロップダウンパネル</FilterDropdown>,
  argTypes: {},
  args: {
    isFiltered: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FilterDropdown>

export const Playground: StoryObj<typeof FilterDropdown> = {}

export const TriggerSize: StoryObj<typeof FilterDropdown> = {
  name: 'triggerSize',
  args: {
    triggerSize: 's',
  },
}

export const IsFiltered: StoryObj<typeof FilterDropdown> = {
  name: 'isFiltered',
  args: {
    isFiltered: true,
  },
}

export const Disabled: StoryObj<typeof FilterDropdown> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const ResponseMessage: StoryObj<typeof FilterDropdown> = {
  name: 'responseMessage',
  render: (args) => (
    <Stack>
      <FilterDropdown {...args} responseMessage={{ status: 'success', text: '成功' }} />
      <FilterDropdown {...args} responseMessage={{ status: 'error', text: '失敗' }} />
      <FilterDropdown {...args} responseMessage={{ status: 'processing' }} />
    </Stack>
  ),
  args: {
    children: '絞り込みドロップダウンパネル',
  },
}

export const Handlers: StoryObj<typeof FilterDropdown> = {
  name: 'handlers',
  args: {
    onApply: action('apply'),
    onCancel: action('cancel'),
    onReset: action('reset'),
    onOpen: action('open'),
    onClose: action('close'),
  },
}
