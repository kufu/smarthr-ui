import React from 'react'

import { Stack } from '../../Layout'
import { StatusLabel, statusLabel } from '../StatusLabel'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/StatusLabel',
  component: StatusLabel,
  render: (args) => <StatusLabel {...args} />,
  args: {
    children: 'ステータスラベル',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof StatusLabel>

export const Playground: StoryObj<typeof StatusLabel> = {
  args: {},
}

export const Type: StoryObj<typeof StatusLabel> = {
  name: 'type',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, ...Object.keys(statusLabel.variants.type)].map((type) => (
        <StatusLabel {...args} type={type as any} key={type} />
      ))}
    </Stack>
  ),
}

export const Bold: StoryObj<typeof StatusLabel> = {
  name: 'bold',
  render: (args) => (
    <Stack align="flex-start">
      {[undefined, ...Object.keys(statusLabel.variants.type)].map((type) => (
        <StatusLabel {...args} type={type as any} bold key={type} />
      ))}
    </Stack>
  ),
}
