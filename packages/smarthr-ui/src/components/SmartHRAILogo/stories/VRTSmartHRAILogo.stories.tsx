import React from 'react'

import { SmartHRAILogo } from '../SmartHRAILogo'

import type { Meta } from '@storybook/react'

export default {
  title: 'Media（メディア）/SmartHRAILogo',
  render: (args) => <SmartHRAILogo {...args} />,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof SmartHRAILogo>

export const VRT = {}

export const VRTForcedColors = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
