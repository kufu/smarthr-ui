import React from 'react'

import { Stack } from '../../Layout'
import { Base } from '../Base'

import { Layer, Overflow, Padding, Radius } from './Base.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Base/VRT',
  render: (args, context) => (
    <Stack>
      {Padding.render && Padding.render(args, context)}
      {Radius.render && Radius.render(args, context)}
      {Overflow.render && Overflow.render(args, context)}
      {Layer.render && Layer.render(args, context)}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Base>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
