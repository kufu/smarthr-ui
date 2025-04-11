import { Stack } from '../../Layout'
import { Chip } from '../Chip'

import type { Meta } from '@storybook/react'
import { FaCheckIcon, FaCircleXmarkIcon } from '../../Icon'

export default {
  title: 'Data Display（データ表示）/Chip/VRT',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, true].map((disabled, index) => (
        <>
          <Chip {...args} key={`${index}-${disabled}-normal`} disabled={disabled} />
          <Chip
            {...args}
            key={`${index}-${disabled}-prefix`}
            disabled={disabled}
            prefix={<FaCheckIcon />}
          />
          <Chip
            {...args}
            key={`${index}-${disabled}-suffix`}
            disabled={disabled}
            suffix={<FaCircleXmarkIcon />}
          />
        </>
      ))}
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
