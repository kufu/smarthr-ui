import { Stack } from '../../Layout'
import { SmartHRAILogo } from '../SmartHRAILogo'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Media（メディア）/SmartHRAILogo/VRT',
  render: (args) => (
    <Stack inline align="start">
      <SmartHRAILogo {...args} width="5em" />
      <SmartHRAILogo {...args} height="2em" />
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof SmartHRAILogo>

export const VRT: StoryObj<typeof SmartHRAILogo> = {}

export const VRTForcedColors: StoryObj<typeof SmartHRAILogo> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
