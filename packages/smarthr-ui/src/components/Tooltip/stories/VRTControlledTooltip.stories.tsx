import { Cluster } from '../../Layout'
import { ControlledTooltip } from '../ControlledTooltip'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Tooltip（Internal）/ControlledTooltip/VRT',
  render: () => (
    <Cluster className="shr-p-1">
      {['top', 'bottom', 'middle'].map((vertical) =>
        ['center', 'right', 'left'].map((horizontal) => (
          <ControlledTooltip
            key={`${vertical}-${horizontal}`}
            horizontal={horizontal as any}
            vertical={vertical as any}
          >
            吹き出し vertical: {vertical}, horizontal: {horizontal}
          </ControlledTooltip>
        )),
      )}
    </Cluster>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof ControlledTooltip>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
