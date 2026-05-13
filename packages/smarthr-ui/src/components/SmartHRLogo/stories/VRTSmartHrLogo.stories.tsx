import { Stack } from '../../Layout'
import { SmartHRLogo } from '../SmartHRLogo'

import { Fill } from './SmartHrLogo.stories'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/SmartHRLogo/VRT',
  render: (args, context) => (
    <Stack inline align="start">
      <SmartHRLogo {...args} width="20em" />
      <SmartHRLogo {...args} height="2em" />
      {Fill.render && Fill.render(args, context)}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof SmartHRLogo>

export const VRT: StoryObj<typeof SmartHRLogo> = {}

export const VRTForcedColors: StoryObj<typeof SmartHRLogo> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
