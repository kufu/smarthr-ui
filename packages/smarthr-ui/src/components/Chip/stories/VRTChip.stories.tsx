import { Stack } from '../../Layout'
import { Chip, classNameGenerator } from '../Chip'

import type { Meta } from '@storybook/react'

export default {
  title: 'Components/Chip/VRT',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, true].map((disabled) =>
        Object.keys(classNameGenerator.variants.color).map((color) => (
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
