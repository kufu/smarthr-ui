import { action } from 'storybook/actions'

import { Cluster } from '../../../Layout'
import { SortDropdown } from '../SortDropdown'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dropdown/SortDropdown',
  component: SortDropdown,
  render: (args) => <SortDropdown {...args} />,
  args: {
    sortFields: [
      { label: '基準日', value: 'date', selected: true },
      { label: '組織図・名簿', value: 'organization' },
    ],
    defaultOrder: 'desc',
    onApply: action('apply'),
    onCancel: action('cancel'),
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof SortDropdown>

export const Playground: StoryObj<typeof SortDropdown> = {}

export const DefaultOrder: StoryObj<typeof SortDropdown> = {
  name: 'defaultOrder',
  render: (args) => (
    <Cluster align="center">
      <SortDropdown {...args} defaultOrder="desc" />
      <SortDropdown {...args} defaultOrder="asc" />
    </Cluster>
  ),
}

export const Disabled: StoryObj<typeof SortDropdown> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const SortFieldLabel: StoryObj<typeof SortDropdown> = {
  name: 'sortFieldLabel',
  args: {
    sortFieldLabel: 'sortFieldLabel',
  },
}

export const SortOrderLegend: StoryObj<typeof SortDropdown> = {
  name: 'sortOrderLegend',
  args: {
    sortOrderLegend: 'sortOrderLegend',
  },
}

export const AscLabel: StoryObj<typeof SortDropdown> = {
  name: 'ascLabel',
  args: {
    ascLabel: 'ascLabel',
  },
}

export const DescLabel: StoryObj<typeof SortDropdown> = {
  name: 'descLabel',
  args: {
    descLabel: 'descLabel',
  },
}

export const ApplyText: StoryObj<typeof SortDropdown> = {
  name: 'applyText',
  args: {
    applyText: 'applyText',
  },
}

export const CancelText: StoryObj<typeof SortDropdown> = {
  name: 'cancelText',
  args: {
    cancelText: 'cancelText',
  },
}
