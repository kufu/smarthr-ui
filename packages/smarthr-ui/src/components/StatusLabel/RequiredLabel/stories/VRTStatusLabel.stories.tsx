import { RequiredLabel } from '../RequiredLabel'
import Story from './RequiredLabel.stories'

import type { Meta } from '@storybook/react'

export default {
  title: 'States（状態）/StatusLabel/RequiredLabel/VRT',
  render: Story.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof RequiredLabel>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
