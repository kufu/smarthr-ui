import { Cluster } from '../../Layout'
import { Balloon } from '../Balloon'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Balloon/VRT',
  render: () => (
    <Cluster className="shr-p-1">
      {['top', 'bottom', 'middle'].map((vertical) =>
        ['center', 'right', 'left'].map((horizontal) => (
          <Balloon
            key={`${vertical}-${horizontal}`}
            horizontal={horizontal as any}
            vertical={vertical as any}
          >
            バルーン vertical: {vertical}, horizontal: {horizontal}
          </Balloon>
        )),
      )}
    </Cluster>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Balloon>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
