import { userEvent, within } from 'storybook/test'

import { Cluster } from '../../../Layout'
import { FilterDropdown } from '../FilterDropdown'

import type { Meta, StoryObj } from '@storybook/react-webpack5'
import type { ComponentProps } from 'react'

/**
 * $ pict filter-dropdown.pict
 * triggerSize isFiltered disabled onlyIconTrigger
 * default     false      false    true
 * s           true       true     false
 * s           false      false    false
 * default     false      true     false
 * default     true       false    false
 */
const _cases: Array<
  Pick<
    ComponentProps<typeof FilterDropdown>,
    'isFiltered' | 'triggerSize' | 'disabled' | 'onlyIconTrigger'
  >
> = [
  { trigger: { onlyIcon: true } },
  { trigger: { size: 's' }, filtered: true, disabled: true },
  { trigger: { size: 's' } },
  { filtered: false, disabled: true },
  { filtered: true },
]

export default {
  title: 'Components/Dropdown/FilterDropdown/VRT',
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

    const { length, 0: first, [length - 1]: last } = await canvas.findAllByRole('button')

    userEvent.hover(first)
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
