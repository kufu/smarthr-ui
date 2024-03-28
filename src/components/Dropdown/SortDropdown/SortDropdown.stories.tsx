import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { SortDropdown } from './SortDropdown'

const meta = {
  title: 'Buttons（ボタン）/Dropdown',
  component: SortDropdown,
  excludeStories: ['Render'],
} satisfies Meta<typeof SortDropdown>
export default meta

type Story = StoryObj<typeof meta>

export const SortDropdownStory: Story = {
  name: 'SortDropdown',
  args: {
    sortFields: [
      { label: '基準日', value: 'date', selected: true },
      { label: '組織図・名簿', value: 'organization' },
    ],
    defaultOrder: 'desc',
    onApply: ({ field, order, newfields }) => console.log('apply!', field, order, newfields),
  },
  render: ({ sortFields, defaultOrder, onApply }) => (
    <SortDropdown sortFields={sortFields} defaultOrder={defaultOrder} onApply={onApply} />
  ),
}
