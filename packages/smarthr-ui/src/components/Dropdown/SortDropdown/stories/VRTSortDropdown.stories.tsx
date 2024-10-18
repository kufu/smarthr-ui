import { userEvent, within } from '@storybook/test'
import React from 'react'

import { Cluster } from '../../../Layout'
import { SortDropdown } from '../SortDropdown'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Buttons（ボタン）/SortDropdown/VRT',
  component: SortDropdown,
  render: (args) => (
    <Cluster align="center" className="shr-h-screen">
      <SortDropdown {...args} defaultOrder="desc" />
      <SortDropdown {...args} defaultOrder="asc" />
    </Cluster>
  ),
  args: {
    sortFields: [
      { label: '基準日', value: 'date', selected: true },
      { label: '組織図・名簿', value: 'organization' },
    ],
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: last } = await canvas.findAllByRole('button')
    userEvent.click(last)
  },
  tags: ['!autodocs'],
} as Meta<typeof SortDropdown>

export const VRT: StoryObj<typeof SortDropdown> = {}

export const VRTForcedColors: StoryObj<typeof SortDropdown> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
