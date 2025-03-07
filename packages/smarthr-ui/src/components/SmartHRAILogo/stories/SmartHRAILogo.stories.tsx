import React from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { SmartHRAILogo } from '../SmartHRAILogo'

export default {
  title: 'Media（メディア）/SmartHRAILogo',
  component: SmartHRAILogo,
  render: (args) => <SmartHRAILogo {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof SmartHRAILogo>

export const Playground: StoryObj<typeof SmartHRAILogo> = {
  args: {},
}
