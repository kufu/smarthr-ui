import { Stack } from '../../Layout'
import { SmartHRAILogo } from '../SmartHRAILogo'

import { Fill } from './SmartHRAILogo.stories'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/SmartHRAILogo/VRT',
  render: (args, context) => (
    <Stack inline align="start">
      {([true, false] as const).map((compact) => (
        <Stack key={String(compact)} inline align="start">
          <SmartHRAILogo {...args} compact={compact} width="5em" />
          <SmartHRAILogo {...args} compact={compact} height="2em" />
          {Fill.render && Fill.render({ ...args, compact }, context)}
        </Stack>
      ))}
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
