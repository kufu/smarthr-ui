import { userEvent, within } from '@storybook/test'
import React, { ComponentProps } from 'react'

import { Cluster } from '../../../Layout'
import { FilterDropdown } from '../FilterDropdown'

import type { Meta, StoryObj } from '@storybook/react'

/**
 * $ pict filter-dropdown.pict
 * triggerSize isFiltered disabled
 * s           true       true
 * s           false      false
 * default     false      true
 * default     true       false
 */
const _cases: Array<
  Pick<ComponentProps<typeof FilterDropdown>, 'isFiltered' | 'triggerSize' | 'disabled'>
> = [
  { triggerSize: 's', isFiltered: true, disabled: true },
  { triggerSize: 's' },
  { isFiltered: false, disabled: true },
  { isFiltered: true },
]

export default {
  title: 'Buttons（ボタン）/FilterDropdown/VRT',
  component: FilterDropdown,
  render: (args) => (
    <Cluster align="center" className="shr-h-screen">
      {_cases.map((props, i) => (
        <FilterDropdown {...args} {...props} key={i} />
      ))}
    </Cluster>
  ),
  args: {
    children: '絞り込みドロップダウンパネル',
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
} as Meta<typeof FilterDropdown>

export const VRT: StoryObj<typeof FilterDropdown> = {}

export const VRTForcedColors: StoryObj<typeof FilterDropdown> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
