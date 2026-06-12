import { Stack } from '../../Layout'

import { BgColor, Padding, Rounded } from './BaseColumn.stories'

import type { BaseColumn } from '../BaseColumn'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Base/BaseColumn/VRT',
  render: (args, context) => (
    <Stack>
      {Padding.render && Padding.render(args, context)}
      {BgColor.render && BgColor.render(args, context)}
      {Rounded.render && Rounded.render(args, context)}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof BaseColumn>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
