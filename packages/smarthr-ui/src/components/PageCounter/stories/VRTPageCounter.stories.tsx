import React from 'react'

import { PageCounter } from '../PageCounter'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/PageCounter/VRT',
  render: (args) => <PageCounter {...args} />,
  args: {
    start: 1,
    end: 50,
    total: 5000,
  },
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
