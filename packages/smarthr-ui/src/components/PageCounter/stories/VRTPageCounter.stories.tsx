import React from 'react'

import { Stack } from '../../Layout'
import { PageCounter } from '../PageCounter'

import type { Meta, StoryObj } from '@storybook/react'

const cases = [
  { start: 1, end: 50 },
  { start: 1, end: 50, total: 5000 },
  { start: 4951, end: 5000, total: 5000 },
]

export default {
  title: 'Data Display（データ表示）/PageCounter/VRT',
  render: (args) => (
    <Stack>
      {cases.map((props, i) => (
        <PageCounter {...props} {...args} key={i} />
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof PageCounter>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
