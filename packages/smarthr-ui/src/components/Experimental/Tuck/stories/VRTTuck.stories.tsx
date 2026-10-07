import { Stack } from '../../../Layout'

import TuckStories, { MaxLines } from './Tuck.stories'

import type { Tuck } from '../client'
import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Experimental/Tuck/VRT',
  render: (args, context) => (
    <Stack>
      {MaxLines.render?.(args, context)}
      {MaxLines.render?.({ ...args, tucked: { ...args.tucked, scope: 'all' } }, context)}
    </Stack>
  ),
  args: TuckStories.args,
  globals: {
    viewport: { value: 'vrtMobile' },
  },
  parameters: {
    chromatic: {
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Tuck>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
