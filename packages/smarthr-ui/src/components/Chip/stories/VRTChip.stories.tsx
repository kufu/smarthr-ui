import { Stack } from '../../Layout'
import { Chip } from '../Chip'

import type { Meta } from '@storybook/react-webpack5'

export default {
  title: 'Components/Chip/VRT',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, true].map((disabled) =>
        ['grey', 'blue', 'green', 'orange', 'red'].map((color) => (
          <Chip {...args} disabled={disabled} key={`${disabled}${color}`} color={color as any} />
        )),
      )}
    </Stack>
  ),
  args: {
    children: 'ラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Chip>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
