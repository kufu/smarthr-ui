import React from 'react'

import { Stack } from '../../Layout'
import { DropZone } from '../DropZone'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/DropZone/VRT',
  render: (args) => (
    <Stack>
      <DropZone {...args} />
      <DropZone {...args}>children あり</DropZone>
      <DropZone {...args} decorators={{ selectButtonLabel: (txt) => `select file.(${txt})` }} />
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof DropZone>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
