import { action } from '@storybook/addon-actions'
import React from 'react'

import { Cluster } from '../../../Layout'
import { SortDropdown } from '../SortDropdown'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/SortDropdown',
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
