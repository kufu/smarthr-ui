import { Stack } from '../../Layout'

import { Layer, Overflow, Padding, Radius } from './Panel.stories'

import type { Panel } from '../Panel'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Panel/VRT',
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
} as Meta<typeof Panel>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
