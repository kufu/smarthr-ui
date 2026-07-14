import { Stack } from '../../Layout'

import { BgColor, Padding, Rounded } from './Groupbox.stories'

import type { Base } from '../Base'
import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Base/Groupbox/VRT',
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
} as Meta<typeof Base>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
