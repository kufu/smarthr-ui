import { action } from 'storybook/actions'

import { Stack } from '../../../Layout'
import { FilterDropdown } from '../FilterDropdown'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dropdown/FilterDropdown',
  component: FilterDropdown,
  render: (args) => <FilterDropdown {...args}>絞り込みドロップダウンパネル</FilterDropdown>,
  argTypes: {},
  args: {
    filtered: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FilterDropdown>

export const Playground: StoryObj<typeof FilterDropdown> = {}

export const Trigger: StoryObj<typeof FilterDropdown> = {
  name: 'trigger',
  args: {
    trigger: 'トリガー',
  },
}
export const TriggerSize: StoryObj<typeof FilterDropdown> = {
  name: 'trigger.size',
  args: {
    trigger: {
      size: 's',
    },
  },
}
export const TriggerOnlyIcon: StoryObj<typeof FilterDropdown> = {
  name: 'trigger.onlyIcon',
  args: {
    trigger: {
      onlyIcon: true,
    },
  },
}

export const ApplyText: StoryObj<typeof FilterDropdown> = {
  name: 'applyText',
  args: {
    applyText: 'applyText',
  },
}
export const CancelText: StoryObj<typeof FilterDropdown> = {
  name: 'cancelText',
  args: {
    cancelText: 'cancelText',
  },
}
export const ResetText: StoryObj<typeof FilterDropdown> = {
  name: 'resetText',
  args: {
    onReset: action('reset'),
    resetText: 'resetText',
  },
}

export const Filtered: StoryObj<typeof FilterDropdown> = {
  name: 'filtered',
  args: {
    filtered: true,
  },
}
export const FilteredIconAlt: StoryObj<typeof FilterDropdown> = {
  name: 'filtered.iconAlt',
  args: {
    filtered: {
      iconAlt: 'icon alt',
    },
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
