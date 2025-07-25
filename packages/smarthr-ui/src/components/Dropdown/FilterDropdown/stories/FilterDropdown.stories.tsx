import { action } from 'storybook/actions'

import { Stack } from '../../../Layout'
import { FilterDropdown } from '../FilterDropdown'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Dropdown/FilterDropdown',
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

export const ResponseStatus: StoryObj<typeof FilterDropdown> = {
  name: 'responseStatus',
  render: (args) => (
    <Stack>
      <FilterDropdown {...args} responseStatus={{ status: 'success', text: '成功' }} />
      <FilterDropdown {...args} responseStatus={{ status: 'error', text: '失敗' }} />
      <FilterDropdown {...args} responseStatus={{ status: 'processing' }} />
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

export const OnlyIconTrigger: StoryObj<typeof FilterDropdown> = {
  name: 'onlyIconTrigger',
  args: {
    onlyIconTrigger: true,
  },
}
