import React from 'react'

import { Stack } from '../../Layout'
import { Chip } from '../Chip'

import type { Meta } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Chip/VRT',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, true].map((disabled) => (
        <Chip {...args} disabled={disabled} key={String(disabled)} />
      ))}
    </Stack>
  ),
  args: {
    children: 'ラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Chip>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
