import { Stack } from '../../Layout'
import { StatusLabel } from '../StatusLabel'

import { Bold, Type } from './StatusLabel.stories'

import type { Meta } from '@storybook/react'

export default {
  title: 'Components/StatusLabel/VRT',
  render: (args, context) => (
    <Stack>
      {Type.render?.(args, context)}
      {Bold.render?.(args, context)}
    </Stack>
  ),
  args: {
    children: 'ラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof StatusLabel>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
